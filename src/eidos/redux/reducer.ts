import {
  KernelStatus,
  IKernelInfo
} from '../../shared/ui/services/jupyterService';
import * as actions from './actionTypes';

export interface IState {
  appFocused: boolean;
  requestPending: boolean;
  kernelInfo: IKernelInfo;
  errors: any;
}

export const initialState: IState = {
  appFocused: true,
  kernelInfo: {
    id: '',
    status: KernelStatus.UNKNOWN
  },
  requestPending: false,
  errors: {}
};

//All Kernel requests do the same here, so we treat them equally
const kernelRequests = [
  ['START_KERNEL', KernelStatus.STARTING, KernelStatus.STOPPED],
  ['INTERRUPT_KERNEL', '', ''],
  ['RESTART_KERNEL', KernelStatus.RESTARTING, KernelStatus.CONNECTED],
  ['KILL_KERNEL', KernelStatus.UNKNOWN, '']
];

const extractErrorMessage = (err: any) => {
  if (!err || !err.data) {
    return 'Something went wrong. Please try again.';
  }
  if (!err.data.message) {
    return err.data;
  }
  return err.data.message;
};

const isKernelUnresponsive = (err: any) => {
  if (!err || !err.data || !err.data.code) {
    return false;
  }
  return err.data.code === 504;
};

const kernelReducers = {};
kernelRequests.forEach(([action, pendingStatus, failStatus]) => {
  //FETCH
  kernelReducers[`${action}_FETCH`] = (state: IState): IState => {
    const kernelInfo = { ...state.kernelInfo };
    if (pendingStatus) {
      kernelInfo.status = pendingStatus as KernelStatus;
    }
    const { [action]: a, ...errors } = state.errors;

    return {
      ...state,
      requestPending: true,
      errors,
      kernelInfo
    };
  };

  //SUCCESS
  kernelReducers[`${action}_SUCCESS`] = (
    state: IState,
    kernelInfo: IKernelInfo
  ): IState => {
    return {
      ...state,
      requestPending: false,
      errors: {},
      kernelInfo
    };
  };

  //ERROR
  kernelReducers[`${action}_ERROR`] = (state: IState, err: any): IState => {
    const kernelInfo = { ...state.kernelInfo };

    if (isKernelUnresponsive(err)) {
      kernelInfo.status = KernelStatus.STOPPED;
    } else if (failStatus) {
      kernelInfo.status = failStatus as KernelStatus;
    }

    return {
      ...state,
      requestPending: false,
      errors: { ...state.errors, [action]: extractErrorMessage(err) },
      kernelInfo
    };
  };
});

export default function(
  state = initialState,
  action: { type: string; payload: any }
): IState {
  //Find the reducer and execute it
  const reducerFn = kernelReducers[action.type];
  if (reducerFn) {
    return reducerFn(state, action.payload);
  }

  switch (action.type) {
    // CORN-1088 - Added requestPending: false
    case actions.UPDATE_KERNEL_STATUS: {
      return {
        ...state,
        requestPending: false,
        kernelInfo: { ...state.kernelInfo, status: action.payload }
      };
    }

    case actions.CLEAR_STATE: {
      return { ...initialState };
    }

    default:
      return state;
  }
}
