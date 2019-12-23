import { ColumnData } from '../components/resultStage/columnBuilder/columnBuilder';
import {
  ILibraryFilter,
  FilterType,
  IFilterCriteria,
  IFilterGroup,
  Parameter
} from '../components/layout/layoutTypes';
import uuid from 'uuid/v4';

export function buildColumnName(e: ColumnData) {
  return {
    ...e,
    label: e.displayName + ' : ' + e.parameterName,
    value: e.displayName + ' : ' + e.parameterName
  };
}

export function makeColumnBuilderDefaultSelection(
  filters: Array<ILibraryFilter>,
  columnBuilderColumns: Array<ColumnData>,
  rawLibrary: Array<IFilterGroup>,
  selectedColumns: Array<ColumnData>,
  columnBuilderSearch: string
) {
  const { inFilterPath, available, other } = getColumnBuilderDataOptions(
    filters,
    columnBuilderColumns,
    rawLibrary,
    selectedColumns,
    columnBuilderSearch
  );
  let selectedColumnsDefault: Array<ColumnData> = [];
  if (!selectedColumns.length) {
    if (!inFilterPath.length) {
      selectedColumnsDefault = available.concat(other);
    } else {
      selectedColumnsDefault = inFilterPath;
    }
  } else {
    selectedColumnsDefault = selectedColumns;
  }

  return selectedColumnsDefault.map((e: ColumnData) => {
    return buildColumnName(e);
  });
}

export function sortColumnDataOptions(data: Array<ColumnData>) {
  return data.sort((a: ColumnData, b: ColumnData) => {
    const paramA = a.displayName + ' : ' + a.parameterName;
    const paramB = b.displayName + ' : ' + b.parameterName;
    if (paramA < paramB) {
      return -1;
    } else if (paramA > paramB) {
      return 1;
    }
    return 0;
  });
}

function flattenedPathFilters(
  filters: Array<ILibraryFilter>,
  plain: Array<ILibraryFilter> = []
): Array<ILibraryFilter> {
  return filters.reduce((arr: Array<ILibraryFilter>, item: ILibraryFilter) => {
    if (item.filterType === FilterType.GROUP) {
      return flattenedPathFilters(item.filters, arr);
    }
    if (item.filterCriteria.length) {
      return [...arr, item];
    }
    return arr; // Just count those that have params
  }, plain);
}

function getUnique(accum: Array<ColumnData>, item: ColumnData) {
  const alreadyExists = accum.find((column: ColumnData) => {
    return (
      item.displayName === column.displayName &&
      item.parameterName === column.parameterName
    );
  });
  if (!alreadyExists) {
    return [...accum, item];
  }
  return accum;
}

function getSimpleColumnsFromPathFilter(filter: ILibraryFilter) {
  return filter.filterCriteria
    .map((criteria: IFilterCriteria, index: number) => {
      return {
        id: filter.id + '--' + index,
        className: filter.className,
        displayName: filter.displayName,
        parameterName: criteria.name
      } as ColumnData;
    })
    .reduce((accum: Array<ColumnData>, item: ColumnData) => {
      return getUnique(accum, item);
    }, []);
}

export function getFiltersColumnsFromPath(filters: Array<ILibraryFilter>) {
  return flattenedPathFilters(filters)
    .reduce((accum: Array<any>, item: ILibraryFilter) => {
      return [...accum, ...getSimpleColumnsFromPathFilter(item)];
    }, [])
    .reduce((accum: Array<ColumnData>, item: ColumnData) => {
      return getUnique(accum, item);
    }, []);
}

function flattenedLibraryFilters(
  filters: Array<IFilterGroup>,
  plain: Array<ILibraryFilter> = []
): Array<ILibraryFilter> {
  return filters.reduce((arr: Array<ILibraryFilter>, item: IFilterGroup) => {
    return [
      ...arr,
      ...item.filters.filter((filter: ILibraryFilter) => {
        return filter.parsedSchema.params.length; // Return just those that have parameters in schema
      })
    ];
  }, plain);
}

function getSimpleColumnsFromLibraryFilter(filter: ILibraryFilter) {
  return filter.parsedSchema.params
    .map((param: Parameter, index: number) => {
      return {
        id: filter.id + '--' + index,
        className: filter.className,
        displayName: filter.displayName,
        parameterName: param.name
      } as ColumnData;
    })
    .reduce((accum: Array<ColumnData>, item: ColumnData) => {
      return getUnique(accum, item);
    }, []);
}

export function getFiltersColumnsFromLibrary(filters: Array<IFilterGroup>) {
  return flattenedLibraryFilters(filters)
    .reduce((accum: Array<any>, item: ILibraryFilter) => {
      return [...accum, ...getSimpleColumnsFromLibraryFilter(item)];
    }, [])
    .reduce((accum: Array<ColumnData>, item: ColumnData) => {
      return getUnique(accum, item);
    }, []);
}

// Get group complement of two sets of Column data
// GroupA - GroupB
// will return all elements that belongs to GroupA, but not included in GroupB
export function getDifferenceFromDataSets(
  groupA: Array<ColumnData>,
  groupB: Array<ColumnData>
) {
  return groupA
    ? groupA.reduce((accum: Array<ColumnData>, elem: ColumnData) => {
        if (!existInGroup(groupB, elem)) {
          return [...accum, elem];
        }
        return accum;
      }, [])
    : [];
}

// Get group union of two sets of Column data
// GroupA + GroupB
// will return all elements that belongs to GroupA, but included in GroupB
export function getUnionFromDataSets(
  groupA: Array<ColumnData>,
  groupB: Array<ColumnData>
) {
  return groupA
    ? groupA.reduce((accum: Array<ColumnData>, elem: ColumnData) => {
        if (existInGroup(groupB, elem)) {
          return [...accum, elem];
        }
        return accum;
      }, [])
    : [];
}

function existInGroup(group: Array<ColumnData>, elem: ColumnData) {
  return group
    ? group.find((col: ColumnData) => {
        return (
          elem.className === col.className &&
          elem.displayName === col.displayName &&
          elem.parameterName === col.parameterName
        );
      })
    : false;
}

// Filter data set with criteria
export function getFilteredDataSet(
  group: Array<ColumnData>,
  filterCriteria: string
) {
  return group.filter((value: any) => {
    const param = value.displayName + ' : ' + value.parameterName;
    return param.toLowerCase().indexOf(filterCriteria.toLowerCase()) >= 0;
  });
}

export function getColumnBuilderDataOptions(
  currentPattern: Array<ILibraryFilter>,
  columnBuilderColumns: Array<ColumnData>,
  rawlibrary: Array<IFilterGroup>,
  selectedColumns: Array<ColumnData>,
  search: string
) {
  let infilterpath = sortColumnDataOptions(
    // sort data
    getFilteredDataSet(
      // filter data
      getDifferenceFromDataSets(
        // get items that belongs to filter patter but not to selected columns
        getFiltersColumnsFromPath(currentPattern),
        selectedColumns
      ),
      search
    )
  );
  return {
    inFilterPath: infilterpath,
    available: sortColumnDataOptions(
      // sort data
      getFilteredDataSet(
        // filter data
        getDifferenceFromDataSets(
          // get items that belongs to available columns but not to selected columns
          getDifferenceFromDataSets(columnBuilderColumns, infilterpath), // get items that belongs to available columns but not to filter pattern
          selectedColumns
        ),
        search
      )
    ),
    other: sortColumnDataOptions(
      // sort data
      getFilteredDataSet(
        // filter data
        getDifferenceFromDataSets(
          // get items that belongs to other columns but not to selected columns
          getDifferenceFromDataSets(
            // get items that belongs to library columns but not to jupyter returned columns (a.k.a 'other' group)
            getDifferenceFromDataSets(
              // get items that belongs to library columns but not to filterpathGroup
              getFiltersColumnsFromLibrary(rawlibrary),
              columnBuilderColumns
            ),
            infilterpath
          ),
          selectedColumns
        ),
        search
      )
    )
  };
}

export function getGroupByDataOptions(
  selectedColumns: Array<ColumnData>,
  groupBySelectedColumns: Array<ColumnData>,
  search: string
) {
  return sortColumnDataOptions(
    // sort data
    getFilteredDataSet(
      // filter data
      getDifferenceFromDataSets(
        // get items that belongs to selected columns (of column builder) but not to group by selected columns
        selectedColumns,
        groupBySelectedColumns
      ),
      search
    )
  );
}

export function getGroupBySelected(
  selectedColumns: Array<ColumnData>,
  groupBySelectedColumns: Array<ColumnData>
) {
  return getUnionFromDataSets(
    // get items that belongs to selected columns (of column builder) and in group by selected columns
    groupBySelectedColumns,
    selectedColumns
  );
}

export function getColumnDataFromApiColumnModel(
  columns: Array<Array<string>>
): Array<ColumnData> {
  return columns.map((column: Array<string>) => {
    return {
      id: uuid(),
      className: column[0],
      displayName: column[1],
      parameterName: column[2]
    } as ColumnData;
  });
}

export function getApiColumnModelFromColumnData(
  columns: Array<ColumnData>
): Array<Array<string>> {
  return columns.map((col: ColumnData) => {
    return [col.className, col.displayName, col.parameterName];
  });
}
