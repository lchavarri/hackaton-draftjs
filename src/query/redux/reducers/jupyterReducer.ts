import { IServerError } from '../../../shared/core/interfaces';
import {
  SET_VARIABLE_NAME_PENDING,
  SET_VARIABLE_NAME_SUCCESS,
  SET_VARIABLE_NAME_FAILURE,
  FETCH_VARIABLE_NAME_SUCCESS,
  FETCH_VARIABLE_NAME_FAILURE,
  FETCH_VARIABLE_NAME_PENDING,
  FETCH_KERNEL_STATUS_SUCCESS,
  FETCH_KERNEL_STATUS_FAILURE,
  FETCH_KERNEL_STATUS_PENDING,
  EXPORT_SPREADSHEET_PENDING,
  EXPORT_SPREADSHEET_SUCCESS,
  EXPORT_SPREADSHEET_FAILURE,
  DOWNLOAD_CSV_PENDING,
  DOWNLOAD_CSV_SUCCESS,
  DOWNLOAD_CSV_FAILURE,
  VALIDATE_VARIABLE_NAME
} from '../actionTypes';

export type jupyterState = {
  variableName: string;
  validVariableName: boolean;
  setVariableNamePending: boolean;
  setVariableNameError: string;
  kernelStatus: any;
  kernelStatusPending: boolean;
  kernelStatusError: IServerError | null;
  exportSpreadsheetResult: any;
  exportSpreadsheetPending: boolean;
  exportSpreadsheetError: string;
  downloadCsvFile: string;
  downloadCsvPending: boolean;
  downloadCsvError: string;
};

const INITIAL_STATE: jupyterState = {
  variableName: '',
  validVariableName: false,
  setVariableNamePending: false,
  setVariableNameError: '',
  kernelStatus: {},
  kernelStatusPending: false,
  kernelStatusError: null,
  exportSpreadsheetResult: {},
  exportSpreadsheetPending: false,
  exportSpreadsheetError: '',
  downloadCsvFile: '',
  downloadCsvPending: false,
  downloadCsvError: ''
};

export default (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case FETCH_VARIABLE_NAME_PENDING:
    case SET_VARIABLE_NAME_PENDING:
      return {
        ...state,
        setVariableNamePending: true,
        setVariableNameError: ''
      };
    case FETCH_VARIABLE_NAME_SUCCESS:
    case SET_VARIABLE_NAME_SUCCESS:
      const variableName = action.payload;
      return {
        ...state,
        setVariableNamePending: false,
        variableName,
        validVariableName: true
      };
    case FETCH_VARIABLE_NAME_FAILURE:
    case SET_VARIABLE_NAME_FAILURE:
      return {
        ...state,
        setVariableNamePending: false,
        setVariableNameError: action.payload.message,
        validVariableName: false
      };
    case FETCH_KERNEL_STATUS_PENDING:
      return {
        ...state,
        kernelStatusPending: true,
        kernelStatusError: null
      };
    case FETCH_KERNEL_STATUS_SUCCESS:
      return {
        ...state,
        kernelStatusPending: false,
        kernelStatus: action.payload
      };
    case FETCH_KERNEL_STATUS_FAILURE:
      const { code, message } = action.payload;
      return {
        ...state,
        kernelStatusPending: false,
        kernelStatusError: { code, message, timestamp: new Date().getTime() }
      };
    case EXPORT_SPREADSHEET_PENDING:
      return {
        ...state,
        exportSpreadsheetPending: true,
        exportSpreadsheetError: null
      };
    case EXPORT_SPREADSHEET_SUCCESS:
      return {
        ...state,
        exportSpreadsheetPending: false,
        exportSpreadsheetResult: action.payload
      };
    case EXPORT_SPREADSHEET_FAILURE:
      return {
        ...state,
        exportSpreadsheetPending: false,
        exportSpreadsheetError: action.payload.message
      };
    case DOWNLOAD_CSV_PENDING:
      return {
        ...state,
        downloadCsvPending: true,
        downloadCsvError: null
      };
    case DOWNLOAD_CSV_SUCCESS:
      return {
        ...state,
        downloadCsvPending: false,
        downloadCsvFile: action.payload
      };
    case DOWNLOAD_CSV_FAILURE:
      return {
        ...state,
        downloadCsvPending: false,
        downloadCsvError: action.payload.message
      };
    case VALIDATE_VARIABLE_NAME:
      return {
        ...state,
        validVariableName: action.payload
      };
    default:
      return { ...state };
  }
};
