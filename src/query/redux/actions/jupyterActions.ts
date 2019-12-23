import { format } from 'date-fns';

import api from '../../../shared/ui/services/apiservice';
import {
  FETCH_VARIABLE_NAME_PENDING,
  FETCH_VARIABLE_NAME_SUCCESS,
  FETCH_VARIABLE_NAME_FAILURE,
  VALIDATE_VARIABLE_NAME,
  SET_VARIABLE_NAME_PENDING,
  SET_VARIABLE_NAME_SUCCESS,
  SET_VARIABLE_NAME_FAILURE,
  FETCH_KERNEL_STATUS_PENDING,
  FETCH_KERNEL_STATUS_SUCCESS,
  FETCH_KERNEL_STATUS_FAILURE,
  EXPORT_SPREADSHEET_PENDING,
  EXPORT_SPREADSHEET_SUCCESS,
  EXPORT_SPREADSHEET_FAILURE,
  DOWNLOAD_CSV_PENDING,
  DOWNLOAD_CSV_SUCCESS,
  DOWNLOAD_CSV_FAILURE
} from '../actionTypes';
import { setServerError, clearServerError } from './layoutActions';
import { API, graphqlOperation } from 'aws-amplify';
import { updateEidosQueryUi } from '../../graphql/mutations';
import { IKernel } from '../../../shared/ui/services/jupyterService';
import { ErrorObject } from '../../hooks/useKernel';
import {
  exportCsv,
  quipExport,
  checkVariableName,
  renameDataFrame
} from '../../utils/filterDataService';

export const setPythonVariableName = (variableName: string) => ({
  type: FETCH_VARIABLE_NAME_SUCCESS,
  payload: variableName
});

export const fetchVariableName = (liveAppInstanceId: string) => async (
  dispatch: Function
) => {
  dispatch({ type: FETCH_VARIABLE_NAME_PENDING });
  return api
    .get('/getPythonVariableName', {
      params: { liveAppInstanceId, defaultName: 'dataset' }
    })
    .then((result: any) => {
      if (!result || !result.data) {
        return;
      }
      dispatch({ type: FETCH_VARIABLE_NAME_SUCCESS, payload: result.data });
    })
    .catch((result: any) => {
      dispatch({ type: FETCH_VARIABLE_NAME_FAILURE, payload: result.data });
      return Promise.reject(result.data);
    });
};

export const setVariableName = (
  liveAppInstanceId: string,
  documentId: string,
  variableName: string,
  newName: string
) => async (dispatch: Function) => {
  dispatch({ type: SET_VARIABLE_NAME_PENDING });
  return checkVariableName(newName)
    .then(async (result: any) => {
      if (!result || !result.valid) {
        return;
      }
      await API.graphql(
        graphqlOperation(updateEidosQueryUi, {
          input: {
            document_id: documentId,
            app_instance_id: liveAppInstanceId,
            pythonVariableName: newName
          }
        })
      );
      return renameDataFrame(variableName, newName).then(() => {
        dispatch({ type: SET_VARIABLE_NAME_SUCCESS, payload: newName });
        dispatch(clearServerError());
      });
    })
    .catch((result: any) => {
      const error = result && result.reason;
      dispatch({
        type: SET_VARIABLE_NAME_FAILURE,
        payload: { message: error }
      });
      // Avoid showing validation errors on global notifications
      if ([500, 504].includes(error.code)) {
        dispatch(setServerError(error));
      }
      return Promise.reject({ message: error });
    });
};

export const validateVariableName = (valid: boolean) => async (
  dispatch: Function
) => {
  dispatch({ type: VALIDATE_VARIABLE_NAME, payload: valid });
};

export const setKernelStatus = (
  kernelData: IKernel | undefined,
  kernelLoading: boolean,
  kernelError: ErrorObject | undefined
) => async (dispatch: Function) => {
  if (kernelLoading) {
    dispatch({ type: FETCH_KERNEL_STATUS_PENDING });
  }
  if (!kernelLoading && kernelData) {
    dispatch({ type: FETCH_KERNEL_STATUS_SUCCESS, payload: kernelData });
    dispatch(clearServerError());
  }
  if (kernelError) {
    const error = kernelError && kernelError.message;
    dispatch({
      type: FETCH_KERNEL_STATUS_FAILURE,
      payload: { code: 0, message: error }
    });
    dispatch(setServerError({ code: 0, message: error }));
  }
};

export const exportSpreadsheet = (
  variableName: string,
  documentID: string
) => async (dispatch: Function) => {
  dispatch({ type: EXPORT_SPREADSHEET_PENDING });

  return quipExport(variableName, documentID)
    .then((result: any) => {
      dispatch({
        type: EXPORT_SPREADSHEET_SUCCESS,
        payload: result.data
      });
      dispatch(clearServerError());
    })
    .catch((result: any) => {
      const error = result && result.data;
      dispatch({
        type: EXPORT_SPREADSHEET_FAILURE,
        payload: result.data
      });
      dispatch(setServerError(error));
      return Promise.reject(error);
    });
};

export const downloadCsv = (variableName: string) => async (
  dispatch: Function
) => {
  dispatch({ type: DOWNLOAD_CSV_PENDING });

  return exportCsv(variableName)
    .then((result: any) => {
      const url = window.URL.createObjectURL(new Blob([result]));
      const link = document.createElement('a');
      link.href = url;
      const ts = format(new Date(), 'YYYYMMDDHHmmss');
      const fileName = `export_${ts}.txt`;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      dispatch({ type: DOWNLOAD_CSV_SUCCESS, payload: fileName });
      dispatch(clearServerError());
    })
    .catch((result: any) => {
      const error = result && result.data;
      dispatch({ type: DOWNLOAD_CSV_FAILURE, payload: result.data });
      dispatch(setServerError(error));
      return Promise.reject(error);
    });
};
