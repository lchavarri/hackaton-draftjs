import {
  ILibraryFilter,
  FilterType,
  IMinFilterData
} from '../../components/layout/layoutTypes';

import {
  getMinStatePathData,
  isFilterChildOfGroup,
  isFilterAGroup,
  isMultiSelect,
  bulkToggleFilterSelection
} from '../filterPathDataUtils';

describe('Filter Path Data Utils', () => {
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

  it('getMinStatePathName', () => {
    const filters: Array<ILibraryFilter> = [
      {
        ...mockFilter,
        displayName: 'Group Example',
        filterType: FilterType.GROUP,
        nodeConnector: 'xor',
        id: '1',
        filters: [
          {
            ...mockFilter
          },
          {
            ...mockFilter
          },
          {
            ...mockFilter
          },
          {
            ...mockFilter
          }
        ]
      },
      {
        ...mockFilter,
        displayName: 'Group Example 2',
        filterType: FilterType.GROUP,
        nodeConnector: 'and',
        id: '2',
        filters: [
          {
            ...mockFilter
          },
          {
            ...mockFilter
          },
          {
            ...mockFilter
          },
          {
            ...mockFilter
          }
        ]
      },
      {
        ...mockFilter,
        displayName: 'Any Action',
        filterType: FilterType.CARD,
        nodeConnector: 'xor',
        id: '3',
        filters: []
      },
      {
        ...mockFilter,
        displayName: 'Any Measurement',
        filterType: FilterType.CARD,
        nodeConnector: 'and',
        id: '4',
        filters: []
      }
    ];
    const expextedResponse: Array<IMinFilterData> = [
      {
        displayName: 'Group Example',
        nodeConnector: 'xor',
        id: '1'
      },
      {
        displayName: 'Group Example 2',
        nodeConnector: 'and',
        id: '2'
      },
      {
        displayName: 'Any Action',
        nodeConnector: 'xor',
        id: '3'
      },
      {
        displayName: 'Any Measurement',
        nodeConnector: 'and',
        id: '4'
      }
    ];
    expect(getMinStatePathData(filters)).toEqual(expextedResponse);
  });

  it('isFilterChildOfGroup', () => {
    const filters: Array<ILibraryFilter> = [
      {
        ...mockFilter,
        displayName: 'Group Example',
        filterType: FilterType.GROUP,
        nodeConnector: 'xor',
        id: 'group1',
        filters: [
          {
            ...mockFilter,
            id: 'child filter'
          },
          {
            ...mockFilter
          },
          {
            ...mockFilter
          },
          {
            ...mockFilter
          }
        ]
      },
      {
        ...mockFilter,
        displayName: 'Group Example 2',
        filterType: FilterType.GROUP,
        nodeConnector: 'and',
        id: 'group2',
        filters: [
          {
            ...mockFilter,
            id: 'another child'
          },
          {
            ...mockFilter
          },
          {
            ...mockFilter
          },
          {
            ...mockFilter
          }
        ]
      },
      {
        ...mockFilter,
        displayName: 'Any Action',
        filterType: FilterType.CARD,
        nodeConnector: 'xor',
        id: '3',
        filters: []
      },
      {
        ...mockFilter,
        displayName: 'Any Measurement',
        filterType: FilterType.CARD,
        nodeConnector: 'and',
        id: '4',
        filters: []
      }
    ];

    expect(isFilterChildOfGroup(filters, 'group1', 'child filter')).toEqual(
      true
    );
    expect(isFilterChildOfGroup(filters, 'group1', 'another child')).toEqual(
      false
    );
  });

  it('isFilterAGroup', () => {
    const filters: Array<ILibraryFilter> = [
      {
        ...mockFilter,
        displayName: 'Group Example',
        filterType: FilterType.GROUP,
        nodeConnector: 'xor',
        id: 'group1',
        filters: [
          {
            ...mockFilter
          },
          {
            ...mockFilter
          },
          {
            ...mockFilter,
            id: 'child filter',
            filterType: FilterType.GROUP,
            filters: [
              {
                ...mockFilter,
                displayName: 'Group Example 2',
                filterType: FilterType.GROUP,
                nodeConnector: 'and',
                id: 'group2',
                filters: [
                  {
                    ...mockFilter,
                    id: 'another child'
                  },
                  {
                    ...mockFilter
                  },
                  {
                    ...mockFilter
                  },
                  {
                    ...mockFilter
                  }
                ]
              }
            ]
          },
          {
            ...mockFilter
          }
        ]
      },
      {
        ...mockFilter,
        displayName: 'Any Action',
        filterType: FilterType.CARD,
        nodeConnector: 'xor',
        id: '3',
        filters: []
      },
      {
        ...mockFilter,
        displayName: 'Any Measurement',
        filterType: FilterType.CARD,
        nodeConnector: 'and',
        id: 'not a group',
        filters: []
      }
    ];

    expect(isFilterAGroup(filters, 'group1')).toEqual(true);
    expect(isFilterAGroup(filters, 'child filter')).toEqual(true);
    expect(isFilterAGroup(filters, 'not a group')).toEqual(false);
    expect(isFilterAGroup(filters, 'another child')).toEqual(false);
  });

  it('isMultiSelect', () => {
    const filters: Array<ILibraryFilter> = [
      {
        ...mockFilter,
        displayName: 'Group Example',
        filterType: FilterType.GROUP,
        nodeConnector: 'xor',
        id: 'group1',
        filters: [
          {
            ...mockFilter
          },
          {
            ...mockFilter
          },
          {
            ...mockFilter,
            id: 'child filter',
            filterType: FilterType.GROUP,
            selected: true,
            filters: [
              {
                ...mockFilter,
                displayName: 'Group Example 2',
                filterType: FilterType.GROUP,
                nodeConnector: 'and',
                id: 'group2',
                filters: [
                  {
                    ...mockFilter,
                    id: 'another child',
                    selected: true
                  },
                  {
                    ...mockFilter,
                    selected: true
                  },
                  {
                    ...mockFilter
                  },
                  {
                    ...mockFilter
                  }
                ]
              }
            ]
          },
          {
            ...mockFilter,
            selected: true
          }
        ]
      },
      {
        ...mockFilter,
        displayName: 'Any Action',
        filterType: FilterType.CARD,
        nodeConnector: 'xor',
        id: '3',
        filters: []
      },
      {
        ...mockFilter,
        displayName: 'Any Measurement',
        filterType: FilterType.CARD,
        nodeConnector: 'and',
        id: 'not a group',
        filters: []
      }
    ];

    expect(isMultiSelect(filters)).toEqual(true);
  });

  it('bulkToggleFilterSelection - select from inner filter to root of subtree - scenario 4', () => {
    const filters: Array<ILibraryFilter> = [
      {
        ...mockFilter,
        displayName: 'Group Example',
        filterType: FilterType.GROUP,
        nodeConnector: 'xor',
        id: 'group1',
        filters: [
          {
            ...mockFilter,
            id: 'first',
            selected: true
          },
          {
            ...mockFilter
          }
        ]
      },
      {
        ...mockFilter
      },
      {
        ...mockFilter,
        id: 'last'
      }
    ];

    const testResult = bulkToggleFilterSelection('last', filters, 'first');
    expect(testResult.filters[0].filters[0].selected).toEqual(true);
    expect(testResult.filters[0].filters[1].selected).toEqual(true);
    expect(testResult.filters[1].selected).toEqual(true);
    expect(testResult.filters[2].selected).toEqual(true);
  });

  it('bulkToggleFilterSelection - select from inner filter to root of subtree - scenario 5', () => {
    const filters: Array<ILibraryFilter> = [
      {
        ...mockFilter,
        displayName: 'Group Example',
        filterType: FilterType.GROUP,
        nodeConnector: 'xor',
        id: 'group1',
        filters: [
          {
            ...mockFilter,
            id: 'first',
            selected: true
          },
          {
            ...mockFilter,
            id: 'group2',
            filterType: FilterType.GROUP,
            filters: [
              {
                ...mockFilter,
                id: 'sub1',
                selected: false
              },
              {
                ...mockFilter,
                id: 'sub2',
                selected: false
              }
            ]
          }
        ]
      },
      {
        ...mockFilter,
        displayName: 'Group Example',
        filterType: FilterType.GROUP,
        nodeConnector: 'xor',
        id: 'group3',
        filters: [
          {
            ...mockFilter
          }
        ]
      },
      {
        ...mockFilter,
        id: 'last'
      }
    ];

    const testResult = bulkToggleFilterSelection('last', filters, 'first');
    expect(testResult.filters[0].filters[0].selected).toEqual(true);
    expect(testResult.filters[0].filters[1].selected).toEqual(true);
    expect(testResult.filters[1].selected).toEqual(true);
    expect(testResult.filters[2].selected).toEqual(true);
  });

  it('bulkToggleFilterSelection - select from inner filter to root of subtree - scenario 6', () => {
    const filters: Array<ILibraryFilter> = [
      {
        ...mockFilter,
        displayName: 'Group Example',
        filterType: FilterType.GROUP,
        nodeConnector: 'xor',
        id: 'group1',
        filters: [
          {
            ...mockFilter
          },
          {
            ...mockFilter,
            id: 'group2',
            filterType: FilterType.GROUP,
            filters: [
              {
                ...mockFilter,
                id: 'sub1',
                selected: true
              },
              {
                ...mockFilter
              }
            ]
          }
        ]
      },
      {
        ...mockFilter
      },
      {
        ...mockFilter,
        id: 'last'
      }
    ];

    const testResult = bulkToggleFilterSelection('last', filters, 'sub1');
    expect(testResult.filters[0].filters[0].selected).toEqual(false);
    expect(testResult.filters[0].filters[1].selected).toEqual(false);
    expect(testResult.filters[0].filters[1].filters[0].selected).toEqual(true);
    expect(testResult.filters[0].filters[1].filters[1].selected).toEqual(true);
    expect(testResult.filters[1].selected).toEqual(true);
    expect(testResult.filters[2].selected).toEqual(true);
  });

  it('bulkToggleFilterSelection - select from inner filter to root of subtree - scenario 7', () => {
    const filters: Array<ILibraryFilter> = [
      {
        ...mockFilter,
        displayName: 'Group Example',
        filterType: FilterType.GROUP,
        nodeConnector: 'xor',
        id: 'group1',
        filters: [
          {
            ...mockFilter
          },
          {
            ...mockFilter,
            id: 'group2',
            filterType: FilterType.GROUP,
            filters: [
              {
                ...mockFilter,
                id: 'sub1',
                selected: true
              },
              {
                ...mockFilter
              }
            ]
          },
          {
            ...mockFilter,
            id: 'inner2'
          },
          {
            ...mockFilter,
            id: 'inner_group',
            filterType: FilterType.GROUP,
            filters: [
              {
                ...mockFilter
              },
              {
                ...mockFilter
              }
            ]
          }
        ]
      },
      {
        ...mockFilter
      },
      {
        ...mockFilter,
        id: 'last'
      }
    ];

    const testResult = bulkToggleFilterSelection('last', filters, 'sub1');
    expect(testResult.filters[0].filters[0].selected).toEqual(false);
    expect(testResult.filters[0].filters[1].selected).toEqual(false);
    expect(testResult.filters[0].filters[1].filters[0].selected).toEqual(true); // sub1
    expect(testResult.filters[0].filters[1].filters[1].selected).toEqual(true);
    expect(testResult.filters[0].filters[2].selected).toEqual(true); // inner2
    expect(testResult.filters[0].filters[3].selected).toEqual(true); // inner_group
    expect(testResult.filters[1].selected).toEqual(true);
    expect(testResult.filters[2].selected).toEqual(true); // last
  });

  it('bulkToggleFilterSelection - select from inner filter to root of subtree - scenario 8', () => {
    const filters: Array<ILibraryFilter> = [
      {
        ...mockFilter,
        id: 'first',
        selected: true
      },
      {
        ...mockFilter,
        displayName: 'Group Example',
        filterType: FilterType.GROUP,
        nodeConnector: 'xor',
        id: 'group1',
        filters: [
          {
            ...mockFilter,
            selected: false
          },
          {
            ...mockFilter,
            selected: false
          }
        ]
      },
      {
        ...mockFilter,
        id: 'last'
      }
    ];

    const testResult = bulkToggleFilterSelection('last', filters, 'first');
    expect(testResult.filters[0].selected).toEqual(true); // first
    expect(testResult.filters[1].selected).toEqual(true);
    expect(testResult.filters[2].selected).toEqual(true); // last
  });
});
