import React from 'react';

import { IState } from '../redux/reducer';
import { getKernelStatus } from '../redux/selectors';
import { KernelStatus } from '../../shared/ui/services/jupyterService';

type Props = {
  state: IState;
};

const statusDictionary = {
  [KernelStatus.IDLE]: 'connected.',
  [KernelStatus.CONNECTED]: 'connected.',
  [KernelStatus.STOPPED]: 'stopped.',
  [KernelStatus.BUSY]: 'Working...',
  [KernelStatus.UNKNOWN]: 'working...',
  [KernelStatus.STARTING]: 'starting...',
  [KernelStatus.RECONNECTING]: 'reconnecting...',
  [KernelStatus.RESTARTING]: 'restarting...'
};

export default function Status(props: Props) {
  const { state } = props;
  const status = getKernelStatus(state);

  const sessionText = status !== KernelStatus.BUSY ? 'Session' : '';

  const getIndicator = () => {
    switch (status) {
      case KernelStatus.IDLE:
      case KernelStatus.CONNECTED:
        return 'connected';
      case KernelStatus.STOPPED:
        return 'stopped';
      default:
        return 'busy';
    }
  };

  return (
    <div className="session-manager-status">
      <span className={`status-indicator ${getIndicator()}`} />
      <span>
        <strong>{sessionText}</strong> {statusDictionary[status]}
      </span>
    </div>
  );
}
