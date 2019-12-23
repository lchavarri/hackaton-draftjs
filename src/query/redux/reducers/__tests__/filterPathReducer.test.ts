import reducer, { filtersState } from '../filterPathReducer';
import * as types from '../../actionTypes';
import {
  ILibraryFilter,
  FilterType,
  FilterCriteriaType,
  Schema,
  Parameter,
  IFilterCriteria
} from '../../../components/layout/layoutTypes';

describe('Filter Path Reducer', () => {
  let mockFilter: ILibraryFilter = {
    className: 'Action',
    description: 'This will include any related Action in your results ',
    displayName: 'Any Action',
    filterCriteria: [],
    filterType: FilterType.CARD,
    filteredParams: {
      params: []
    },
    filters: [],
    hasMultipleParameters: false,
    hover: false,
    id: 'moved-ActionClass-0--b7e30293-5844-4341-9fee-790e2598ef63',
    isOpen: true,
    depth: 0,
    nodeConnector: 'and',
    nodeLabel: '',
    parsedSchema: {
      params: []
    },
    fields: [],
    selected: false,
    originalTitle: '',
    tempTitleEdit: ''
  };

  let mockParameter: Parameter = {
    connector: 'and',
    id: '',
    name: '',
    operator: 'not null',
    required: true,
    type: 'float',
    value: ''
  };

  let filterMockSchema: Schema = {
    params: [
      {
        ...mockParameter,
        name: 'Orthorhombic Cordierite'
      },
      {
        ...mockParameter,
        name: 'Hexagonal Cordierite'
      },
      {
        ...mockParameter,
        name: 'Spinel'
      },
      {
        ...mockParameter,
        name: 'Sapphirine'
      },
      {
        ...mockParameter,
        name: 'Mullite'
      },
      {
        ...mockParameter,
        name: 'Amorphous Phase'
      },
      {
        ...mockParameter,
        name: 'Total Minor Phases'
      },
      {
        ...mockParameter,
        name: 'O/H'
      }
    ]
  };

  let mockFilterCriteriaWithValues: Array<IFilterCriteria> = [
    {
      connector: 'and',
      id: '34d9cfea-6310-47c6-8264-93b3bf3918de',
      name: 'Orthorhombic Cordierite',
      operator: '=',
      required: true,
      type: FilterCriteriaType.FLOAT,
      value: '345'
    },
    {
      connector: 'and',
      id: '5be400c8-e150-4873-b924-875f7e8ff014',
      name: 'Hexagonal Cordierite',
      operator: '≠',
      required: true,
      type: FilterCriteriaType.FLOAT,
      value: '345'
    },
    {
      connector: 'and',
      id: '1fc369a7-bb45-430b-b6ab-19dcbe584540',
      name: 'Spinel',
      operator: '<',
      required: true,
      type: FilterCriteriaType.FLOAT,
      value: '5'
    },
    {
      connector: 'and',
      id: '21803538-a180-4dfe-8879-a6198f95c40c',
      name: 'Total Minor Phases',
      operator: '>=',
      required: true,
      type: FilterCriteriaType.FLOAT,
      value: '4325'
    }
  ];

  let mockFilterCriteriaWithoutValues: Array<IFilterCriteria> = Array.from(
    mockFilterCriteriaWithValues.map(c => {
      c.value = '';
      return c;
    })
  );

  let mockFilterWithParamsWithValues: ILibraryFilter = {
    className: 'Property',
    depth: 0,
    description: '',
    displayName: 'XRD Cordierite Phase Fractions',
    filterCriteria: mockFilterCriteriaWithValues,
    filterType: FilterType.CARD,
    filteredParams: filterMockSchema,
    hasMultipleParameters: true,
    hover: false,
    id:
      'moved-XRD-CordieritePhase Fractions-bf8748428c834c24b5ceed0042bcf39e--2ac8062d-7650-40a6-a1f3-b42438b7bd03',
    isOpen: true,
    nodeConnector: 'and',
    nodeLabel: 'XRD Cordierite Phase Fractions',
    paramOpened: true,
    parsedSchema: filterMockSchema,
    fields: [],
    selected: false,
    originalTitle: '',
    tempTitleEdit: '',
    filters: []
  };

  let mockFilterWithParamsWithoutValues: ILibraryFilter = {
    className: 'Property',
    depth: 0,
    description: '',
    displayName: 'XRD Cordierite Phase Fractions',
    filterCriteria: mockFilterCriteriaWithoutValues,
    filterType: FilterType.CARD,
    filteredParams: filterMockSchema,
    hasMultipleParameters: true,
    hover: false,
    id:
      'moved-XRD-CordieritePhase Fractions-bf8748428c834c24b5ceed0042bcf39e--2ac8062d-7650-40a6-a1f3-b42438b7bd03',
    isOpen: true,
    nodeConnector: 'and',
    nodeLabel: 'XRD Cordierite Phase Fractions',
    paramOpened: true,
    parsedSchema: filterMockSchema,
    fields: [],
    selected: false,
    originalTitle: '',
    tempTitleEdit: '',
    filters: []
  };

  const mockGroup = {
    ...mockFilterWithParamsWithoutValues,
    filterType: FilterType.GROUP,
    id: 'Group1Test',
    filters: [
      {
        ...mockFilterWithParamsWithoutValues,
        id: 'SubFilter1'
      },
      {
        ...mockFilterWithParamsWithoutValues,
        id: 'SubFilter2'
      },
      {
        ...mockFilterWithParamsWithoutValues,
        id: 'SubFilter3'
      }
    ]
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

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      ...initialState,
      filters: [],
      lastSelectedFilterId: '',
      filterIdBeingDragged: '',
      isCardBeingDragged: false,
      removedFilters: [''],
      emptyGroupDeletedModalOpened: false,
      dropAllowed: true,
      isDraggedFilterSelected: false,
      selectionPrevented: false,
      filterIdSelectionAttempted: ''
    });
  });

  it('should handle ADD_FILTER_TO_PATH', () => {
    expect(
      reducer(undefined, {
        type: types.ADD_FILTER_TO_PATH,
        payload: {
          filter: mockFilter,
          position: 0
        }
      })
    ).toEqual({
      ...initialState,
      filters: [mockFilter],
      lastSelectedFilterId: '',
      filterIdBeingDragged: '',
      isCardBeingDragged: false,
      removedFilters: [''],
      emptyGroupDeletedModalOpened: false,
      dropAllowed: true,
      isDraggedFilterSelected: false,
      selectionPrevented: false,
      filterIdSelectionAttempted: ''
    });
  });

  it('should handle UPDATE_FILTERS_ON_PATH', () => {
    expect(
      reducer(undefined, {
        type: types.UPDATE_FILTERS_ON_PATH,
        payload: {
          filters: [mockFilter, mockFilter, mockFilter, mockFilter]
        }
      })
    ).toEqual({
      ...initialState,
      filters: [mockFilter, mockFilter, mockFilter, mockFilter],
      lastSelectedFilterId: '',
      filterIdBeingDragged: '',
      isCardBeingDragged: false,
      removedFilters: [''],
      emptyGroupDeletedModalOpened: false,
      dropAllowed: true,
      isDraggedFilterSelected: false,
      selectionPrevented: false,
      filterIdSelectionAttempted: ''
    });
  });

  it('should handle REMOVE_FILTER_FROM_PATH', () => {
    // Missing cases whith complex filterpath saved and removing a filter leads to an empty group/groups deleted
    expect(
      reducer(
        {
          ...initialState,
          filters: [mockFilter],
          lastSelectedFilterId: '',
          filterIdBeingDragged: '',
          isCardBeingDragged: false,
          removedFilters: [''],
          emptyGroupDeletedModalOpened: true,
          dropAllowed: true,
          isDraggedFilterSelected: false,
          selectionPrevented: false,
          filterIdSelectionAttempted: ''
        },
        {
          type: types.REMOVE_FILTER_FROM_PATH,
          payload: {
            filter: mockFilter.id
          }
        }
      )
    ).toEqual({
      ...initialState,
      filters: [],
      lastSelectedFilterId: '',
      filterIdBeingDragged: '',
      isCardBeingDragged: false,
      removedFilters: [],
      emptyGroupDeletedModalOpened: false,
      dropAllowed: true,
      isDraggedFilterSelected: false,
      selectionPrevented: false,
      filterIdSelectionAttempted: ''
    });
  });

  it('should handle CLEAR_EMPTY_DELETED_GROUPS', () => {
    expect(
      reducer(undefined, {
        type: types.CLEAR_EMPTY_DELETED_GROUPS,
        payload: {}
      })
    ).toEqual({
      ...initialState,
      filters: [],
      lastSelectedFilterId: '',
      filterIdBeingDragged: '',
      isCardBeingDragged: false,
      removedFilters: [],
      emptyGroupDeletedModalOpened: false,
      dropAllowed: true,
      isDraggedFilterSelected: false,
      selectionPrevented: false,
      filterIdSelectionAttempted: ''
    });
  });

  it('should handle TOGGLE_EMPTY_GROUP_DELETED_OPEN_MODAL', () => {
    expect(
      reducer(undefined, {
        type: types.TOGGLE_EMPTY_GROUP_DELETED_OPEN_MODAL,
        payload: {}
      })
    ).toEqual({
      ...initialState,
      filters: [],
      lastSelectedFilterId: '',
      filterIdBeingDragged: '',
      isCardBeingDragged: false,
      removedFilters: [''],
      emptyGroupDeletedModalOpened: true,
      dropAllowed: true,
      isDraggedFilterSelected: false,
      selectionPrevented: false,
      filterIdSelectionAttempted: ''
    });
  });

  // missing MOVE_FILTER_TO_GROUP
  // MOVE_FILTER_FROM_GROUP_TO_PATH
  // MOVE_FILTER_WITHIN_GROUP
  it('should handle DELETE_ALL_FILTERS_ON_PATH', () => {
    expect(
      reducer(
        {
          ...initialState,
          filters: [
            mockFilter,
            mockFilter,
            mockFilter,
            mockFilter,
            mockFilter,
            mockFilter
          ],
          lastSelectedFilterId: '',
          filterIdBeingDragged: '',
          isCardBeingDragged: false,
          removedFilters: [''],
          emptyGroupDeletedModalOpened: true,
          dropAllowed: true,
          isDraggedFilterSelected: false,
          selectionPrevented: false,
          filterIdSelectionAttempted: ''
        },
        {
          type: types.DELETE_ALL_FILTERS_ON_PATH,
          payload: {}
        }
      )
    ).toEqual({
      ...initialState,
      filters: [],
      lastSelectedFilterId: '',
      filterIdBeingDragged: '',
      isCardBeingDragged: false,
      removedFilters: [''],
      emptyGroupDeletedModalOpened: true,
      dropAllowed: true,
      isDraggedFilterSelected: false,
      selectionPrevented: false,
      filterIdSelectionAttempted: ''
    });
  });

  it('should handle UPDATE_DRAGGED_FILTER_ID', () => {
    expect(
      reducer(
        {
          ...initialState,
          filters: [{ ...mockFilter, selected: true, id: 'filter1' }],
          lastSelectedFilterId: '',
          filterIdBeingDragged: '',
          isCardBeingDragged: false,
          removedFilters: [''],
          emptyGroupDeletedModalOpened: false,
          dropAllowed: true,
          isDraggedFilterSelected: false,
          selectionPrevented: false,
          filterIdSelectionAttempted: ''
        },
        {
          type: types.UPDATE_DRAGGED_FILTER_ID,
          payload: {
            filterId: 'filter1'
          }
        }
      )
    ).toEqual({
      ...initialState,
      filters: [{ ...mockFilter, selected: true, id: 'filter1' }],
      lastSelectedFilterId: '',
      filterIdBeingDragged: 'filter1',
      isCardBeingDragged: false,
      removedFilters: [''],
      emptyGroupDeletedModalOpened: false,
      dropAllowed: true,
      isDraggedFilterSelected: true,
      selectionPrevented: false,
      filterIdSelectionAttempted: ''
    });
  });

  it('should handle CLEAR_ALL_FILTERS_ON_PATH', () => {
    expect(
      reducer(
        {
          ...initialState,
          filters: [
            mockFilterWithParamsWithValues,
            mockFilterWithParamsWithValues,
            mockFilterWithParamsWithValues,
            mockFilterWithParamsWithValues,
            mockFilterWithParamsWithValues
          ],
          lastSelectedFilterId: '',
          filterIdBeingDragged: '',
          isCardBeingDragged: false,
          removedFilters: [''],
          emptyGroupDeletedModalOpened: false,
          dropAllowed: true,
          isDraggedFilterSelected: false,
          selectionPrevented: false,
          filterIdSelectionAttempted: ''
        },
        {
          type: types.CLEAR_ALL_FILTERS_ON_PATH,
          payload: {}
        }
      )
    ).toEqual({
      ...initialState,
      filters: [
        mockFilterWithParamsWithoutValues,
        mockFilterWithParamsWithoutValues,
        mockFilterWithParamsWithoutValues,
        mockFilterWithParamsWithoutValues,
        mockFilterWithParamsWithoutValues
      ],
      lastSelectedFilterId: '',
      filterIdBeingDragged: '',
      isCardBeingDragged: false,
      removedFilters: [''],
      emptyGroupDeletedModalOpened: false,
      dropAllowed: true,
      isDraggedFilterSelected: false,
      selectionPrevented: false,
      filterIdSelectionAttempted: ''
    });
  });

  it('should handle ADD_FILTER_PARAMETER', () => {
    let param: Parameter = {
      ...mockParameter,
      name: 'Orthorhombic Cordierite TEST',
      id: '37b49b45-180e-4871-8cb3-8eb968e46a42'
    };
    let modifiedFilter: ILibraryFilter = {
      ...mockFilterWithParamsWithValues
    };

    modifiedFilter.filterCriteria = [
      ...modifiedFilter.filterCriteria,
      param as IFilterCriteria
    ];

    let testResult = reducer(
      {
        ...initialState,
        filters: [mockFilterWithParamsWithValues],
        lastSelectedFilterId: '',
        filterIdBeingDragged: '',
        isCardBeingDragged: false,
        removedFilters: [''],
        emptyGroupDeletedModalOpened: false,
        dropAllowed: true,
        isDraggedFilterSelected: false,
        selectionPrevented: false,
        filterIdSelectionAttempted: ''
      },
      {
        type: types.ADD_FILTER_PARAMETER,
        payload: {
          parameter: param,
          filterId:
            'moved-XRD-CordieritePhase Fractions-bf8748428c834c24b5ceed0042bcf39e--2ac8062d-7650-40a6-a1f3-b42438b7bd03'
        }
      }
    );
    expect(
      testResult.filters[0].filterCriteria[
        testResult.filters[0].filterCriteria.length - 1
      ].name
    ).toEqual('Orthorhombic Cordierite TEST');
  });

  it('should handle FILTER_SELECTION', () => {
    const filters = [
      {
        ...mockFilterWithParamsWithValues,
        id: 'Test1'
      },
      {
        ...mockFilterWithParamsWithValues,
        id: 'Test2'
      },
      {
        ...mockFilterWithParamsWithValues,
        id: 'Test3'
      },
      {
        ...mockFilterWithParamsWithValues,
        id: 'Test4'
      }
    ];
    const testResult = reducer(
      {
        ...initialState,
        filters: filters,
        lastSelectedFilterId: '',
        filterIdBeingDragged: '',
        isCardBeingDragged: false,
        removedFilters: [''],
        emptyGroupDeletedModalOpened: false,
        dropAllowed: true,
        isDraggedFilterSelected: false,
        selectionPrevented: false,
        filterIdSelectionAttempted: ''
      },
      {
        type: types.FILTER_SELECTION,
        payload: {
          filterId: 'Test3'
        }
      }
    );
    expect(testResult.filters[0].selected).toEqual(false);
    expect(testResult.filters[1].selected).toEqual(false);
    expect(testResult.filters[2].selected).toEqual(true);
    expect(testResult.filters[3].selected).toEqual(false);
    expect(testResult.lastSelectedFilterId).toEqual('Test3');
  });

  it('should handle TOGGLE_FILTER_SELECTION', () => {
    const filters = [
      {
        ...mockFilterWithParamsWithValues,
        id: 'Test1'
      },
      {
        ...mockFilterWithParamsWithValues,
        id: 'Test2',
        selected: true
      },
      {
        ...mockFilterWithParamsWithValues,
        id: 'Test3'
      },
      {
        ...mockFilterWithParamsWithValues,
        id: 'Test4'
      }
    ];
    const testResult = reducer(
      {
        ...initialState,
        filters: filters,
        lastSelectedFilterId: '',
        filterIdBeingDragged: '',
        isCardBeingDragged: false,
        removedFilters: [''],
        emptyGroupDeletedModalOpened: false,
        dropAllowed: true,
        isDraggedFilterSelected: false,
        selectionPrevented: false,
        filterIdSelectionAttempted: ''
      },
      {
        type: types.TOGGLE_FILTER_SELECTION,
        payload: {
          filterId: 'Test2'
        }
      }
    );
    expect(testResult.filters[0].selected).toEqual(false);
    expect(testResult.filters[1].selected).toEqual(false);
    expect(testResult.filters[2].selected).toEqual(false);
    expect(testResult.filters[3].selected).toEqual(false);
    expect(testResult.lastSelectedFilterId).toEqual('');

    const testResult2 = reducer(
      {
        ...initialState,
        filters: testResult.filters,
        lastSelectedFilterId: '',
        filterIdBeingDragged: '',
        isCardBeingDragged: false,
        removedFilters: [''],
        emptyGroupDeletedModalOpened: false,
        dropAllowed: true,
        isDraggedFilterSelected: false,
        selectionPrevented: false,
        filterIdSelectionAttempted: ''
      },
      {
        type: types.TOGGLE_FILTER_SELECTION,
        payload: {
          filterId: 'Test2'
        }
      }
    );
    expect(testResult2.filters[1].selected).toEqual(true);
  });

  it('should handle TOGGLE_FILTER_SELECTION preventing selection of parent filter if child is selected', () => {
    const filters = [
      {
        ...mockGroup,
        id: 'group1',
        filters: [
          {
            ...mockFilterWithParamsWithValues,
            id: 'Test1'
          },
          {
            ...mockFilterWithParamsWithValues,
            id: 'Test2',
            selected: true
          },
          {
            ...mockFilterWithParamsWithValues,
            id: 'Test3'
          },
          {
            ...mockFilterWithParamsWithValues,
            id: 'Test4'
          }
        ]
      }
    ];
    const testResult = reducer(
      {
        ...initialState,
        filters: filters,
        lastSelectedFilterId: '',
        filterIdBeingDragged: '',
        isCardBeingDragged: false,
        removedFilters: [''],
        emptyGroupDeletedModalOpened: false,
        dropAllowed: true,
        isDraggedFilterSelected: false,
        selectionPrevented: false,
        filterIdSelectionAttempted: ''
      },
      {
        type: types.TOGGLE_FILTER_SELECTION,
        payload: {
          filterId: 'group1'
        }
      }
    );
    expect(testResult.filters[0].selected).toEqual(false);
    expect(testResult.selectionPrevented).toEqual(true);
    expect(testResult.filterIdSelectionAttempted).toEqual('group1');
  });

  it('should handle TOGGLE_FILTER_SELECTION preventing selection of child filter if parent is selected', () => {
    const test = reducer(
      {
        ...initialState,
        filters: [
          {
            ...mockGroup,
            selected: true,
            id: 'Group3',
            depth: 0,
            filters: [
              {
                ...mockFilter,
                depth: 1,
                selected: false,
                id: 'tryToSelectThis'
              },
              {
                ...mockFilter,
                depth: 1,
                id: 'Test2'
              },
              {
                ...mockFilter,
                depth: 1,
                id: 'Test3'
              },
              {
                ...mockFilter,
                depth: 1,
                id: 'Test4'
              }
            ]
          }
        ],
        lastSelectedFilterId: '',
        filterIdBeingDragged: '',
        isCardBeingDragged: false,
        removedFilters: [''],
        emptyGroupDeletedModalOpened: false,
        dropAllowed: true,
        isDraggedFilterSelected: false,
        selectionPrevented: false,
        filterIdSelectionAttempted: ''
      },
      {
        type: types.TOGGLE_FILTER_SELECTION,
        payload: {
          filterId: 'tryToSelectThis'
        }
      }
    );

    expect(test.filters[0].selected).toEqual(true);
    expect(test.filters[0].filters[0].selected).toEqual(false);
    expect(test.selectionPrevented).toEqual(true);
    expect(test.filterIdSelectionAttempted).toEqual('tryToSelectThis');
  });

  it('should handle GROUP_SELECTED_FILTERS', () => {
    const filters = [
      {
        ...mockFilterWithParamsWithValues,
        id: 'Test1'
      },
      {
        ...mockFilterWithParamsWithValues,
        id: 'Test2',
        selected: true
      },
      {
        ...mockFilterWithParamsWithValues,
        id: 'Test3',
        selected: true
      },
      {
        ...mockFilterWithParamsWithValues,
        id: 'Test4',
        selected: true
      }
    ];
    const testResult = reducer(
      {
        ...initialState,
        filters: filters,
        lastSelectedFilterId: '',
        filterIdBeingDragged: '',
        isCardBeingDragged: false,
        removedFilters: [''],
        emptyGroupDeletedModalOpened: false,
        dropAllowed: true,
        isDraggedFilterSelected: false,
        selectionPrevented: false,
        filterIdSelectionAttempted: ''
      },
      {
        type: types.GROUP_SELECTED_FILTERS,
        payload: {}
      }
    );
    expect(testResult.filters.length).toEqual(2);
    expect(testResult.filters[0].filterType).toEqual(FilterType.CARD);
    expect(testResult.filters[1].filterType).toEqual(FilterType.GROUP);
    expect(testResult.filters[1].displayName).toEqual('Group');
    expect(testResult.filters[1].filters.length).toEqual(3);
  });

  it('should handle UNGROUP_SELECTED_FILTERS', () => {
    const filters = [
      {
        ...mockFilterWithParamsWithValues,
        id: 'Test1'
      },
      {
        ...mockGroup,
        selected: true
      },
      {
        ...mockFilterWithParamsWithValues,
        id: 'Test3'
      },
      {
        ...mockFilterWithParamsWithValues,
        id: 'Test4'
      }
    ];
    const testResult = reducer(
      {
        ...initialState,
        filters: filters,
        lastSelectedFilterId: '',
        filterIdBeingDragged: '',
        isCardBeingDragged: false,
        removedFilters: [''],
        emptyGroupDeletedModalOpened: false,
        dropAllowed: true,
        isDraggedFilterSelected: false,
        selectionPrevented: false,
        filterIdSelectionAttempted: ''
      },
      {
        type: types.UNGROUP_SELECTED_FILTERS,
        payload: {}
      }
    );
    expect(testResult.filters.length).toEqual(6);
    expect(testResult.filters[0].filterType).toEqual(FilterType.CARD);
    expect(testResult.filters[1].filterType).toEqual(FilterType.CARD);
  });

  it('should handle CHANGE_FILTER_CONNECTOR', () => {
    const filters = [
      {
        ...mockFilterWithParamsWithValues,
        id: 'Test1'
      },
      {
        ...mockGroup
      },
      {
        ...mockFilterWithParamsWithValues,
        id: 'Test3'
      },
      {
        ...mockFilterWithParamsWithValues,
        id: 'Test4'
      }
    ];
    const testResult = reducer(
      {
        ...initialState,
        filters: filters,
        lastSelectedFilterId: '',
        filterIdBeingDragged: '',
        isCardBeingDragged: false,
        removedFilters: [''],
        emptyGroupDeletedModalOpened: false,
        dropAllowed: true,
        isDraggedFilterSelected: false,
        selectionPrevented: false,
        filterIdSelectionAttempted: ''
      },
      {
        type: types.CHANGE_FILTER_CONNECTOR,
        payload: {
          filterId: 'SubFilter1',
          newConnector: 'xor'
        }
      }
    );
    expect(testResult.filters[1].filters[0].id).toEqual('SubFilter1');
    expect(testResult.filters[1].filters[0].nodeConnector).toEqual('xor');
  });

  it('should handle APPLY_SAVED_PATTERN', () => {
    const filters = [
      {
        ...mockFilterWithParamsWithValues,
        id: 'Test1'
      },
      {
        ...mockGroup,
        id: 'group1'
      },
      {
        ...mockFilterWithParamsWithValues,
        id: 'Test3'
      },
      {
        ...mockFilterWithParamsWithValues,
        id: 'Test4'
      }
    ];

    const savedFilters = [
      {
        ...mockFilterWithParamsWithValues,
        id: 'Test5'
      },
      {
        ...mockGroup,
        id: 'group2'
      },
      {
        ...mockFilterWithParamsWithValues,
        id: 'Test6'
      },
      {
        ...mockFilterWithParamsWithValues,
        id: 'Test7'
      }
    ];

    const testSet = reducer(
      {
        ...initialState,
        filters: filters,
        lastSelectedFilterId: '',
        filterIdBeingDragged: '',
        isCardBeingDragged: false,
        removedFilters: [''],
        emptyGroupDeletedModalOpened: false,
        dropAllowed: true,
        isDraggedFilterSelected: false,
        selectionPrevented: false,
        filterIdSelectionAttempted: ''
      },
      {
        type: types.APPLY_SAVED_PATTERN,
        payload: {
          filtersToRestore: savedFilters,
          position: 1
        }
      }
    );

    expect(testSet.filters.length).toEqual(8);
    expect(testSet.filters[0].id).toEqual('Test1');
    expect(testSet.filters[5].id).toEqual('group1');
  });

  it('should handle APPLY_SAVED_PATTERN_TO_GROUP', () => {
    const filters = [
      {
        ...mockFilterWithParamsWithValues,
        id: 'Test1'
      },
      {
        ...mockGroup,
        id: 'group1'
      },
      {
        ...mockFilterWithParamsWithValues,
        id: 'Test3'
      },
      {
        ...mockFilterWithParamsWithValues,
        id: 'Test4'
      }
    ];

    const savedFilters = [
      {
        ...mockFilterWithParamsWithValues,
        id: 'Test5'
      },
      {
        ...mockGroup,
        id: 'group2'
      },
      {
        ...mockFilterWithParamsWithValues,
        id: 'Test6'
      },
      {
        ...mockFilterWithParamsWithValues,
        id: 'Test7'
      }
    ];

    const testSet = reducer(
      {
        ...initialState,
        filters: filters,
        lastSelectedFilterId: '',
        filterIdBeingDragged: '',
        isCardBeingDragged: false,
        removedFilters: [''],
        emptyGroupDeletedModalOpened: false,
        dropAllowed: true,
        isDraggedFilterSelected: false,
        selectionPrevented: false,
        filterIdSelectionAttempted: ''
      },
      {
        type: types.APPLY_SAVED_PATTERN_TO_GROUP,
        payload: {
          filtersToRestore: savedFilters,
          targetGroup: 'group1',
          position: 1
        }
      }
    );

    expect(testSet.filters[1].filters.length).toEqual(7);
  });

  it('should handle REORDER_SELECTED_FILTERS_ON_PATH', () => {
    const filters = [
      {
        ...mockFilterWithParamsWithValues,
        id: 'Test1',
        selected: true
      },
      {
        ...mockGroup,
        id: 'group1',
        selected: true
      },
      {
        ...mockFilterWithParamsWithValues,
        id: 'Test3'
      },
      {
        ...mockFilterWithParamsWithValues,
        id: 'Test4'
      }
    ];

    const testSet = reducer(
      {
        ...initialState,
        filters: filters,
        lastSelectedFilterId: '',
        filterIdBeingDragged: '',
        isCardBeingDragged: false,
        removedFilters: [''],
        emptyGroupDeletedModalOpened: false,
        dropAllowed: true,
        isDraggedFilterSelected: false,
        selectionPrevented: false,
        filterIdSelectionAttempted: ''
      },
      {
        type: types.REORDER_SELECTED_FILTERS_ON_PATH,
        payload: {
          to: 2,
          oldIndex: 0
        }
      }
    );

    expect(testSet.filters[1].id).toEqual('Test1');
    expect(testSet.filters[2].id).toEqual('group1');
  });

  it('should handle MOVE_SELECTED_FILTERS_TO_GROUP', () => {
    const filters = [
      {
        ...mockFilterWithParamsWithValues,
        id: 'Test1',
        selected: true
      },
      {
        ...mockGroup,
        id: 'group1'
      },
      {
        ...mockFilterWithParamsWithValues,
        id: 'Test3',
        selected: true
      },
      {
        ...mockFilterWithParamsWithValues,
        id: 'Test4'
      }
    ];

    const testSet = reducer(
      {
        ...initialState,
        filters: filters,
        lastSelectedFilterId: '',
        filterIdBeingDragged: '',
        isCardBeingDragged: false,
        removedFilters: [''],
        emptyGroupDeletedModalOpened: false,
        dropAllowed: true,
        isDraggedFilterSelected: false,
        selectionPrevented: false,
        filterIdSelectionAttempted: ''
      },
      {
        type: types.MOVE_SELECTED_FILTERS_TO_GROUP,
        payload: {
          where: 2,
          id: 'group1'
        }
      }
    );

    expect(testSet.filters[0].filters[2].id).toEqual('Test1');
    expect(testSet.filters[0].filters[3].id).toEqual('Test3');
  });
});
