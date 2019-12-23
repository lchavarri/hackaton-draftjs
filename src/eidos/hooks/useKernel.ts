import { useEffect, useState, useContext, Dispatch } from "react";

import { Context } from "../../shared/ui/main/main";
import jupyterService, {
  KernelStatus,
  IKernel
} from "../../shared/ui/services/jupyterService";
import { IState } from "../redux/reducer";
import useKernelActions from "./useKernelActions";

const useKernel = (
  state: IState,
  dispatch: Dispatch<{ type: string; payload: any }>
): [KernelStatus] => {
  const appContext = useContext(Context);
  const [, startKernel] = useKernelActions(state, dispatch);

  const [kernelStatus, setKernelStatus] = useState(KernelStatus.RECONNECTING);

  /**
   * On mount get the document's kernelId and subscribe to changes.
   * If there isn't any kernelId then start a new Kernel.
   */
  useEffect(() => {
    function subscribeToStatusChange() {
      jupyterService.onStatusChanged((status: any) => {
        setKernelStatus(status);
      });
    }

    async function connectKernel() {
      await jupyterService.getNotebook(appContext.documentId);

      const kernel = await jupyterService.getNotebookKernel();
      if (kernel) {
        await jupyterService.connectToKernel(kernel);
      } else {
        await startKernel();
      }

      subscribeToStatusChange();

      // Listener on JupyterHub for Kernel changes
      jupyterService.onKernelRunningChanged(async (kernel: IKernel | null) => {
        if (kernel) {
          // Renew subscription to updated Kernel
          subscribeToStatusChange();
        } else {
          setKernelStatus(KernelStatus.STOPPED);
        }
      });
    }

    connectKernel();

    //TODO: analyze unsubscriptions on jupyterService
    //eslint-disable-next-line
  }, []);

  return [kernelStatus];
};

export default useKernel;
