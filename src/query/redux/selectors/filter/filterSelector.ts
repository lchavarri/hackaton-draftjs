import {
  ILibraryFilter,
  IFilterGroup
} from '../../../components/layout/layoutTypes';
import { getFilterSchema } from '../../../utils/filterFileDataService';
import { DropdownOption } from '../../../components/booleanConnector/booleanConnector';
import {
  getSelectedFilters,
  getSelectedGroups,
  getFiltersCount
} from '../../../utils/filterPathDataUtils';

export const getLibraryFilterState = (store: any) => store.library;
export const getRawLibraryFilterState = (store: any) => store.rawLibrary;

export const getFiltersState = (store: any) => store.filters;
export const getFilterById = (store: any, id: string) => {
  return getFiltersState(store)
    ? getFiltersState(store).filter(
        (filter: ILibraryFilter) => filter.id === id
      )[0]
    : {};
};

export const getGroupEnable = (store: any) => {
  return getFiltersState(store)
    ? getSelectedFilters(getFiltersState(store)).length > 1
    : false;
};

export const getUngroupEnable = (store: any) => {
  return getFiltersState(store)
    ? getSelectedGroups(getFiltersState(store)).length > 0
    : false;
};

export const getFiltersAmount = (store: any) => {
  return getFiltersState(store) ? getFiltersCount(getFiltersState(store)) : 0;
};

export const isMultiDrag = (store: any) => {
  return {
    isMultipleDrag: getFiltersState(store)
      ? getSelectedFilters(getFiltersState(store)).length > 1
      : false,
    multiDragCount: getFiltersState(store)
      ? getSelectedFilters(getFiltersState(store)).length
      : false
  };
};

export const getLibraryDataModel = (
  filters: Array<IFilterGroup>
): Array<IFilterGroup> => {
  return filters.map((group: IFilterGroup) => {
    group.filters = group.filters.map((filter: ILibraryFilter) => {
      let parameterSchem = getFilterSchema(filter.fields);
      filter.hasMultipleParameters = parameterSchem.isMultiple;
      filter.parsedSchema = { ...parameterSchem.schema };
      filter.filteredParams = { ...parameterSchem.schema };
      return filter;
    });
    return group;
  });
};

export const getLibraryCategoriesOptions = (
  store: any
): Array<DropdownOption> => {
  return getRawLibraryFilterState(store)
    .filter((group: IFilterGroup) => {
      return store.libraryFilteredClasses.length
        ? store.libraryFilteredClasses.every(
            (selected: DropdownOption) => selected.value !== group.groupName
          )
        : true;
    })
    .map((group: IFilterGroup) => {
      return {
        key: group.groupName,
        value: group.groupName,
        text:
          group.groupName.substring(0, 1).toLocaleUpperCase() +
          group.groupName
            .substring(1, group.groupName.length)
            .toLocaleLowerCase()
      };
    });
};

export const libraryHasResults = (store: any) => {
  let count = 0;
  getLibraryFilterState(store).forEach((group: IFilterGroup) => {
    count += group.filters.length;
  });
  return count === 0;
};
