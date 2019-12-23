// Vendors imports
import uuid from 'uuid/v4';

// Local imports
import {
  ILibraryFilter,
  FilterType,
  IMinFilterData
} from '../components/layout/layoutTypes';
import { getFilterSchema } from './filterFileDataService';
import { cloneObject } from './objectUtils';

/**
 * Traverse the array of ILibraryFilters provided
 * if some filterId is provided applies the patch function only to that target filter
 * if no filterId is provided apply patch function to every provided filter
 *
 * calculates each filter depth in tree while traversing the tree
 * @param filters
 * @param patch
 * @param id
 * @param depth
 */
function traversePath(
  filters: Array<ILibraryFilter>,
  patch: Function,
  id?: string,
  depth: number = 0
) {
  return filters.map((filter: ILibraryFilter, index: number) => {
    let filterCopy = { ...filter };
    if ((id && id === filter.id) || !id) {
      filterCopy = {
        ...filterCopy,
        ...patch(filterCopy),
        depth
      };
    }
    if (filter.filterType === FilterType.GROUP) {
      filterCopy = {
        ...filterCopy,
        filters: traversePath(filterCopy.filters, patch, id, depth + 1)
      };
    }
    return filterCopy;
  });
}

export function updateFilter(
  filters: Array<ILibraryFilter>,
  patch: Function,
  id: string
) {
  return traversePath(filters, patch, id);
}

export function updateAllFilters(
  filters: Array<ILibraryFilter>,
  patch: Function
) {
  return traversePath(filters, patch);
}

export function updateRestoreFilters(restoreCopy: Array<ILibraryFilter>) {
  return updateAllFilters(restoreCopy, (e: ILibraryFilter) => {
    e.id = uuid();
    const { schema, isMultiple } = getFilterSchema(e.fields);
    e.hasMultipleParameters = isMultiple;
    e.parsedSchema = { ...schema };
    e.filteredParams = { ...schema };
  });
}

export function getFiltersCount(filters: Array<ILibraryFilter>): number {
  return filters.reduce((accum: number, filter: ILibraryFilter) => {
    if (filter.filterType === FilterType.CARD) {
      accum += 1;
    }
    if (filter.filterType === FilterType.GROUP) {
      accum += getFiltersCount(filter.filters);
    }
    return accum;
  }, 0);
}

/**
 * Append filterToAdd next to filterId provided
 * @param filters
 * @param filterToAdd
 * @param id
 */
function mutateFilterChilds(
  filters: Array<ILibraryFilter>,
  filterToAdd: ILibraryFilter,
  id: string
) {
  let newFilter: Array<ILibraryFilter> = [];
  filters.forEach((filter: ILibraryFilter) => {
    let filterCopy = { ...filter };
    if (filter.filterType === FilterType.GROUP) {
      filterCopy = {
        ...filterCopy,
        filters: mutateFilterChilds(filterCopy.filters, filterToAdd, id)
      };
    }
    if (id && id === filter.id) {
      // Added filter is sibling to first selected
      newFilter.push(filterToAdd);
    }
    newFilter.push(filterCopy);
  });
  return newFilter;
}

export function groupSelectedFilters(filters: Array<ILibraryFilter>) {
  let filtersCopy = Array.from(filters);

  const selectedFilters = getSelectedFilters(filtersCopy);
  if (selectedFilters && selectedFilters.length) {
    let filtersToGroup: Array<ILibraryFilter> = [];
    selectedFilters.forEach((fil: ILibraryFilter) => {
      filtersToGroup.push({
        ...fil,
        selected: false
      });
    });

    let groupFilter: ILibraryFilter = {
      iri: '',
      id: uuid(),
      className: 'Filter ' + FilterType.GROUP,
      isOpen: true,
      nodeLabel: '',
      nodeConnector: filtersToGroup[filtersToGroup.length - 1].nodeConnector,
      description: '',
      displayName: 'Group',
      originalTitle: '',
      tempTitleEdit: '',
      selected: false,
      hover: false,
      filterType: FilterType.GROUP,
      filterCriteria: [],
      hasMultipleParameters: false,
      parsedSchema: { params: [] },
      fields: [],
      filteredParams: { params: [] },
      filters: filtersToGroup,
      depth: 0 // it will be updated afer next traverse
    };

    filtersCopy = mutateFilterChilds(
      filtersCopy,
      groupFilter,
      filtersToGroup[0].id
    );
  }

  return traversePath(getUnSelectedFilters(filtersCopy), () => {});
}

/**
 * From a provided ILibraryFilter array returns a new array providing all selected filters from
 * the tree structure
 * @param filters
 */
export const getSelectedFilters = (filters: Array<ILibraryFilter>) => {
  let selected: Array<ILibraryFilter> = [];
  filters.forEach((item: ILibraryFilter) => {
    if (item.selected) {
      selected = [...selected, item];
    }
    if (item.filters) {
      selected = [...selected, ...getSelectedFilters(item.filters)];
    }
  });
  return selected;
};

/**
 * Traverse the provided array of ILibraryFilters returning those that are not selected
 * with the same tree structure it had before
 * @param filters
 */
export const getUnSelectedFilters = (
  filters: Array<ILibraryFilter>,
  depth: number = 0
) => {
  return filters.filter((item: ILibraryFilter) => {
    if (item.filters) {
      item.depth = depth;
      item.filters = getUnSelectedFilters(item.filters, depth + 1);
    }
    return !item.selected;
  });
};

function ungroupFilter(filters: Array<ILibraryFilter>) {
  let newFilter: Array<ILibraryFilter> = [];
  filters.forEach((filter: ILibraryFilter) => {
    let filterCopy = { ...filter };
    if (filter.filterType === FilterType.GROUP) {
      filterCopy = {
        ...filterCopy,
        filters: ungroupFilter(filterCopy.filters)
      };
    }
    if (filter.filterType === FilterType.GROUP && filter.selected) {
      // Added filters where the group used to be
      filterCopy.filters.forEach((e: ILibraryFilter) => {
        e.selected = false;
      });
      // Last ungrouped filter inherits previous connector of the group
      filterCopy.filters[filterCopy.filters.length - 1].nodeConnector =
        filterCopy.nodeConnector;
      newFilter.push(...filterCopy.filters);
    } else {
      newFilter.push(filterCopy);
    }
  });
  return newFilter;
}

export function ungroupSelectedFilters(filters: Array<ILibraryFilter>) {
  return ungroupFilter(filters);
}

export const getSelectedGroups = (filters: Array<ILibraryFilter>) => {
  let selected: Array<ILibraryFilter> = [];
  filters.forEach((item: ILibraryFilter) => {
    if (item.filterType === FilterType.GROUP) {
      if (item.selected) {
        selected.push(item);
      }
      selected.push(...getSelectedGroups(item.filters));
    }
  });
  return selected;
};

/**
 * Traverse provided ILibraryFilters array and remove target filterId
 * previous filter node connector is defaulted to and
 * @param filters
 * @param id
 */
function removeFilter(filters: Array<ILibraryFilter>, id: string) {
  return filters.filter((filter: ILibraryFilter, index: number) => {
    if (filter.filters && filter.filters.length) {
      filter.filters = removeFilter(filter.filters, id);
      if (filter.id === id && index > 0 && filter.filters[index - 1]) {
        filter.filters[index - 1].nodeConnector = 'and';
      }
    } else {
      if (filter.id === id && index > 0 && filters[index - 1]) {
        filters[index - 1].nodeConnector = 'and';
      }
    }

    return filter.id !== id;
  });
}

export function removeFilterFromPath(
  filters: Array<ILibraryFilter>,
  id: string
) {
  return removeFilter(filters, id);
}

function removeEmptyFilterGroups(filters: Array<ILibraryFilter>) {
  let newFilters: Array<ILibraryFilter> = [];
  let removedFilters: Array<string> = [];

  filters.forEach((filter: ILibraryFilter, index: number) => {
    if (filter.filters && filter.filters.length) {
      const { filters, removed } = removeEmptyFilterGroups(filter.filters);
      filter.filters = filters;
      removedFilters.push(...removed);
    }
    if (filter.filterType === FilterType.GROUP && !filter.filters.length) {
      removedFilters.push(filter.displayName);
    }
    if (
      filter.filterType === FilterType.CARD ||
      (filter.filterType === FilterType.GROUP && filter.filters.length)
    ) {
      newFilters.push(filter);
    }
  });
  return {
    filters: newFilters,
    removed: removedFilters
  };
}

export function removeEmptyGroups(filters: Array<ILibraryFilter>) {
  return removeEmptyFilterGroups(filters);
}

function getFilter(filters: Array<ILibraryFilter>, id: string) {
  let filter: Array<ILibraryFilter> = [];
  filters.forEach((fil: ILibraryFilter) => {
    if (fil.id === id) {
      filter = [...filter, fil];
    }
    if (fil.filters && fil.filters.length) {
      filter = [...filter, ...getFilter(fil.filters, id)];
    }
  });
  return filter;
}

export function getFilterById(filters: Array<ILibraryFilter>, id: string) {
  return getFilter(filters, id)[0];
}

export function addFilterTreeTo(
  filters: Array<ILibraryFilter>,
  groupId: string,
  position: number,
  filtersToAdd: Array<ILibraryFilter>
) {
  let newFilters: Array<ILibraryFilter> = [];
  filters.forEach((fil: ILibraryFilter) => {
    let tempFilter = { ...fil };
    if (fil.id === groupId) {
      let resp: Array<ILibraryFilter> = [...fil.filters];
      resp.splice(position, 0, ...filtersToAdd);
      tempFilter.filters = resp;
    }
    if (fil.filters && fil.filters.length && fil.id !== groupId) {
      tempFilter.filters = addFilterTreeTo(
        fil.filters,
        groupId,
        position,
        filtersToAdd
      );
    }
    newFilters.push(tempFilter);
  });
  return newFilters;
}

function addFilterTo(
  filters: Array<ILibraryFilter>,
  groupId: string,
  position: number,
  filter: ILibraryFilter
) {
  let newFilters: Array<ILibraryFilter> = [];
  filters.forEach((fil: ILibraryFilter) => {
    let tempFilter = { ...fil };
    if (fil.id === groupId) {
      const newFilter = {
        ...filter,
        selected: false
      };
      let resp: Array<ILibraryFilter> = [...fil.filters];
      resp.splice(position, 0, newFilter);
      tempFilter.filters = resp;
    }
    if (fil.filters && fil.filters.length && fil.id !== groupId) {
      tempFilter.filters = addFilterTo(fil.filters, groupId, position, filter);
    }
    newFilters.push(tempFilter);
  });
  return newFilters;
}

/**
 * Mutates provided ILibraryFilter array to add a single filter on a target group at a specific position
 * also removes moved filter from it's original position
 * @param filters
 * @param groupId
 * @param position
 * @param filter
 */
export function addFilterToGroup(
  filters: Array<ILibraryFilter>,
  groupId: string,
  position: number,
  filter: ILibraryFilter
) {
  const copy = { ...filter };
  return addFilterTo(
    removeFilterFromPath(filters, copy.id),
    groupId,
    position,
    copy
  );
}

/**
 * Provides the path of filters that are between the root of original filters
 * and a provided filter traversing the provided filter three backwards (bottom - up)
 * @param filter
 * @param originalFilters
 * @param subFilters
 * @param path
 */
function pathToFilter(
  filter: ILibraryFilter,
  originalFilters: Array<ILibraryFilter>,
  subFilters: Array<ILibraryFilter>,
  path: Array<ILibraryFilter> = []
) {
  let newPath = [...path];
  subFilters.forEach((fil: ILibraryFilter) => {
    // Just check filters on higher depths
    if (fil.depth < filter.depth) {
      // If the depth is the inmediate previous check that the filter belongs to some
      let tempPath: Array<ILibraryFilter> = [];
      if (fil.depth === filter.depth - 1 && fil.filters && fil.filters.length) {
        let isFilterInside = fil.filters.some((e: ILibraryFilter) => {
          return e.id === filter.id;
        });
        if (isFilterInside) {
          tempPath = [
            ...pathToFilter(fil, originalFilters, originalFilters, newPath),
            fil
          ];
          newPath = tempPath;
        }
      } else if (fil.filters) {
        tempPath = [
          ...pathToFilter(filter, originalFilters, fil.filters, newPath)
        ];
        newPath = tempPath;
      }
    }
  });
  return newPath;
}

/**
 * Returns if any of the parents of a provided filter is selected
 * @param filter
 * @param filters
 */
function hasAParentSelected(
  filter: ILibraryFilter,
  filters: Array<ILibraryFilter>
) {
  return pathToFilter(filter, filters, filters).some(
    (e: ILibraryFilter) => e.selected
  );
}

export function isSelectionAllowed(
  filterId: string,
  filters: Array<ILibraryFilter>
) {
  let filter = { ...getFilter(filters, filterId)[0] };
  if (!filter) return true;
  // has child selected
  let hasSomeChildSelected =
    filter.filters && getSelectedFilters(filter.filters).length !== 0;
  // has parent selected
  let hasAnyParentSelected = hasAParentSelected(filter, filters);
  // is selection allowed
  return !hasSomeChildSelected && !hasAnyParentSelected;
}

function flattenedFilters(
  filters: Array<ILibraryFilter>,
  plain: Array<ILibraryFilter> = []
): Array<ILibraryFilter> {
  return filters.reduce((arr: Array<ILibraryFilter>, item: ILibraryFilter) => {
    if (item.filterType === FilterType.GROUP) {
      arr.push(item);
      return [...flattenedFilters(item.filters, arr)];
    } else if (item.filterType === FilterType.CARD) {
      return [...arr, item];
    }
    return arr;
  }, plain);
}

/**
 * Try to perform bulk selection from the position of filterId to the
 * lastSelected filter inside that branch or three.
 * If selection is not possible return the same original filter tree and let the user know what
 * happened
 * @param filterId
 * @param filters
 * @param lastSelectedFilterId
 */
export function bulkToggleFilterSelection(
  filterId: string,
  filters: Array<ILibraryFilter>,
  lastSelectedFilterId: string
) {
  // deep Copy filters array
  let newFilters: Array<ILibraryFilter> = cloneObject([...filters]);

  const lastSelection = lastSelectedFilterId;
  let wasPrevented: boolean = false;
  let canSelect = true;
  // Find the path to the current target
  const path = pathToFilter(
    getFilterById(newFilters, filterId),
    newFilters,
    newFilters
  );

  // Pick inmediate parent
  const parent = path[path.length - 1];

  let someForbiddenAction: Array<boolean> = [];
  let isForwardSelection: boolean;
  let isBackwardSelection: boolean;

  if (lastSelection !== '') {
    const flatFilters = flattenedFilters(newFilters);
    // Pick last selected filter in flattened array
    const lastSelectedPos = flatFilters.findIndex(e => e.id === lastSelection);
    const lastSelectedFilter = getFilterById(newFilters, lastSelection);
    // Pick target filter in flattened array
    const targetSelectionPos = flatFilters.findIndex(e => e.id === filterId);
    const targetSelSelectionFilter = getFilterById(newFilters, filterId);
    // Determine direction of selection to take accurate index boundaries
    isForwardSelection = lastSelectedPos < targetSelectionPos;

    // Max depth in between target and last selection is the limit in depth of selection
    const maxDepth = Math.max(
      lastSelectedFilter.depth,
      targetSelSelectionFilter.depth
    );
    flatFilters.forEach(e => (e.selected = false));
    targetSelSelectionFilter.selected = true;
    lastSelectedFilter.selected = true;

    flatFilters.forEach((f: ILibraryFilter, ind: number) => {
      if (f.filterType === FilterType.GROUP) {
        f.selected =
          ((isForwardSelection &&
            ind >= lastSelectedPos &&
            ind <= targetSelectionPos) ||
            (!isForwardSelection &&
              ind <= lastSelectedPos &&
              ind >= targetSelectionPos)) &&
          f.depth <= maxDepth &&
          isSelectionAllowed(f.id, newFilters);
      } else if (f.filterType === FilterType.CARD) {
        let pathToFil = pathToFilter(f, newFilters, newFilters);
        let isAllow =
          pathToFil &&
          pathToFil.length &&
          pathToFil[pathToFil.length - 1] &&
          pathToFil[pathToFil.length - 1].filters
            ? isSelectionAllowed(f.id, newFilters) &&
              !pathToFil[pathToFil.length - 1].selected
            : true;

        f.selected =
          (((isForwardSelection &&
            ind >= lastSelectedPos &&
            ind <= targetSelectionPos) ||
            (!isForwardSelection &&
              ind <= lastSelectedPos &&
              ind >= targetSelectionPos)) &&
            f.depth <= maxDepth &&
            isAllow) ||
          f.id === targetSelSelectionFilter.id ||
          f.id === lastSelectedFilter.id;
      }
    });

    // Sum up if the whole operation was successful
    wasPrevented = someForbiddenAction.some(e => e === false);
  } else {
    const rootOfSubTree =
      path.length > 1 && path[0] && path[0].filters && path[0].filters.length
        ? path[0].filters
        : newFilters;

    // Check if selection is allowed
    canSelect = isSelectionAllowed(filterId, rootOfSubTree);

    if (canSelect) {
      // If no parent is present we're on the root of the tree
      const root = parent ? parent.filters : newFilters;

      const lastSelectedPos = root.findIndex(
        filter => filter.id === lastSelectedFilterId
      );
      const filterPos = root.findIndex(filter => filter.id === filterId);

      root.forEach((filter: ILibraryFilter, index: number) => {
        if (lastSelectedPos > -1) {
          isForwardSelection =
            lastSelectedPos >= filterPos &&
            index <= lastSelectedPos &&
            index >= filterPos;
          isBackwardSelection =
            lastSelectedPos <= filterPos &&
            index >= lastSelectedPos &&
            index <= filterPos;
          filter.selected = isForwardSelection || isBackwardSelection;
          // If the filter is aiming to be selected that should be allowed
          if (isForwardSelection || isBackwardSelection) {
            someForbiddenAction.push(isSelectionAllowed(filter.id, root));
          }
        } else if (lastSelectedPos === -1 && index <= filterPos) {
          lastSelectedFilterId = filterId;
          filter.selected = true;
          // Ensure that current selection was possible
          someForbiddenAction.push(isSelectionAllowed(filter.id, root));
        }
      });
      // Sum up if the whole operation was successful
      wasPrevented = someForbiddenAction.some(e => e === false);
    }
  }

  // If operation was successful return the new values, otherwise rollback everything
  const selectionPrevented = !canSelect || wasPrevented;
  return {
    filters: selectionPrevented ? filters : newFilters,
    lastSelectedFilterId: selectionPrevented
      ? lastSelection
      : lastSelectedFilterId,
    selectionPrevented: selectionPrevented,
    filterIdSelectionAttempted: selectionPrevented ? filterId : ''
  };
}

/**
 * Misc utilities
 */
export function isMultiSelect(filters: Array<ILibraryFilter>): boolean {
  return getSelectedFilters(filters).length > 1;
}

export function isFilterAGroup(
  filters: Array<ILibraryFilter>,
  id: string
): boolean {
  let filter = { ...getFilterById(filters, id) };
  return filter && filter.filterType === FilterType.GROUP;
}

export function isFilterChildOfGroup(
  filters: Array<ILibraryFilter>,
  groupId: string,
  filterId: string
): boolean {
  let filter = { ...getFilterById(filters, groupId) };
  return (
    filter &&
    filter.filterType === FilterType.GROUP &&
    filter.filters.some((fil: ILibraryFilter) => {
      return fil.id === filterId;
    })
  );
}

export function getMinStatePathData(filters: Array<ILibraryFilter>) {
  return filters.map((filter: ILibraryFilter) => {
    return {
      id: filter.id,
      displayName: filter.displayName,
      nodeConnector: filter.nodeConnector
    } as IMinFilterData;
  });
}
