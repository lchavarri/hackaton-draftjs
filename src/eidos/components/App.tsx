import React, { useReducer, useEffect } from 'react';
import { Grid } from 'semantic-ui-react';

import reducer, { initialState } from '../redux/reducer';
import { updateKernelStatus } from '../redux/actions';
import { getKernelStatus } from '../redux/selectors';
import useKernel from '../hooks/useKernel';
import Actions from './Actions';
import Status from './Status';
import Notifications from './Notifications';

import './App.scss';
import useCustomMenu from '../hooks/useCustomMenu';

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const [kernelStatus] = useKernel(state, dispatch);

  useCustomMenu(state, dispatch);

  // Integrate kernel status listener with custom statuses coming from redux
  const currentKernelStatus = getKernelStatus(state);
  useEffect(() => {
    if (kernelStatus !== currentKernelStatus) {
      updateKernelStatus(dispatch, kernelStatus);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kernelStatus]);

  return (
    <div className="session-manager">
      <Grid>
        <Grid.Row className="session-app-wrapper">
          <Grid.Column width={8} className="flex">
            <Status state={state} />
          </Grid.Column>
          <Grid.Column width={8} className="session-manager-actions flex">
            <Actions state={state} dispatch={dispatch} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16}>
            <Notifications state={state} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
}
