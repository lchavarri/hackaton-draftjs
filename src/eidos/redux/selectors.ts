import { KernelStatus } from '../../shared/ui/services/jupyterService';
import { IState } from './reducer';

export const getKernelStatus = (state: IState): KernelStatus => {
  return state.kernelInfo && state.kernelInfo.status;
};

export const isRequestPending = (state: IState) => state.requestPending;

export const getErrors = (state: IState) => state.errors;

export const getErrorsArray = (state: IState) => {
  const { errors } = state;
  const errorsArray = [];
  for (var errorKey in errors) {
    if (errors.hasOwnProperty(errorKey)) {
      errorsArray.push([errorKey, errors[errorKey]]);
    }
  }
  return errorsArray;
};
