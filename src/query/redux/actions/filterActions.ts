import { Parameter } from '../../components/layout/layoutTypes';
import {
  ADD_FILTER_PARAMETER,
  FILTER_SELECTION,
  BULK_TOGGLE_FILTER_SELECTION,
  CHANGE_FILTER_CONNECTOR,
  FILTER_FILTER_PARAM_DROPDOWN,
  GROUP_SELECTED_FILTERS,
  TOGGLE_EDIT_GROUP_TITLE_MODE,
  TOGGLE_FILTER_OPENED,
  TOGGLE_FILTER_PARAM_DROPDOWN,
  TOGGLE_FILTER_SELECTION,
  UNGROUP_SELECTED_FILTERS,
  UPDATE_GROUP_TITLE,
  UPDATE_TEMP_GROUP_TITLE,
  OPEN_FILTER,
  CLOSE_FILTER,
  CLEAR_EMPTY_DELETED_GROUPS,
  FILTER_DRAG_STARTED,
  TOGGLE_FILTER_SELECTION_PREVENTED,
  FILTER_DRAG_ENDED
} from '../actionTypes';

export const addFilterParameter = (filterId: any, parameter: Parameter) => ({
  type: ADD_FILTER_PARAMETER,
  payload: {
    filterId,
    parameter
  }
});

export const filterSelection = (filterId: string) => ({
  type: FILTER_SELECTION,
  payload: {
    filterId
  }
});

export const toggleFilterSelection = (filterId: string) => ({
  type: TOGGLE_FILTER_SELECTION,
  payload: {
    filterId
  }
});

export const toggleFilterSelectionPrevented = () => ({
  type: TOGGLE_FILTER_SELECTION_PREVENTED,
  payload: {}
});

export const bulkToggleFilterSelection = (filterId: string) => ({
  type: BULK_TOGGLE_FILTER_SELECTION,
  payload: {
    filterId
  }
});

export const groupSelectedFilters = () => ({
  type: GROUP_SELECTED_FILTERS,
  payload: {}
});

export const ungroupSelectedFilters = () => ({
  type: UNGROUP_SELECTED_FILTERS,
  payload: {}
});

export const toggleFilterParamDropDown = (
  filterId: string,
  value: boolean
) => ({
  type: TOGGLE_FILTER_PARAM_DROPDOWN,
  payload: {
    filterId,
    value
  }
});

export const filterFilterParamDropDown = (
  filterId: string,
  searchValue: string
) => ({
  type: FILTER_FILTER_PARAM_DROPDOWN,
  payload: {
    filterId,
    searchValue
  }
});

export const changeFilterConnector = (
  filterId: string,
  newConnector: string
) => ({
  type: CHANGE_FILTER_CONNECTOR,
  payload: {
    filterId,
    newConnector
  }
});

export const toggleFilterOpened = (filterId: string) => ({
  type: TOGGLE_FILTER_OPENED,
  payload: {
    filterId
  }
});

export const openFilter = (filterId: string) => ({
  type: OPEN_FILTER,
  payload: {
    filterId
  }
});

export const closeFilter = (filterId: string) => ({
  type: CLOSE_FILTER,
  payload: {
    filterId
  }
});

export const clearEmptyDeletedGroups = () => ({
  type: CLEAR_EMPTY_DELETED_GROUPS,
  payload: {}
});

export const toggleEditGroupTitleMode = (filterId: any) => ({
  type: TOGGLE_EDIT_GROUP_TITLE_MODE,
  payload: {
    filterId
  }
});

export const updateTempGroupName = (filterId: any, tempTitle: string) => ({
  type: UPDATE_TEMP_GROUP_TITLE,
  payload: {
    filterId,
    tempTitle
  }
});

export const updateGroupName = (filterId: any, name: string) => ({
  type: UPDATE_GROUP_TITLE,
  payload: {
    filterId,
    name
  }
});

export const filterDragStarted = () => ({
  type: FILTER_DRAG_STARTED,
  payload: {}
});

export const filterDragEnded = () => ({
  type: FILTER_DRAG_ENDED,
  payload: {}
});
