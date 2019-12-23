import uuid from 'uuid/v4';

import {
  IFilterCriteria,
  ILibraryFilter,
  Parameter,
  IFilterGroup
} from '../../components/layout/layoutTypes';
import { sanitizeParameterValue } from '../../utils/stringUtils';
import {
  ADD_FILTER_PARAMETER,
  ADD_FILTER_TO_PATH,
  FILTER_SELECTION,
  BULK_TOGGLE_FILTER_SELECTION,
  CHANGE_FILTER_CONNECTOR,
  CHANGE_PARAM_CONNECTOR,
  CHANGE_PARAM_OPERATOR,
  CHANGE_PARAM_VALUE,
  CLEAR_ALL_FILTERS_ON_PATH,
  DELETE_ALL_FILTERS_ON_PATH,
  FILTER_FILTER_PARAM_DROPDOWN,
  GROUP_SELECTED_FILTERS,
  MOVE_FILTER_FROM_GROUP_TO_PATH,
  MOVE_FILTER_TO_GROUP,
  MOVE_FILTER_WITHIN_GROUP,
  REMOVE_FILTER_FROM_PATH,
  REMOVE_FILTER_PARAMETER,
  REORDER_FILTER_ON_PATH,
  TOGGLE_EDIT_GROUP_TITLE_MODE,
  TOGGLE_FILTER_OPENED,
  TOGGLE_FILTER_PARAM_DROPDOWN,
  TOGGLE_FILTER_SELECTION,
  UNGROUP_SELECTED_FILTERS,
  UPDATE_FILTERS_ON_PATH,
  UPDATE_GROUP_TITLE,
  UPDATE_TEMP_GROUP_TITLE,
  OPEN_FILTER,
  CLOSE_FILTER,
  UPDATE_DRAGGED_FILTER_ID,
  APPLY_SAVED_PATTERN,
  APPLY_SAVED_PATTERN_TO_GROUP,
  CLEAR_EMPTY_DELETED_GROUPS,
  TOGGLE_EMPTY_GROUP_DELETED_OPEN_MODAL,
  REORDER_SELECTED_FILTERS_ON_PATH,
  MOVE_SELECTED_FILTERS_TO_GROUP,
  FILTER_DRAG_STARTED,
  TOGGLE_FILTER_SELECTION_PREVENTED,
  POPULATE_RESULTS_COUNT,
  SET_SETTING_VISIBLE,
  CLEAR_RESULT_STAGE_SETTING,
  SET_SELECTED_COLUMNS,
  POPULATE_CYPHER,
  POPULATE_TABLE_COLUMNS,
  SET_FIRST_LOAD,
  SET_LOADING_STATE,
  SET_TIMESTAMP_VALUES,
  CHANGE_COLUMN_BUILDER_DROP_STATE,
  CHANGE_GROUP_BY_DROP_STATE,
  UPDATE_GROUP_BY_SEARCH,
  RESET_GROUP_BY_SEARCH,
  BUILD_GROUP_BY_DEFAULT,
  UPDATE_COLUMN_BUILDER_SEARCH,
  RESET_COLUMN_BUILDER_SEARCH,
  BUILD_COLUMN_BUILDER_DEFAULT,
  TOGGLE_COLUMN_BUILDER_SECTION_COLLAPSED_STATE,
  POPULATE_FILTER_LIBRARY,
  POPULATE_FILTER_LIBRARY_RAW,
  ADD_FILTER_BY_CRITERIA,
  UPDATE_FILTER_BY_CRITERIA,
  REMOVE_ALL_FILTER_BY_CRITERIA,
  TOGGLE_FILTER_LIBRARY_HINT,
  TOGGLE_FILTER_LIBRARY_DESCRIPTION,
  SEARCH_LIBRARY,
  MAKE_COLUMN_BUILDER_DEFAULT_SELECTION,
  FILTER_DRAG_ENDED
} from '../actionTypes';
import { getFilterSchema } from '../../utils/filterFileDataService';
import { cloneObject } from '../../utils/objectUtils';
import {
  updateFilter,
  updateAllFilters,
  groupSelectedFilters,
  ungroupSelectedFilters,
  removeFilterFromPath,
  getFilterById,
  addFilterToGroup,
  addFilterTreeTo,
  removeEmptyGroups,
  updateRestoreFilters,
  getSelectedFilters,
  getUnSelectedFilters,
  isSelectionAllowed,
  bulkToggleFilterSelection
} from '../../utils/filterPathDataUtils';
import {
  getFiltersAmount,
  getLibraryDataModel
} from '../selectors/filter/filterSelector';
import { ColumnData } from '../../components/resultStage/columnBuilder/columnBuilder';
import {
  getColumnDataFromApiColumnModel,
  getGroupByDataOptions,
  getGroupBySelected,
  getColumnBuilderDataOptions,
  buildColumnName
} from '../../utils/columnFilterUtils';

export type filtersState = {
  // filter path props
  filters: Array<ILibraryFilter>;
  lastSelectedFilterId: string;
  filterIdBeingDragged: string;
  isCardBeingDragged: boolean;
  removedFilters: Array<string>;
  emptyGroupDeletedModalOpened: boolean;
  dropAllowed: boolean;
  isDraggedFilterSelected: boolean;
  selectionPrevented: boolean;
  filterIdSelectionAttempted: string;
  // result stage props
  displayResults: string;
  settingsVisible: boolean;
  tableColumns: Array<Array<string>>;
  tableTop10: Array<Array<string>>;
  count: number;
  isFirstLoad: boolean;
  isLoading?: boolean;
  groupBySelectedColumns: Array<ColumnData>;
  executionStartedAt: Date | null;
  executionEndedAt: Date | null;
  // column builder props
  columnBuilderColumns: Array<ColumnData>;
  selectedColumns: Array<ColumnData>;
  inFilterPath: Array<ColumnData>;
  available: Array<ColumnData>;
  other: Array<ColumnData>;
  columnBuilderOpened: boolean;
  columnBuilderSearch: string;
  usedInFilterPatternCollapsed: boolean;
  availableCollapsed: boolean;
  otherCollapsed: boolean;
  groupByOpened: boolean;
  groupBySearch: string;
  groupByFilteredOptions: Array<ColumnData>;

  // filter library props
  library: Array<IFilterGroup>;
  libraryFilteredClasses: Array<ColumnData>;
  rawLibrary: Array<IFilterGroup>;
};

const initialState: filtersState = {
  // filter path props
  filters: [],
  lastSelectedFilterId: '',
  filterIdBeingDragged: '',
  isCardBeingDragged: false,
  removedFilters: [''],
  emptyGroupDeletedModalOpened: false,
  dropAllowed: true,
  isDraggedFilterSelected: false,
  selectionPrevented: false,
  filterIdSelectionAttempted: '',
  // result stage props
  displayResults: '',
  settingsVisible: false,
  tableColumns: [],
  tableTop10: [],
  count: 0,
  isFirstLoad: true,
  groupBySelectedColumns: [],
  executionStartedAt: null,
  executionEndedAt: null,
  // column builder props
  columnBuilderColumns: [],
  selectedColumns: [],
  inFilterPath: [],
  available: [],
  other: [],
  columnBuilderOpened: false,
  columnBuilderSearch: '',
  groupByOpened: false,
  groupBySearch: '',
  groupByFilteredOptions: [],
  usedInFilterPatternCollapsed: true,
  availableCollapsed: true,
  otherCollapsed: true,
  // filter library props
  library: [],
  rawLibrary: [],
  libraryFilteredClasses: []
};

export default function(state = initialState, action: any) {
  switch (action.type) {
    case ADD_FILTER_TO_PATH: {
      const { filter, position } = action.payload;
      const newFilters = Array.from(state.filters);
      newFilters.splice(position, 0, filter);

      return {
        ...state,
        filters: newFilters
      };
    }

    case UPDATE_FILTERS_ON_PATH: {
      const { filters } = action.payload;

      return {
        ...state,
        filters: updateAllFilters(filters, (e: ILibraryFilter) => {
          const { schema, isMultiple } = getFilterSchema(e.fields);
          e.hasMultipleParameters = isMultiple;
          e.parsedSchema = { ...schema };
          e.filteredParams = { ...schema };
        })
      };
    }
    case REMOVE_FILTER_FROM_PATH: {
      const { filter } = action.payload;

      const newFilters = removeFilterFromPath(state.filters, filter);
      const { filters, removed } = removeEmptyGroups(newFilters);

      return {
        ...state,
        filters: filters,
        removedFilters: removed,
        emptyGroupDeletedModalOpened: !!removed.length
      };
    }

    case CLEAR_EMPTY_DELETED_GROUPS: {
      return {
        ...state,
        removedFilters: []
      };
    }

    case TOGGLE_EMPTY_GROUP_DELETED_OPEN_MODAL: {
      return {
        ...state,
        emptyGroupDeletedModalOpened: !state.emptyGroupDeletedModalOpened
      };
    }

    case MOVE_FILTER_TO_GROUP: {
      const { from, to, where, id, filter } = action.payload;
      let result: ILibraryFilter[];

      if (from === 'library') {
        result = addFilterToGroup(state.filters, to, where, filter);
      } else {
        const fil = getFilterById(state.filters, id);
        result = addFilterToGroup(state.filters, to, where, fil);
      }

      const { filters, removed } = removeEmptyGroups(result);

      return {
        ...state,
        filters: filters,
        removedFilters: removed,
        emptyGroupDeletedModalOpened: !!removed.length
      };
    }

    case MOVE_SELECTED_FILTERS_TO_GROUP: {
      const { where, id } = action.payload;
      let result: ILibraryFilter[];

      const removedFilters = getSelectedFilters(state.filters);
      result = getUnSelectedFilters(state.filters);

      result = addFilterTreeTo(result, id, where, removedFilters);

      const { filters, removed } = removeEmptyGroups(result);

      return {
        ...state,
        filters: filters,
        removedFilters: removed,
        emptyGroupDeletedModalOpened: !!removed.length
      };
    }

    case MOVE_FILTER_FROM_GROUP_TO_PATH: {
      const { where, id } = action.payload;
      let otherFilters: ILibraryFilter[];

      const removedFilter = getFilterById(state.filters, id);
      otherFilters = removeFilterFromPath(state.filters, id);

      if (removedFilter) {
        otherFilters.splice(where, 0, removedFilter);
      }

      const { filters, removed } = removeEmptyGroups(otherFilters);
      return {
        ...state,
        filters: filters,
        removedFilters: removed,
        emptyGroupDeletedModalOpened: !!removed.length
      };
    }

    case MOVE_FILTER_WITHIN_GROUP: {
      const { to, where, id } = action.payload;
      let result = [...state.filters];
      const fil = getFilterById(state.filters, id);

      return {
        ...state,
        filters: addFilterToGroup(result, to, where, fil)
      };
    }

    case REORDER_FILTER_ON_PATH: {
      const { from, to } = action.payload;
      const result = [...state.filters];
      const [removed] = result.splice(from, 1);
      result.splice(to, 0, removed);
      result[result.length - 1].nodeConnector = 'and';

      return {
        ...state,
        filters: result
      };
    }

    case REORDER_SELECTED_FILTERS_ON_PATH: {
      const { to, oldIndex } = action.payload;
      let otherFilters: ILibraryFilter[];

      const removedFilters = getSelectedFilters(state.filters);
      const directionCorrection = oldIndex < to ? 1 - removedFilters.length : 0;
      otherFilters = getUnSelectedFilters(state.filters);

      if (removedFilters) {
        otherFilters.splice(to + directionCorrection, 0, ...removedFilters);
      }

      const { filters, removed } = removeEmptyGroups(otherFilters);
      return {
        ...state,
        filters: filters,
        removedFilters: removed,
        emptyGroupDeletedModalOpened: !!removed.length
      };
    }

    case DELETE_ALL_FILTERS_ON_PATH: {
      return {
        ...state,
        lastSelectedFilterId: '',
        filters: []
      };
    }

    case UPDATE_DRAGGED_FILTER_ID: {
      const { filterId } = action.payload;

      // Avoid overrides - Only one item can be dragged at a given time
      if (state.filterIdBeingDragged && filterId) {
        return state;
      }

      let isSelected: boolean = false;
      if (filterId) {
        const filter = getFilterById(state.filters, filterId);
        isSelected = filter && filter.selected;
      }

      return {
        ...state,
        filterIdBeingDragged: filterId,
        isDraggedFilterSelected: isSelected
      };
    }

    case CLEAR_ALL_FILTERS_ON_PATH: {
      return {
        ...state,
        filters: updateAllFilters(state.filters, (e: ILibraryFilter) => {
          e.filterCriteria = e.filterCriteria.map((c: IFilterCriteria) => {
            c.value = '';
            return c;
          });
        })
      };
    }

    case ADD_FILTER_PARAMETER: {
      const { parameter, filterId } = action.payload;
      const param = { ...parameter, id: uuid() };

      return {
        ...state,
        filters: updateFilter(
          state.filters,
          (filter: ILibraryFilter) => {
            filter.filterCriteria = [...filter.filterCriteria, param];
          },
          filterId
        )
      };
    }

    case FILTER_SELECTION: {
      const { filterId } = action.payload;

      return {
        ...state,
        selectionPrevented: false,
        lastSelectedFilterId: filterId === null ? '' : filterId,
        filters: updateAllFilters(state.filters, (filter: ILibraryFilter) => {
          filter.selected = filter.id === filterId;
          if (filter.id === filterId) {
            state.lastSelectedFilterId = filter.selected ? filterId : '';
          }
        })
      };
    }

    case TOGGLE_FILTER_SELECTION: {
      const { filterId } = action.payload;
      let newFilters = [...state.filters];

      const canSelect = isSelectionAllowed(filterId, newFilters);

      if (canSelect) {
        newFilters = updateFilter(
          [...state.filters],
          (filter: ILibraryFilter) => {
            filter.selected = !filter.selected;
            state.lastSelectedFilterId = filter.selected ? filterId : '';
          },
          filterId
        );
      }
      return {
        ...state,
        filters: [...newFilters],
        selectionPrevented: !canSelect,
        filterIdSelectionAttempted: !canSelect ? filterId : ''
      };
    }

    case TOGGLE_FILTER_SELECTION_PREVENTED: {
      return {
        ...state,
        selectionPrevented: false,
        filterIdSelectionAttempted: ''
      };
    }

    case BULK_TOGGLE_FILTER_SELECTION: {
      const { filterId } = action.payload;

      return {
        ...state,
        ...bulkToggleFilterSelection(
          filterId,
          state.filters,
          state.lastSelectedFilterId
        )
      };
    }

    case GROUP_SELECTED_FILTERS: {
      return {
        ...state,
        filters: groupSelectedFilters(state.filters)
      };
    }

    case UNGROUP_SELECTED_FILTERS: {
      return {
        ...state,
        filters: ungroupSelectedFilters(state.filters)
      };
    }
    case TOGGLE_FILTER_PARAM_DROPDOWN: {
      const { filterId, value } = action.payload;

      return {
        ...state,
        filters: updateFilter(
          state.filters,
          (filter: ILibraryFilter) => {
            if (filter.id === filterId) {
              filter.paramOpened = value;
            }
          },
          filterId
        )
      };
    }
    case CHANGE_FILTER_CONNECTOR: {
      const { filterId, newConnector } = action.payload;

      return {
        ...state,
        filters: updateFilter(
          state.filters,
          (filter: ILibraryFilter) => {
            if (filter.id === filterId) {
              filter.nodeConnector = newConnector;
            }
          },
          filterId
        )
      };
    }
    case FILTER_FILTER_PARAM_DROPDOWN: {
      const { filterId, searchValue } = action.payload;

      return {
        ...state,
        filters: updateFilter(
          state.filters,
          (filter: ILibraryFilter) => {
            filter.filteredParams.params = filter.parsedSchema.params.filter(
              (value: Parameter) => {
                return (
                  value.name.toLowerCase().indexOf(searchValue.toLowerCase()) >=
                  0
                );
              }
            );
          },
          filterId
        )
      };
    }
    case TOGGLE_FILTER_OPENED: {
      const { filterId } = action.payload;
      return {
        ...state,
        filters: updateAllFilters(state.filters, (filter: ILibraryFilter) => {
          filter.isOpen =
            filter.id === filterId ? !filter.isOpen : filter.isOpen;
        })
      };
    }
    case CLOSE_FILTER: {
      const { filterId } = action.payload;
      return {
        ...state,
        filters: updateAllFilters(state.filters, (filter: ILibraryFilter) => {
          filter.isOpen = filter.id === filterId ? false : filter.isOpen;
        })
      };
    }
    case OPEN_FILTER: {
      const { filterId } = action.payload;
      return {
        ...state,
        filters: updateAllFilters(state.filters, (filter: ILibraryFilter) => {
          filter.isOpen = filter.id === filterId ? true : filter.isOpen;
        })
      };
    }

    case TOGGLE_EDIT_GROUP_TITLE_MODE: {
      const { filterId } = action.payload;
      return {
        ...state,
        filters: updateFilter(
          state.filters,
          (filter: ILibraryFilter) => {
            if (!filter.editTitle) {
              filter.originalTitle = filter.displayName;
              filter.tempTitleEdit = filter.displayName;
            }
            filter.editTitle = !filter.editTitle;
          },
          filterId
        )
      };
    }
    case UPDATE_GROUP_TITLE: {
      const { filterId, name } = action.payload;
      return {
        ...state,
        filters: updateFilter(
          state.filters,
          (filter: ILibraryFilter) => {
            filter.displayName = name;
          },
          filterId
        )
      };
    }
    case UPDATE_TEMP_GROUP_TITLE: {
      const { filterId, tempTitle } = action.payload;
      return {
        ...state,
        filters: updateFilter(
          state.filters,
          (filter: ILibraryFilter) => {
            filter.tempTitleEdit = tempTitle;
          },
          filterId
        )
      };
    }

    // parameters actions effects
    case CHANGE_PARAM_OPERATOR: {
      const { param, operator } = action.payload;
      return {
        ...state,
        filters: updateAllFilters(state.filters, (filter: ILibraryFilter) => {
          filter.filterCriteria.forEach((criteria: IFilterCriteria) => {
            if (criteria.id === param.id) {
              criteria.operator = operator;
            }
          });
        })
      };
    }

    case CHANGE_PARAM_VALUE: {
      const { param, value } = action.payload;
      return {
        ...state,
        filters: updateAllFilters(state.filters, (filter: ILibraryFilter) => {
          filter.filterCriteria.forEach((criteria: IFilterCriteria) => {
            if (criteria.id === param.id) {
              criteria.value = sanitizeParameterValue(value, param.type);
            }
          });
        })
      };
    }

    case CHANGE_PARAM_CONNECTOR: {
      const { param, value } = action.payload;
      return {
        ...state,
        filters: updateAllFilters(state.filters, (filter: ILibraryFilter) => {
          filter.filterCriteria.forEach((criteria: IFilterCriteria) => {
            if (criteria.id === param.id) {
              criteria.connector = value;
            }
          });
        })
      };
    }

    case REMOVE_FILTER_PARAMETER: {
      const { param } = action.payload;
      return {
        ...state,
        filters: updateAllFilters(state.filters, (filter: ILibraryFilter) => {
          filter.filterCriteria = filter.filterCriteria.filter(
            (criteria: IFilterCriteria, index: number) => {
              if (
                criteria.id === param.id &&
                filter.filterCriteria[index - 1]
              ) {
                filter.filterCriteria[index - 1].connector = 'and';
              }
              return criteria.id !== param.id;
            }
          );
        })
      };
    }

    case APPLY_SAVED_PATTERN: {
      const { filtersToRestore, position } = action.payload;

      let fil = Array.from(state.filters);
      let restoreCopy = Object.assign([], cloneObject(filtersToRestore));
      // Hydrate restored model with it's schema
      let restoreFilt = updateRestoreFilters(restoreCopy);

      fil.splice(position, 0, ...restoreFilt);

      return {
        ...state,
        filters: fil
      };
    }

    case APPLY_SAVED_PATTERN_TO_GROUP: {
      const { filtersToRestore, targetGroup, position } = action.payload;

      let restoreCopy = Object.assign([], cloneObject(filtersToRestore));
      // Hydrate restored model with it's schema
      let restoreFilt = updateRestoreFilters(restoreCopy);

      let result = addFilterTreeTo(
        state.filters,
        targetGroup,
        position,
        restoreFilt
      );

      return {
        ...state,
        filters: result
      };
    }

    case FILTER_DRAG_STARTED: {
      return {
        ...state,
        isCardBeingDragged: true,
        dropAllowed: getFiltersAmount(state) < 99
      };
    }

    case FILTER_DRAG_ENDED: {
      return {
        ...state,
        isCardBeingDragged: false
      };
    }

    case POPULATE_RESULTS_COUNT: {
      const { count } = action.payload;
      return {
        ...state,
        count
      };
    }
    case SET_SETTING_VISIBLE: {
      const { value } = action.payload;
      return {
        ...state,
        settingsVisible: value
      };
    }
    case CLEAR_RESULT_STAGE_SETTING: {
      return {
        ...state,
        isFirstLoad: true,
        selectedColumns: [],
        groupBySelectedColumns: []
      };
    }

    case SET_SELECTED_COLUMNS: {
      const { selectedColumns } = action.payload;

      return {
        ...state,
        selectedColumns: selectedColumns.map((e: ColumnData) => {
          return buildColumnName(e);
        })
      };
    }

    case POPULATE_CYPHER: {
      const { cypher } = action.payload;
      return {
        ...state,
        displayResults: cypher
      };
    }

    case POPULATE_TABLE_COLUMNS: {
      const {
        count,
        columnBuilderColumns,
        tableColumns,
        tableTop10
      } = action.payload;
      return {
        ...state,
        count,
        columnBuilderColumns: getColumnDataFromApiColumnModel(
          columnBuilderColumns
        ),
        tableColumns,
        tableTop10
      };
    }

    case SET_FIRST_LOAD: {
      return {
        ...state,
        isFirstLoad: false
      };
    }

    case SET_LOADING_STATE: {
      const { newValue } = action.payload;
      return {
        ...state,
        isLoading: newValue
      };
    }

    case SET_TIMESTAMP_VALUES: {
      const { timestamp } = action.payload;
      return {
        ...state,
        executionStartedAt: timestamp.startDate,
        executionEndedAt: timestamp.endDate
      };
    }

    // column builder options
    case MAKE_COLUMN_BUILDER_DEFAULT_SELECTION: {
      const { selectedColumns } = action.payload;

      return {
        ...state,
        selectedColumns: selectedColumns
      };
    }

    case CHANGE_COLUMN_BUILDER_DROP_STATE: {
      const { opened } = action.payload;
      return {
        ...state,
        columnBuilderSearch: !opened ? '' : state.columnBuilderSearch,
        columnBuilderOpened: opened
      };
    }

    case CHANGE_GROUP_BY_DROP_STATE: {
      const { opened } = action.payload;
      const search = !opened ? '' : state.groupBySearch;
      return {
        ...state,
        groupBySearch: search,
        groupByOpened: opened,
        groupByFilteredOptions: getGroupByDataOptions(
          state.selectedColumns,
          state.groupBySelectedColumns,
          search
        )
      };
    }

    case UPDATE_GROUP_BY_SEARCH: {
      const { search } = action.payload;
      return {
        ...state,
        groupBySearch: search,
        groupByFilteredOptions: getGroupByDataOptions(
          state.selectedColumns,
          state.groupBySelectedColumns,
          search
        )
      };
    }

    case RESET_GROUP_BY_SEARCH: {
      return {
        ...state,
        groupBySearch: '',
        groupByFilteredOptions: getGroupByDataOptions(
          state.selectedColumns,
          state.groupBySelectedColumns,
          ''
        )
      };
    }

    case BUILD_GROUP_BY_DEFAULT: {
      const { groupBySelectedColumns } = action.payload;
      const cols = groupBySelectedColumns.map((e: ColumnData) => {
        return buildColumnName(e);
      });
      return {
        ...state,
        groupBySelectedColumns: getGroupBySelected(state.selectedColumns, cols),
        groupByFilteredOptions: getGroupByDataOptions(
          state.selectedColumns,
          cols,
          state.groupBySearch
        )
      };
    }

    case UPDATE_COLUMN_BUILDER_SEARCH: {
      const { search } = action.payload;
      return {
        ...state,
        columnBuilderSearch: search,
        ...getColumnBuilderDataOptions(
          state.filters,
          state.columnBuilderColumns,
          state.rawLibrary,
          state.selectedColumns,
          search
        )
      };
    }

    case RESET_COLUMN_BUILDER_SEARCH: {
      return {
        ...state,
        columnBuilderSearch: '',
        ...getColumnBuilderDataOptions(
          state.filters,
          state.columnBuilderColumns,
          state.rawLibrary,
          state.selectedColumns,
          ''
        )
      };
    }

    case BUILD_COLUMN_BUILDER_DEFAULT: {
      return {
        ...state,
        ...getColumnBuilderDataOptions(
          state.filters,
          state.columnBuilderColumns,
          state.rawLibrary,
          state.selectedColumns,
          state.columnBuilderSearch
        )
      };
    }

    case TOGGLE_COLUMN_BUILDER_SECTION_COLLAPSED_STATE: {
      const { groupName } = action.payload;

      return {
        ...state,
        usedInFilterPatternCollapsed:
          groupName === 'usedInFilterPatternCollapsed'
            ? !state.usedInFilterPatternCollapsed
            : state.usedInFilterPatternCollapsed,
        availableCollapsed:
          groupName === 'availableCollapsed'
            ? !state.availableCollapsed
            : state.availableCollapsed,
        otherCollapsed:
          groupName === 'otherCollapsed'
            ? !state.otherCollapsed
            : state.otherCollapsed
      };
    }

    // ex filter library reducer
    case POPULATE_FILTER_LIBRARY: {
      const { filters } = action.payload;

      return {
        ...state,
        library: Object.assign([], cloneObject(getLibraryDataModel(filters))) // Break TS reference in purpose
      };
    }

    case POPULATE_FILTER_LIBRARY_RAW: {
      const { filters } = action.payload;

      return {
        ...state,
        rawLibrary: Object.assign([], cloneObject(getLibraryDataModel(filters))) // Break TS reference in purpose
      };
    }

    case ADD_FILTER_BY_CRITERIA: {
      const { criteriaAdded } = action.payload;

      return {
        ...state,
        libraryFilteredClasses: [
          ...state.libraryFilteredClasses,
          {
            id: uuid(),
            text: criteriaAdded,
            value: criteriaAdded,
            show: 1,
            className: criteriaAdded,
            displayName: criteriaAdded,
            parameterName: criteriaAdded,
            label: criteriaAdded
          }
        ]
      };
    }

    case UPDATE_FILTER_BY_CRITERIA: {
      const { updatedList } = action.payload;

      return {
        ...state,
        libraryFilteredClasses: updatedList
      };
    }

    case REMOVE_ALL_FILTER_BY_CRITERIA: {
      return {
        ...state,
        libraryFilteredClasses: []
      };
    }

    case TOGGLE_FILTER_LIBRARY_HINT: {
      const { filterId, newValue } = action.payload;

      return {
        ...state,
        library: state.library.map((group: IFilterGroup) => {
          group.filters = group.filters.map((filter: ILibraryFilter) => {
            if (filter.id === filterId) {
              filter.hover = newValue;
            }
            return filter;
          });
          return group;
        })
      };
    }

    case TOGGLE_FILTER_LIBRARY_DESCRIPTION: {
      const { filterId, value } = action.payload;

      return {
        ...state,
        library: state.library.map((group: IFilterGroup) => {
          group.filters = group.filters.map((filter: ILibraryFilter) => {
            if (filter.id === filterId) {
              filter.isOpen = value === undefined ? !filter.isOpen : value;
            }
            return filter;
          });
          return group;
        })
      };
    }

    case SEARCH_LIBRARY: {
      const { searchCriteria } = action.payload;

      const libraryCopy = cloneObject(state.rawLibrary); // Don't cross deep references back
      return {
        ...state,
        search: searchCriteria,
        library: libraryCopy
          .filter((group: IFilterGroup) => {
            return state.libraryFilteredClasses.length
              ? state.libraryFilteredClasses.some(
                  (selected: ColumnData) => selected.value === group.groupName
                )
              : true;
          })
          .map((group: IFilterGroup) => {
            group.filters = group.filters.filter((filter: ILibraryFilter) => {
              return (
                (filter.description &&
                  filter.description
                    .toLowerCase()
                    .indexOf(searchCriteria.toLowerCase()) >= 0) ||
                (filter.displayName &&
                  filter.displayName
                    .toLowerCase()
                    .indexOf(searchCriteria.toLowerCase()) >= 0)
              );
            });
            return group;
          })
      };
    }

    default:
      return state;
  }
}
