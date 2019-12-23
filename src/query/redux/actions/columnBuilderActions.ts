import { ColumnData } from '../../components/resultStage/columnBuilder/columnBuilder';
import {
  CHANGE_COLUMN_BUILDER_DROP_STATE,
  UPDATE_COLUMN_BUILDER_SEARCH,
  BUILD_COLUMN_BUILDER_DEFAULT,
  TOGGLE_COLUMN_BUILDER_SECTION_COLLAPSED_STATE,
  CHANGE_GROUP_BY_DROP_STATE,
  UPDATE_GROUP_BY_SEARCH,
  BUILD_GROUP_BY_DEFAULT,
  RESET_COLUMN_BUILDER_SEARCH,
  RESET_GROUP_BY_SEARCH,
  MAKE_COLUMN_BUILDER_DEFAULT_SELECTION
} from '../actionTypes';

export const updateColumnBuilderSearch = (search: string) => ({
  type: UPDATE_COLUMN_BUILDER_SEARCH,
  payload: {
    search
  }
});

export const resetColumnBuilderSearch = () => ({
  type: RESET_COLUMN_BUILDER_SEARCH,
  payload: {}
});

export const changeColumnBuilderDropState = (opened: boolean) => ({
  type: CHANGE_COLUMN_BUILDER_DROP_STATE,
  payload: {
    opened
  }
});

// new column builder actions revisit previous to find possible removals or redundant
export const makeColumnsDefaultSelection = (
  selectedColumns: Array<ColumnData>
) => ({
  type: MAKE_COLUMN_BUILDER_DEFAULT_SELECTION,
  payload: { selectedColumns }
});

export const buildColumnBuilderDefault = () => ({
  type: BUILD_COLUMN_BUILDER_DEFAULT,
  payload: {}
});

export const buildGroupByDefault = (
  groupBySelectedColumns: Array<ColumnData>
) => ({
  type: BUILD_GROUP_BY_DEFAULT,
  payload: {
    groupBySelectedColumns
  }
});

export const toggleColumnBuilderSectionCollapsedState = (
  groupName: string
) => ({
  type: TOGGLE_COLUMN_BUILDER_SECTION_COLLAPSED_STATE,
  payload: {
    groupName
  }
});

export const changeGroupByDropState = (opened: boolean) => ({
  type: CHANGE_GROUP_BY_DROP_STATE,
  payload: {
    opened
  }
});

export const updateGroupBySearch = (search: string) => ({
  type: UPDATE_GROUP_BY_SEARCH,
  payload: {
    search
  }
});

export const resetGroupBySearch = () => ({
  type: RESET_GROUP_BY_SEARCH,
  payload: {}
});
