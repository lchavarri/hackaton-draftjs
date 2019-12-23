import * as filterDataService from '../../utils/filterFileDataService';
import { ILibraryFilter } from '../../components/layout/layoutTypes';
import api from '../../../shared/ui/services/apiservice';

import {
  ADD_FILTER_TO_PATH,
  CLEAR_ALL_FILTERS_ON_PATH,
  DELETE_ALL_FILTERS_ON_PATH,
  MOVE_FILTER_FROM_GROUP_TO_PATH,
  MOVE_FILTER_TO_GROUP,
  MOVE_FILTER_WITHIN_GROUP,
  REMOVE_FILTER_FROM_PATH,
  REORDER_FILTER_ON_PATH,
  UPDATE_FILTERS_ON_PATH,
  UPDATE_DRAGGED_FILTER_ID,
  APPLY_SAVED_PATTERN,
  APPLY_SAVED_PATTERN_TO_GROUP,
  REORDER_SELECTED_FILTERS_ON_PATH,
  MOVE_SELECTED_FILTERS_TO_GROUP
} from '../actionTypes';

export const addFilterToPath = (filter: ILibraryFilter, position: number) => ({
  type: ADD_FILTER_TO_PATH,
  payload: {
    filter,
    position
  }
});

export const updateFiltersOnPath = (filters: Array<ILibraryFilter>) => ({
  type: UPDATE_FILTERS_ON_PATH,
  payload: {
    filters
  }
});

export const removeFilterFromPath = (filter: any) => ({
  type: REMOVE_FILTER_FROM_PATH,
  payload: {
    filter
  }
});

export const reorderFilterOnPath = (from: number, to: number) => ({
  type: REORDER_FILTER_ON_PATH,
  payload: {
    from,
    to
  }
});

export const reorderSelectedFiltersOnPath = (to: number, oldIndex: number) => ({
  type: REORDER_SELECTED_FILTERS_ON_PATH,
  payload: {
    to,
    oldIndex
  }
});

export const moveFilterToGroup = (
  to: string,
  where: number,
  from: string,
  id: string,
  filter?: ILibraryFilter
) => ({
  type: MOVE_FILTER_TO_GROUP,
  payload: {
    to,
    where,
    from,
    id,
    filter
  }
});

export const moveSelectedFiltersToGroup = (where: number, id: string) => ({
  type: MOVE_SELECTED_FILTERS_TO_GROUP,
  payload: {
    where,
    id
  }
});

export const moveFilterWithinGroup = (
  to: string,
  where: number,
  from: string,
  id: string
) => ({
  type: MOVE_FILTER_WITHIN_GROUP,
  payload: {
    to,
    where,
    from,
    id
  }
});

export const moveFilterFromGroupToPath = (
  to: string,
  where: number,
  from: string,
  id: string
) => ({
  type: MOVE_FILTER_FROM_GROUP_TO_PATH,
  payload: {
    to,
    where,
    from,
    id
  }
});

export const applySavedPattern = (
  filtersToRestore: Array<ILibraryFilter>,
  position: number
) => ({
  type: APPLY_SAVED_PATTERN,
  payload: {
    filtersToRestore,
    position
  }
});

export const applySavedPatternToGroup = (
  filtersToRestore: Array<ILibraryFilter>,
  targetGroup: string,
  position: number
) => ({
  type: APPLY_SAVED_PATTERN_TO_GROUP,
  payload: {
    filtersToRestore,
    targetGroup,
    position
  }
});

export const removeAllFiltersFromPath = () => ({
  type: DELETE_ALL_FILTERS_ON_PATH,
  payload: {}
});

export const clearAllFiltersOnPath = () => ({
  type: CLEAR_ALL_FILTERS_ON_PATH,
  payload: {}
});

export const updateDraggedFilterId = (filterId: string) => ({
  type: UPDATE_DRAGGED_FILTER_ID,
  payload: {
    filterId
  }
});

export const getPattern = (liveAppInstanceId: string) => async (
  dispatch: Function
) => {
  return api
    .get('/getPattern', { params: { liveAppInstanceId } })
    .then(async (response: any) => {
      if (!response || !response.data || !response.data.filters) {
        return;
      }
      const integrity = await filterDataService.checkFileIntegrity(response.data
        .filters as ILibraryFilter[]);
      if (integrity.valid) {
        dispatch(updateFiltersOnPath(integrity.filters));
      }
    })
    .catch(error => Promise.reject(error));
};
