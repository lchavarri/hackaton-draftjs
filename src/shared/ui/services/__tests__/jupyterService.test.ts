// Mock jupyterLab services module
jest.mock('@jupyterlab/services');

// Mock fetch built-in feature
import { FetchMock } from 'jest-fetch-mock';
const fetchMock = fetch as FetchMock;

// Test imports
import { expectToThrow } from '../../__mocks__/testUtils';
import { ServerConnection, KernelManager, Kernel } from '@jupyterlab/services';
import jupyterService from '../jupyterService';

describe('Jupyter Service', () => {
  let kernel = {
    id: 'kernelId',
    name: 'kernelName'
  };
  let documentId: 'testDocumentId';
  let notebookData = {
    notebook_uri: 'testNotebookURI',
    notebook_token: 'testNotebookToken'
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Get Notebook', () => {
    beforeEach(() => {
      fetchMock.resetMocks();
      jest.resetAllMocks();
    });

    it('should return notebook data on success', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(notebookData));

      const data = await jupyterService.getNotebook(documentId);
      expect(data).toMatchObject(notebookData);

      return data;
    });

    it('should throw an error on fail', (done: Function) => {
      fetchMock.mockRejectOnce(new Error('Some Backend Error'));

      expectToThrow(jupyterService.getNotebook(documentId), done);
    });

    it('should init settings after success', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(notebookData));

      await jupyterService.getNotebook(documentId);
      expect(ServerConnection.makeSettings).toHaveBeenCalledWith(
        expect.objectContaining({
          baseUrl: notebookData.notebook_uri,
          token: notebookData.notebook_token
        })
      );
    });

    it('should create kernelManager after success', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(notebookData));
      expect(KernelManager).not.toHaveBeenCalled();

      await jupyterService.getNotebook(documentId);
      expect(KernelManager).toHaveBeenCalled();
    });
  });

  describe('Get Notebook Kernel', () => {
    beforeEach(() => {
      fetchMock.resetMocks();
      jest.restoreAllMocks();

      jupyterService.reset();
    });

    it('should return undefined if notebook was not connected', async () => {
      const notebookKernel = await jupyterService.getNotebookKernel();
      expect(notebookKernel).toBeUndefined();
    });

    it('should return the running Kernel on success', async () => {
      // Init Notebook mocks
      KernelManager.prototype.running = jest.fn().mockReturnValue({
        next: () => kernel
      });
      fetchMock.mockResponseOnce(JSON.stringify(notebookData));
      await jupyterService.getNotebook(documentId);

      // Execute test
      const notebookKernel = await jupyterService.getNotebookKernel();
      expect(notebookKernel).toMatchObject(kernel);
    });

    it('should throw an error on fail', async (done: Function) => {
      // Init Notebook mocks
      KernelManager.prototype.running = jest.fn().mockReturnValue({
        next: () => {
          throw new Error('Some error on JH running method');
        }
      });
      fetchMock.mockResponseOnce(JSON.stringify(notebookData));
      await jupyterService.getNotebook(documentId);

      expectToThrow(jupyterService.getNotebookKernel(), done, 'JH running');
    });
  });

  describe('Start new Kernel', () => {
    let connectKernelSpy;
    let startNewKernelSpy;

    beforeEach(async () => {
      fetchMock.resetMocks();
      jest.resetAllMocks();

      startNewKernelSpy = jest.fn().mockReturnValue(kernel as Kernel.IKernel);
      KernelManager.prototype.startNew = startNewKernelSpy;

      fetchMock.mockResponseOnce(
        JSON.stringify({ notebook_uri: 'URI', notebook_token: 'TOKEN' })
      );
      await jupyterService.getNotebook('testDoc');

      jest.spyOn(jupyterService, 'getNotebookKernel').mockResolvedValue(kernel);
      connectKernelSpy = jest
        .spyOn(jupyterService, 'connectToKernel')
        .mockReturnValue(kernel as Kernel.IKernel);
    });

    it('should return the Kernel on success', async () => {
      const data = await jupyterService.startNewKernel();
      expect(data).toMatchObject(kernel);
    });

    it('should return undefined if notebook was not connected', async () => {
      jupyterService.reset();

      const data = await jupyterService.startNewKernel();
      expect(data).toBeUndefined();
    });

    it('should throw an error on fail', (done: Function) => {
      jest.spyOn(jupyterService, 'connectToKernel').mockImplementation(() => {
        throw new Error('Mocked error');
      });

      expectToThrow(jupyterService.startNewKernel(), done);
    });

    it('should call connect if there is an already running Kernel', async () => {
      await jupyterService.startNewKernel();
      expect(connectKernelSpy).toHaveBeenCalledWith(
        expect.objectContaining(kernel)
      );
    });

    it('should call startNew if there is not any running Kernel', async () => {
      jest.spyOn(jupyterService, 'getNotebookKernel').mockReturnValue(null);

      await jupyterService.startNewKernel();
      expect(startNewKernelSpy).toHaveBeenCalled();
    });
  });

  describe('Connect to Kernel', () => {
    const testModel = { id: 'testId', name: 'testName' };
    let connectToSpy;

    beforeEach(async () => {
      fetchMock.resetMocks();
      jest.restoreAllMocks();

      // KernelManager mocks
      connectToSpy = jest.fn().mockReturnValue(kernel);
      KernelManager.prototype.connectTo = connectToSpy;

      // Init Notebook mocks
      fetchMock.mockResponseOnce(JSON.stringify(notebookData));
      await jupyterService.getNotebook(documentId);
    });

    it('should call connect with model as parameter', () => {
      jupyterService.connectToKernel(testModel);
      expect(connectToSpy).toHaveBeenCalledWith(testModel);
    });

    it('should return the connected Kernel on success', () => {
      const connectedKernel = jupyterService.connectToKernel(testModel);
      expect(connectedKernel).toMatchObject(kernel);
    });

    it('should return undefined if notebook was not connected', () => {
      jupyterService.reset();

      const connectedKernel = jupyterService.connectToKernel(testModel);
      expect(connectedKernel).toBeUndefined();
    });

    it('should throw an error on fail', (done: Function) => {
      // Init Notebook mocks
      KernelManager.prototype.connectTo = jest.fn().mockImplementation(() => {
        throw new Error('Some error on JH connectTo');
      });
      fetchMock.mockResponseOnce(JSON.stringify(notebookData));

      // Emulate real usage scenario
      const testFn = async () => {
        await jupyterService.getNotebook(documentId);
        jupyterService.connectToKernel(testModel);
      };

      expectToThrow(testFn(), done, 'JH connectTo');
    });
  });

  xdescribe('Interrupt', () => {
    it('should call interrupt on the running Kernel', () => {});
    it('should throw an error on fail', () => {
      //Need to throw error on catch
    });
    it('should throw an error if there is no running Kernel', () => {});
  });

  xdescribe('Restart', () => {
    it('should call restart on the running Kernel', () => {});
    it('should throw an error on fail', () => {
      //Need to throw error on catch
    });
    it('should throw an error if there is no running Kernel', () => {});
  });

  xdescribe('Shutdown', () => {
    it('should call shutdownAll on the kernel manager', () => {});
    it('should call refreshRunning after shutdown', () => {});
    it('should throw an error on fail', () => {
      //Need to throw error on catch
    });
    it('should throw an error if there is no running Kernel', () => {});
  });

  xdescribe('On Status Change', () => {
    it("should subscribe callback to Kernel's statusChangeEvent with new status", () => {});
    it("should subscribe callback to Kernel's terminatedEvent with status 'Stopped'", () => {});
  });

  describe('On KernelRunning Change', () => {
    let unsubscribeSpy = jest.fn();
    let emulateSignal;

    beforeEach(async () => {
      fetchMock.resetMocks();
      jest.resetAllMocks();

      (KernelManager.prototype as any).runningChanged = {
        connect: returnedHandler => {
          emulateSignal = returnedHandler;
        },
        disconnect: unsubscribeSpy
      };
      KernelManager.prototype.connectTo = jest.fn().mockReturnValue(kernel);

      jupyterService.reset();
      fetchMock.mockResponseOnce(JSON.stringify(notebookData));
      await jupyterService.getNotebook(documentId);
    });

    it("should subscribe callback to Kernel's runningChangeEvent", () => {
      jupyterService.onKernelRunningChanged(() => {});
      expect(emulateSignal).toBeDefined();
    });

    it('should return an unsuscribe method', () => {
      const dereg = jupyterService.onKernelRunningChanged(() => {});
      expect(unsubscribeSpy).not.toHaveBeenCalled();
      dereg();
      expect(unsubscribeSpy).toHaveBeenCalled();
    });

    it('should return undefined if there is no manager', () => {
      jupyterService.reset();

      const dereg = jupyterService.onKernelRunningChanged(() => {});
      expect(dereg).toBeUndefined();
    });

    it("should call back with 'null' if no running Kernels", async () => {
      const callbackSpy = jest.fn();
      jupyterService.onKernelRunningChanged(callbackSpy);

      // Returned handler on subscription
      await emulateSignal(null, []);

      expect(callbackSpy).toHaveBeenCalledWith(null);
    });

    it('should call back with activeKernel if there is any', async () => {
      const callbackSpy = jest.fn();
      jupyterService.onKernelRunningChanged(callbackSpy);

      // Returned handler on subscription
      await emulateSignal(null, [kernel]);

      expect(callbackSpy).toHaveBeenCalledWith(kernel);
    });

    it('should connect new activeKernel', async () => {
      const callbackSpy = jest.fn();
      jupyterService.onKernelRunningChanged(callbackSpy);

      const connectToSpy = jest.spyOn(jupyterService, 'connectToKernel');

      // Returned handler on subscription
      const newKernel = { id: 'test123', name: '123' };
      await emulateSignal(null, [newKernel]);

      expect(connectToSpy).toHaveBeenCalledWith(newKernel);
    });

    it('should not call back if activeKernel is equal to currentKernel', async () => {
      const callbackSpy = jest.fn();
      jupyterService.onKernelRunningChanged(callbackSpy);

      // Set kernel
      await jupyterService.connectToKernel(kernel);

      // Returned handler on subscription
      await emulateSignal(null, [kernel]);

      expect(callbackSpy).not.toHaveBeenCalled();
    });
  });

  xdescribe('On Execute code', () => {
    it("should call Kernel's requestExecute using code as parameter", () => {});
    it('should return messages coming from Kernel future', () => {});
    it('should filter statusChange type messages', () => {});
    it('should throw an error if there is no Kernel', () => {
      //Need to throw error on catch
    });
    it('should throw an error if execution was aborted', () => {});
  });
});
