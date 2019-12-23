import * as actionTypes from './actionTypes';
import jupyterService, {
  IKernelInfo,
  KernelStatus
} from '../../shared/ui/services/jupyterService';

export const updateKernelStatus = async (
  dispatch: Function,
  newStatus: KernelStatus
) => {
  dispatch({ type: actionTypes.UPDATE_KERNEL_STATUS, payload: newStatus });
};

export const startKernel = async (dispatch: Function) => {
  return kernelActionFactory(
    dispatch,
    jupyterService.startNewKernel(),
    actionTypes.START_KERNEL_FETCH,
    actionTypes.START_KERNEL_SUCCESS,
    actionTypes.START_KERNEL_ERROR
  );
};

export const interruptKernel = async (dispatch: Function) => {
  return kernelActionFactory(
    dispatch,
    jupyterService.interrupt(),
    actionTypes.INTERRUPT_KERNEL_FETCH,
    actionTypes.INTERRUPT_KERNEL_SUCCESS,
    actionTypes.INTERRUPT_KERNEL_ERROR
  );
};

export const restartKernel = async (dispatch: Function) => {
  return kernelActionFactory(
    dispatch,
    jupyterService.restartKernel(),
    actionTypes.RESTART_KERNEL_FETCH,
    actionTypes.RESTART_KERNEL_SUCCESS,
    actionTypes.RESTART_KERNEL_ERROR
  );
};

export const killKernel = async (dispatch: Function) => {
  return kernelActionFactory(
    dispatch,
    jupyterService.shutdownKernel(),
    actionTypes.KILL_KERNEL_FETCH,
    actionTypes.KILL_KERNEL_SUCCESS,
    actionTypes.KILL_KERNEL_ERROR
  );
};

/**
 * Returns kernel info - Stopped if there is not active kernel
 *
 * @returns {IKernelInfo}
 */
const getKernelInfo = async (): Promise<IKernelInfo> => {
  let kernel = null;
  try {
    kernel = (await jupyterService.getNotebookKernel()) as any;
  } catch (error) {
    console.error(error);
  }

  if (!kernel) {
    return {
      id: '',
      status: KernelStatus.STOPPED
    };
  }

  const { id, execution_state } = kernel;
  return {
    id,
    status: execution_state as KernelStatus
  };
};

const kernelActionFactory = async (
  dispatch: Function,
  kernelActionPromise: Promise<any>,
  actionFetch: string,
  actionSuccess: string,
  actionError: string
) => {
  // Set the pending status
  dispatch({
    type: actionFetch
  });

  try {
    // After the kernel action was completed refetch the kernel for dispatching the new status
    await kernelActionPromise;
    const kernelInfo: IKernelInfo = await getKernelInfo();

    dispatch({
      type: actionSuccess,
      payload: kernelInfo
    });

    return kernelInfo;
  } catch (err) {
    //TODO: test error handlers
    dispatch({
      type: actionError,
      payload: err
    });

    return err;
  }
};
