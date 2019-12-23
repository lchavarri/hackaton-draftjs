import { Parameter } from '../../components/layout/layoutTypes';
import {
  CHANGE_PARAM_CONNECTOR,
  CHANGE_PARAM_OPERATOR,
  CHANGE_PARAM_VALUE,
  REMOVE_FILTER_PARAMETER
} from '../actionTypes';

export const changeParamOperator = (param: Parameter, operator: string) => ({
  type: CHANGE_PARAM_OPERATOR,
  payload: {
    param,
    operator
  }
});

export const changeParamValue = (param: Parameter, value: string | number) => ({
  type: CHANGE_PARAM_VALUE,
  payload: {
    param,
    value
  }
});

export const changeParamConnector = (param: Parameter, value: string) => ({
  type: CHANGE_PARAM_CONNECTOR,
  payload: {
    param,
    value
  }
});

export const removeFilterParam = (param: Parameter) => ({
  type: REMOVE_FILTER_PARAMETER,
  payload: {
    param
  }
});
