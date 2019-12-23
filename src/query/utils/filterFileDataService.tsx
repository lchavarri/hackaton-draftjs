import {
  ILibraryFilter,
  IFilterCriteria,
  FilterType,
  FilterCriteriaType,
  IFilterGroup,
  Schema,
  Parameter,
  Field
} from '../components/layout/layoutTypes';
import { sanitizeParameterValue } from './stringUtils';
import { IFilterDTO, IFilterCriteriaDTO } from './filterDataService';
import { getAllTypeClasses } from '../services/libraryDataService';
import uuid from 'uuid/v4';
import {
  filterOptions,
  parameterOptions
} from '../components/booleanConnector/booleanConnector';
import {
  DefaultIntegerParameter,
  DefaultStringParameter,
  DefaultFloatParameter,
  integerOperatorOptions,
  floatOperatorOptions,
  stringOperatorOptions
} from '../components/filterParameters/filterCriteriaTypes';

// interfaces
interface RawData {
  [key: string]:
    | string
    | boolean
    | number
    | Array<ILibraryFilter>
    | Array<IFilterCriteria>;
}

let EmptyLibraryFilter: IFilterDTO = {
  className: '',
  nodeLabel: '',
  nodeConnector: '',
  iri: '',
  fields: [],
  filterType: FilterType.CARD || FilterType.GROUP,
  filterCriteria: []
};

let EmptyFilterCriteria: IFilterCriteriaDTO = {
  type: FilterCriteriaType.INTEGER,
  name: '',
  operator: '',
  value: '',
  connector: ''
};

function checkFilterClassStructure(filter: any) {
  return Object.keys(EmptyLibraryFilter).every((p: string) => {
    return Object.keys(filter).some((pp: string) => {
      return p === pp;
    });
  });
}

function checkCriteriaClassStructure(criteria: any) {
  return Object.keys(EmptyFilterCriteria).every((p: string) => {
    return Object.keys(criteria).some((pp: string) => {
      return p === pp;
    });
  });
}

function checkSimpleFilterIntegrity(
  filter: ILibraryFilter,
  validity: Array<boolean>,
  library: Array<any>
) {
  const libraryFilter = findFilterInLibrary(
    filter.className,
    filter.nodeLabel,
    library
  );
  validity.push(!!libraryFilter);
  if (libraryFilter) {
    // validate that json properties matches with library filter definition
    const filterValidity: boolean = checkFilterValidity(filter, libraryFilter);
    validity.push(filterValidity);

    if (filterValidity) {
      // fill missing data that is not in dto
      fillMissingFilterFields(filter, libraryFilter);

      const schema: Schema = getFilterSchema(libraryFilter.fields).schema;

      filter.filterCriteria.forEach((criteria: IFilterCriteria) => {
        // check criteria integrity
        const matchCriteriaClass: boolean = checkCriteriaClassStructure(
          criteria
        );
        validity.push(matchCriteriaClass);
        // if it's valid try to validate internal integrity
        if (matchCriteriaClass) {
          // find criteria in schema
          const schemaParam = findCriteriaInSchema(criteria, schema);
          validity.push(!!schemaParam);
          if (schemaParam) {
            // validate against found criteria
            const criteriaValidity: boolean = checkCriteriaValidity(
              criteria,
              schemaParam
            );
            validity.push(criteriaValidity);
            if (criteriaValidity) {
              // fill missing data
              criteria.id = uuid();
              criteria.required = schemaParam.required;
              criteria.value = sanitizeParameterValue(
                criteria.value,
                criteria.type
              );
            }
          }
        }
      });
    }
  }
}

export function checkFileIntegrityJSON(filters: string): Promise<any> {
  let plain: RawData = {};
  const invalidJson = {
    filters: [],
    valid: false
  };
  if (filters) {
    try {
      plain = JSON.parse(filters) as RawData;
      if (plain.filters) {
        return checkFileIntegrity(plain.filters as Array<ILibraryFilter>);
      } else {
        return Promise.resolve(invalidJson);
      }
    } catch (error) {
      return Promise.resolve(invalidJson);
    }
  }
  return Promise.resolve(invalidJson);
}

export async function checkFileIntegrity(filters: Array<ILibraryFilter>) {
  return getAllTypeClasses().then((types: any) => {
    return checkFileIntegritySync(filters, types);
  });
}

function checkPathIntegrity(
  filters: Array<ILibraryFilter>,
  filterLibrary: Array<IFilterGroup>
) {
  let library: Array<IFilterGroup> = filterLibrary;
  let newFilters: Array<ILibraryFilter> = [];
  let validity: Array<boolean> = [];
  filters.forEach((filter: ILibraryFilter) => {
    let newFilter = { ...filter };
    // check filter integrity
    const matchClass: boolean = checkFilterClassStructure(newFilter);
    validity.push(matchClass);
    // if it's valid try to validate internal integrity
    if (matchClass) {
      if (filter.filterType === FilterType.CARD) {
        checkSimpleFilterIntegrity(newFilter, validity, library);
      } else if (filter.filterType === FilterType.GROUP) {
        newFilter.originalTitle = filter.displayName;
        newFilter.tempTitleEdit = filter.displayName;
        fillMissingFilterFields(newFilter);
        const subValidation = checkPathIntegrity(newFilter.filters, library);

        newFilter.filters = subValidation.filters;
      }
      newFilters.push(newFilter);
    }
  });
  return {
    filters: newFilters,
    validity: validity
  };
}

export function checkFileIntegritySync(
  fil: Array<ILibraryFilter>,
  filterLibrary: Array<IFilterGroup>
) {
  const { filters, validity } = checkPathIntegrity(fil, filterLibrary);
  // everything went well json is valid and data is provided
  return Promise.resolve({
    filters,
    valid: validity.every((val: boolean) => val === true)
  });
}

function findFilterInLibrary(
  className: string,
  nodeLabel: string,
  library: Array<IFilterGroup>
) {
  const group = library.find((group: IFilterGroup) => {
    return group.groupName === className;
  });
  return (
    group &&
    group.filters.find((filter: ILibraryFilter) => {
      return filter.className === className && filter.nodeLabel === nodeLabel;
    })
  );
}

function fillMissingFilterFields(
  filter: ILibraryFilter,
  libraryFilter?: ILibraryFilter
) {
  filter.id = uuid();
  filter.isOpen = true;
  filter.hover = false;
  if (filter.filterType === FilterType.CARD && libraryFilter) {
    filter.description = libraryFilter.description;
    filter.displayName = libraryFilter.displayName;
    filter.fields = libraryFilter.fields;
  }
}

function checkFilterValidity(
  filter: ILibraryFilter,
  libraryFilter: ILibraryFilter
) {
  return (
    filter.className === libraryFilter.className &&
    filter.nodeLabel === libraryFilter.nodeLabel &&
    filter.filterType === libraryFilter.filterType &&
    filterOptions.some(conn => conn.value === filter.nodeConnector)
  );
}

function findCriteriaInSchema(criteria: IFilterCriteria, schema: Schema) {
  return schema.params.find((param: Parameter) => {
    return criteria.name === param.name;
  });
}

function checkCriteriaValidity(
  criteria: IFilterCriteria,
  parameter: Parameter
) {
  return (
    criteria.name === parameter.name &&
    criteria.type === parameter.type &&
    parameterOptions.some(crit => crit.value === criteria.connector) &&
    checkCriteriaOperator(criteria)
  );
}

function checkCriteriaOperator(criteria: IFilterCriteria) {
  switch (criteria.type) {
    case FilterCriteriaType.INTEGER:
      return !!integerOperatorOptions.find(
        (opt: any) => opt.value === criteria.operator
      );
    case FilterCriteriaType.FLOAT:
      return !!floatOperatorOptions.find(
        (opt: any) => opt.value === criteria.operator
      );
    case FilterCriteriaType.STRING:
      return !!stringOperatorOptions.find(
        (opt: any) => opt.value === criteria.operator
      );
    default:
      return false;
  }
}

export function getFilterSchema(fields?: Array<Field>) {
  let schema: Schema = {
    params: [DefaultIntegerParameter]
  };
  let isMultiple = false;
  if (fields) {
    schema.params = [];
    isMultiple = fields.length > 1;

    fields.forEach((field: Field) => {
      let newParam: any = {
        type: field.field_type,
        ...field
      };
      let param: Parameter = Object.assign(
        {},
        DefaultIntegerParameter,
        newParam
      );
      let push: boolean = false;
      switch (newParam.type) {
        case FilterCriteriaType.INTEGER:
          param = Object.assign({}, DefaultIntegerParameter, newParam);
          push = true;
          break;
        case FilterCriteriaType.STRING:
          param = Object.assign({}, DefaultStringParameter, newParam);
          push = true;
          break;
        case FilterCriteriaType.FLOAT:
          param = Object.assign({}, DefaultFloatParameter, newParam);
          push = true;
          break;
      }
      if (push) {
        schema.params.push(param);
      }
    });
  }

  return {
    isMultiple: isMultiple,
    schema: schema
  };
}
