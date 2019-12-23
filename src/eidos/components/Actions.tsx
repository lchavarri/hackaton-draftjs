import React, { Dispatch } from 'react';
import { Button } from 'semantic-ui-react';

import { IState } from '../redux/reducer';
import { getKernelStatus } from '../redux/selectors';
import { KernelStatus } from '../../shared/ui/services/jupyterService';
import Tooltip from '../../shared/ui/components/Tooltip';
import useKernelActions from '../hooks/useKernelActions';

type Props = {
  state: IState;
  dispatch: Dispatch<{ type: string; payload: any }>;
};

export default function Actions(props: Props) {
  const { state, dispatch } = props;

  const [disabledActions, start, restart, interrupt] = useKernelActions(
    state,
    dispatch
  );
  const [startDisabled, restartDisabled, interruptDisabled] = disabledActions;

  const status = getKernelStatus(state);
  switch (status) {
    case KernelStatus.IDLE:
    case KernelStatus.CONNECTED:
      return (
        <Button
          className="cta"
          basic
          primary
          disabled={restartDisabled}
          onClick={restart}
        >
          Restart
        </Button>
      );
    case KernelStatus.STOPPED:
      return (
        <Button basic primary disabled={startDisabled} onClick={start}>
          Start
        </Button>
      );
    case KernelStatus.BUSY:
      return (
        <Tooltip
          text="Cancelling will interrupt all processes on the page."
          severity="warning"
          trigger={
            <Button
              basic
              primary
              disabled={interruptDisabled}
              onClick={interrupt}
            >
              Interrupt
            </Button>
          }
        />
      );
    default:
      return null;
  }
}
