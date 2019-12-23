import { Dispatch, useEffect, useState } from 'react';

import {
  startKernel,
  killKernel,
  restartKernel,
  interruptKernel
} from '../redux/actions';
import { getKernelStatus, isRequestPending } from '../redux/selectors';
import { KernelStatus } from '../../shared/ui/services/jupyterService';
import { IState } from '../redux/reducer';

const useKernelActions = (
  state: IState,
  dispatch: Dispatch<{
    type: string;
    payload: any;
  }>
) => {
  const [disabledActions, setDisabledActions] = useState<any>([]);

  const status = getKernelStatus(state);
  const requestPending = isRequestPending(state);

  /**
   * Jupyter action methods
   */

  const start = async () => {
    return await startKernel(dispatch);
  };

  const restart = async () => {
    return await restartKernel(dispatch);
  };

  const interrupt = async () => {
    return await interruptKernel(dispatch);
  };

  const shutdown = async () => {
    return await killKernel(dispatch);
  };

  /**
   * Jupyter actions logic for enable/disable UI controls
   */

  useEffect(() => {
    const startDisabled = requestPending || status !== KernelStatus.STOPPED;
    const restartDisabled = requestPending || status === KernelStatus.STOPPED;
    const interruptDisabled = status !== KernelStatus.BUSY;
    const shutdownDisabled = restartDisabled;

    setDisabledActions([
      startDisabled,
      restartDisabled,
      interruptDisabled,
      shutdownDisabled
    ]);
  }, [requestPending, status]);

  return [disabledActions, start, restart, interrupt, shutdown];
};

export default useKernelActions;
