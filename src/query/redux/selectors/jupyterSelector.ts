import { IServerError } from '../../../shared/core';

export const getVariableName = (state: any): string => {
  return state.jupyter.variableName;
};

export const isValidVariableName = (state: any): boolean => {
  return state.jupyter.validVariableName;
};

export const getVariablePending = (state: any) => {
  return state.jupyter.setVariableNamePending;
};

export const getKernelStatusError = (state: any): IServerError | null =>
  state.jupyter.kernelStatusError;

export const getExportSpreadsheetPending = (state: any) =>
  state.jupyter.exportSpreadsheetPending;

export const getDownloadCsvPending = (state: any) =>
  state.jupyter.downloadCsvPending;
