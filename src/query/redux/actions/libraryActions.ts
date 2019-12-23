import { ILibraryFilter } from '../../components/layout/layoutTypes';
import {
  POPULATE_FILTER_LIBRARY,
  TOGGLE_FILTER_LIBRARY_DESCRIPTION,
  TOGGLE_FILTER_LIBRARY_HINT,
  SEARCH_LIBRARY,
  POPULATE_FILTER_LIBRARY_RAW,
  ADD_FILTER_BY_CRITERIA,
  UPDATE_FILTER_BY_CRITERIA,
  REMOVE_ALL_FILTER_BY_CRITERIA
} from '../actionTypes';
import { ColumnData } from '../../components/resultStage/columnBuilder/columnBuilder';

export const populateFilterLibrary = (filters: Array<ILibraryFilter>) => ({
  type: POPULATE_FILTER_LIBRARY,
  payload: {
    filters
  }
});

export const populateFilterLibraryRaw = (filters: Array<ILibraryFilter>) => ({
  type: POPULATE_FILTER_LIBRARY_RAW,
  payload: {
    filters
  }
});

export const toggleFilterLibraryHint = (
  filterId: string,
  newValue: boolean
) => ({
  type: TOGGLE_FILTER_LIBRARY_HINT,
  payload: {
    filterId,
    newValue
  }
});

export const toggleFilterLibraryDescription = (
  filterId: string,
  value?: boolean
) => ({
  type: TOGGLE_FILTER_LIBRARY_DESCRIPTION,
  payload: {
    filterId,
    value
  }
});

export const searchLibrary = (searchCriteria: string) => ({
  type: SEARCH_LIBRARY,
  payload: {
    searchCriteria
  }
});

export const addFilterByCriteria = (criteriaAdded: string) => ({
  type: ADD_FILTER_BY_CRITERIA,
  payload: {
    criteriaAdded
  }
});

export const updateFilterByCriteria = (updatedList: Array<ColumnData>) => ({
  type: UPDATE_FILTER_BY_CRITERIA,
  payload: {
    updatedList
  }
});

export const removeAllFilterByOptions = () => ({
  type: REMOVE_ALL_FILTER_BY_CRITERIA,
  payload: {}
});
