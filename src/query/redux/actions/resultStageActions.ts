import { ColumnData } from '../../components/resultStage/columnBuilder/columnBuilder';
import {
  POPULATE_CYPHER,
  POPULATE_TABLE_COLUMNS,
  SET_FIRST_LOAD,
  SET_SELECTED_COLUMNS,
  SET_SETTING_VISIBLE,
  CLEAR_RESULT_STAGE_SETTING,
  SET_LOADING_STATE,
  SET_TIMESTAMP_VALUES
} from '../actionTypes';
import api from '../../../shared/ui/services/apiservice';
import { joinColumns, filtersQuery } from '../../utils/filterDataService';
import { clearServerError, setServerError } from './layoutActions';

export const setSettingVisible = (value: boolean) => ({
  type: SET_SETTING_VISIBLE,
  payload: {
    value
  }
});

export const clearSettings = () => ({
  type: CLEAR_RESULT_STAGE_SETTING,
  payload: {}
});

export const setSelectedColumns = (selectedColumns: Array<ColumnData>) => ({
  type: SET_SELECTED_COLUMNS,
  payload: {
    selectedColumns
  }
});

export const populateCypher = (cypher: string) => ({
  type: POPULATE_CYPHER,
  payload: {
    cypher
  }
});

export const populateTableColumns = (
  count: number,
  columnBuilderColumns: Array<Array<string>>,
  tableColumns: Array<Array<string>>,
  tableTop10: Array<Array<string>>
) => ({
  type: POPULATE_TABLE_COLUMNS,
  payload: {
    count,
    columnBuilderColumns,
    tableColumns,
    tableTop10
  }
});

export const setFirstLoad = () => ({
  type: SET_FIRST_LOAD,
  payload: {}
});

export const setLoadingState = (newValue: boolean) => ({
  type: SET_LOADING_STATE,
  payload: {
    newValue
  }
});

export const setTimestampValues = (timestamp: {
  startDate: number;
  endDate: number;
}) => ({
  type: SET_TIMESTAMP_VALUES,
  payload: {
    timestamp
  }
});

export const setBuildCypherSuccess = (data: any) => async (
  dispatch: Function
) => {
  const { cypher } = data;

  dispatch(populateCypher(cypher));
};

export const setJupyterResultsSuccess = (data: any) => async (
  dispatch: Function
) => {
  const { count, columns, top, startDate, endDate } = data;

  dispatch(setTimestampValues({ startDate, endDate }));
  dispatch(
    populateTableColumns(count, columns, top && top.columns, top && top.values)
  );
};

export const getResults = (
  variableName: string,
  filtersDto: any,
  columns: string[][],
  groupsColumns: string[][],
  liveAppInstanceId: string
) => {
  return async (dispatch: Function) => {
    dispatch(setLoadingState(true));

    const startDate = new Date().toISOString();
    const results = await filtersQuery(
      variableName,
      filtersDto,
      joinColumns(columns),
      joinColumns(groupsColumns),
      dispatch
    );
    const endDate = new Date().toISOString();

    //ToDo: This validation must Change this when we have get_columns and get_count back
    if (results && results.count) {
      dispatch(
        setJupyterResultsSuccess({
          ...results,
          startDate,
          endDate
        })
      );
    }

    return api
      .post('/getResults', {
        filtersDto,
        liveAppInstanceId
      })
      .then(response => {
        if (!response || !response.data) {
          return;
        }
        dispatch(setBuildCypherSuccess(response.data));
        dispatch(setLoadingState(false));
        if (results && results.count) {
          dispatch(clearServerError());
        }

        return response.data;
      })
      .catch(response => {
        const error = response && response.data;
        dispatch(setLoadingState(false));
        dispatch(setServerError(error));
        return Promise.reject(error);
      });
  };
};
