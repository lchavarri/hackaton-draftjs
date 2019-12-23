import { Dispatch } from 'react';

import { IState } from '../redux/reducer';
import useKernelActions from './useKernelActions';
import useActionsMenu from '../../shared/ui/hooks/useActionsMenu';

const useCustomMenu = (
  state: IState,
  dispatch: Dispatch<{
    type: string;
    payload: any;
  }>
) => {
  const [
    disabledActions,
    start,
    restart,
    interrupt,
    shutdown
  ] = useKernelActions(state, dispatch);
  const [
    startDisabled,
    restartDisabled,
    interruptDisabled,
    shutdownDisabled
  ] = disabledActions;

  const disabledQuipButtonsIds = ['restart_and_run_all'];

  if (startDisabled) disabledQuipButtonsIds.push('start');
  if (restartDisabled) disabledQuipButtonsIds.push('restart');
  if (interruptDisabled) disabledQuipButtonsIds.push('interrupt');
  if (shutdownDisabled) disabledQuipButtonsIds.push('stop');

  const quipButtonIds = [
    'start',
    'restart',
    'restart_and_run_all',
    'interrupt',
    'stop'
  ];

  useActionsMenu(
    quipButtonIds,
    quipButtonIds,
    [
      {
        id: 'start',
        label: 'Start',
        handler: start
      },
      {
        id: 'restart',
        label: 'Restart',
        handler: restart
      },
      {
        id: 'restart_and_run_all',
        label: 'Restart And Run All',
        handler: () => console.log('Coming soon!')
      },
      {
        id: 'interrupt',
        label: 'Interrupt',
        handler: interrupt
      },
      {
        id: 'stop',
        label: 'Stop',
        handler: shutdown
      }
    ],
    disabledQuipButtonsIds,
    [],
    [startDisabled, restartDisabled, interruptDisabled, shutdownDisabled]
  );
};

export default useCustomMenu;
