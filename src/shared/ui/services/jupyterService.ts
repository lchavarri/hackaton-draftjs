import {
  Kernel,
  ServerConnection,
  KernelMessage,
  KernelManager
} from '@jupyterlab/services';

const JUPYTER_ENDPOINT: RequestInfo =
  process.env.REACT_APP_JUPYTER_HUB_ENDPOINT || '';

type NotebookData = {
  notebook_uri: string;
  notebook_token: string;
};

export enum KernelStatus {
  UNKNOWN = 'unknown',
  STARTING = 'starting',
  RECONNECTING = 'reconnecting',
  IDLE = 'idle',
  BUSY = 'busy',
  RESTARTING = 'restarting',
  STOPPED = 'dead',
  CONNECTED = 'connected'
}

export enum KernelErrorType {
  UNKNOWN = 'unknown',
  UNABLE_TO_CONNECT_TO_HUB = 'unable to connect to hub',
  KERNEL_NOT_CONNECTED = 'kernel not connected',
  EXECUTION_ABORTED = 'execution aborted'
}

export class KernelError extends Error {
  type: KernelErrorType;
  message: string;
  constructor(type: KernelErrorType, message: string) {
    super();
    this.type = type;
    this.message = message;
  }
}

// Exporting our own IKernel interface to encapsulate the use of @jupyterlab library to this service
export interface IKernel extends Kernel.IKernel {}
export interface IKernelMessage {
  msg_id?: string;
  msg_type?: string;
  content: any;
}

export interface IKernelInfo {
  id: string;
  status: KernelStatus;
}

/**
 * Class representing a Jupyter Service.
 * @class
 */
class JupyterService {
  private _kernel: IKernel | null = null;
  private _options: Kernel.IOptions | undefined;
  private _settings: ServerConnection.ISettings | undefined;
  private _manager: KernelManager | null = null;

  /**
   * @private
   * Initializes Notebook Server Connnection
   *
   * @param {NotebookData} data - The required data to start notebook server
   */
  private initSettings(data: NotebookData): void {
    const { notebook_uri, notebook_token } = data;

    this._settings = ServerConnection.makeSettings({
      baseUrl: notebook_uri,
      token: notebook_token,
      init: { cache: 'no-store' }
    });

    this._options = {
      serverSettings: this._settings
    };
  }

  /**
   * @public
   * Fetchs from backend the notebook data for a given document.
   *
   * @param {string} document_id - The required document id to find notebook
   */
  async getNotebook(document_id: string): Promise<NotebookData> {
    try {
      const jupyterHubResponse = await fetch(JUPYTER_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify({ document_id })
      });
      const notebookData: NotebookData = await jupyterHubResponse.json();

      // Store the settings for this notebook
      this.initSettings(notebookData);

      //Initialize a Kernel manager to execute actions on this Notebook kernels
      this._manager = new KernelManager(this._options);

      return notebookData;
    } catch (e) {
      throw new KernelError(
        KernelErrorType.UNABLE_TO_CONNECT_TO_HUB,
        e.message
      );
    }
  }

  /**
   * @public
   * Starts a new kernel on current notebook server if there isn't one already running.
   * Otherwise will connect with active kernel
   *
   * @returns {Promise<IKernel>}
   */
  async startNewKernel(): Promise<IKernel | undefined> {
    if (this._manager) {
      const activeKernel = await this.getNotebookKernel();
      if (activeKernel) {
        return this.connectToKernel(activeKernel);
      }

      this._kernel = await this._manager.startNew(this._options);

      // This speed up the notifications to runningChanged event
      this._manager.refreshRunning();

      return this._kernel;
    }
  }

  /**
   * @public
   * Returns active kernel model from manager
   *
   * @returns {Promise<Kernel.IModel | undefined>}
   */
  async getNotebookKernel(): Promise<Kernel.IModel | undefined> {
    if (!this._manager) {
      return;
    }
    await this._manager.refreshRunning();
    const iterator = this._manager.running();
    return iterator.next();
  }

  /**
   * @public
   * Receives a Kernel Model and connects to the given model.
   *
   * @param {Kernel.IModel} model - The kernel model to connect
   *
   * @returns {IKernel}
   */
  connectToKernel(model: Kernel.IModel): IKernel | undefined {
    if (!this._manager) {
      return;
    }
    this._kernel = this._manager.connectTo(model);
    return this._kernel;
  }

  /**
   * @public
   * Interrupts current active kernel activity.
   *
   * @returns {Promise<void>}
   */
  public async interrupt(): Promise<void> {
    if (this._kernel) {
      return this._kernel.interrupt();
    } else {
      throw new KernelError(
        KernelErrorType.KERNEL_NOT_CONNECTED,
        'Unable to interrupt'
      );
    }
  }

  /**
   * @public
   * Restarts current active kernel
   *
   * @returns {Promise<void>}
   */
  public async restartKernel(): Promise<void> {
    if (this._kernel) {
      return this._kernel.restart();
    } else {
      throw new KernelError(
        KernelErrorType.KERNEL_NOT_CONNECTED,
        'Unable to restart'
      );
    }
  }

  /**
   * @public
   * Shuts kernel down in notebook server
   *
   * @returns {Promise<void>}
   */
  public async shutdownKernel(): Promise<void> {
    if (this._manager) {
      await this._manager.shutdownAll();

      // This speed up the notifications to runningChanged event
      this._manager.refreshRunning();

      return;
    } else {
      throw new KernelError(
        KernelErrorType.KERNEL_NOT_CONNECTED,
        'Unable to shutdown'
      );
    }
  }

  /**
   * @public
   * Kernel status change listener.
   *
   * @param {Function} callback - The callback to execute when kernel status has changed
   */
  public onStatusChanged(callback: Function): void {
    if (this._kernel) {
      this._kernel.statusChanged.connect((slot: any, status: Kernel.Status) =>
        callback(status)
      );
      this._kernel.terminated.connect(() => {
        this._kernel = null;
        callback(KernelStatus.STOPPED);
      });
    }
  }

  /**
   * @public
   * KernelManager change listener.
   *
   * @param {Function} callback - The callback to execute when kernels changed
   *
   * @return {Function | undefined} dereg - The function to unsubscribe
   */
  public onKernelRunningChanged(callback: Function): Function | undefined {
    if (!this._manager) {
      return;
    }

    const handler = async (slot: any, runningKernels: Kernel.IModel[]) => {
      if (!runningKernels || !runningKernels.length) {
        this._kernel = null;
        return callback(null);
      }

      const activeKernel = runningKernels[runningKernels.length - 1];
      if (!this._kernel || this._kernel.id !== activeKernel.id) {
        const newKernel = await this.connectToKernel(activeKernel);
        callback(newKernel);
      }
    };

    // Subscribe handler to signal
    this._manager.runningChanged.connect(handler);

    // Unsubscribe method
    return () =>
      this._manager && this._manager.runningChanged.disconnect(handler);
  }

  /**
   * @public
   * Executes on kernel the given python code and manages execution results
   *
   * @param {string} code - The code to execute on current kernel
   *
   * @returns {IKernelMessage[]}
   */
  public executeCode = async (code: string): Promise<any> => {
    const requestExec = async (kernel: IKernel | null = this._kernel) => {
      if (!kernel) {
        throw new KernelError(
          KernelErrorType.KERNEL_NOT_CONNECTED,
          'Unable to connect'
        );
      }

      try {
        const future: any = kernel.requestExecute({
          code,
          stop_on_error: true
        });

        // TODO: analyze to send responses to store as they get in
        let response: Array<IKernelMessage> = [];

        future.onIOPub = (message: KernelMessage.IIOPubMessage) => {
          if (!KernelMessage.isStatusMsg(message)) {
            response.push(message);
          }
        };

        const reply = await future.done;
        const replyStatus = reply && reply.content && reply.content.status;
        if (replyStatus === 'aborted') {
          throw new KernelError(
            KernelErrorType.EXECUTION_ABORTED,
            'Aborted code execution'
          );
        }

        // PyDocs are not returned through IOPub so we need to extract them from reply
        if (code.includes('?') && Array.isArray(reply.content.payload)) {
          reply.content.payload.forEach((item: any) => {
            response.push({
              msg_id: (reply as any).msg_id,
              msg_type: 'ansi_result',
              content: { data: item.data }
            });
          });
        }

        return response;
      } catch (e) {
        console.error(e);
        throw e;
      }
    };

    try {
      // Get active kernel model
      const model = await this.getNotebookKernel();
      if (!model) {
        throw new KernelError(
          KernelErrorType.KERNEL_NOT_CONNECTED,
          'Unable to reconnect'
        );
      }

      // Cases to restart: kernel state not updated (dead) or a new kernel was started
      const shouldRestart: boolean =
        !this._kernel ||
        this._kernel.id !== model.id ||
        this._kernel.status === KernelStatus.STOPPED;

      // Connecting service to active kernel
      const newKernel = shouldRestart
        ? await this.connectToKernel(model)
        : this._kernel;

      // Execute code on new kernel kernel
      return requestExec(newKernel);
    } catch (e) {
      throw new KernelError(KernelErrorType.KERNEL_NOT_CONNECTED, e.message);
    }
  };

  /**
   * @public
   * Reset the service to the initial state
   */
  public reset() {
    this._kernel = null;
    this._manager = null;
  }
}

export default new JupyterService();
