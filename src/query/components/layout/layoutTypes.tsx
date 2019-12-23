export interface Parameter {
  id: string;
  name: string;
  type: string;
  required: boolean;
  operator: string;
  value: string | number;
  connector: string;
}

export interface Field {
  id: string;
  name: string;
  description: string;
  method: string;
  iri: string;
  units: string;
  field_type: string;
}
export interface Schema {
  params: Array<Parameter>;
}

export interface IFilter {
  id: string;
  isOpen: boolean;
  nodeConnector: string;
  nodeLabel: string;
  parsedSchema?: Schema;
  selected: boolean;
  className: string;
  filterType: FilterType;
  filterCriteria: Array<IFilterCriteria>;
  filters: Array<ILibraryFilter>;
}

export enum FilterType {
  CARD = 'CARD',
  GROUP = 'GROUP'
}

export enum FilterCriteriaType {
  STRING = 'str',
  INTEGER = 'int',
  FLOAT = 'float',
  LIST = 'list'
}

export interface IFilterCriteria {
  id: string;
  iri: string;
  method: string;
  type: FilterCriteriaType;
  name: string;
  operator: string;
  value: string | number;
  connector: string;
  required: boolean;
}

export interface IFilterData {
  iri: string;
  id: string;
  className: string;
  nodeLabel: string;
  nodeConnector: string;
  description: string;
  displayName: string;
  selected: boolean;
  hover: boolean;
  fields: Array<Field>;
  filterType: FilterType;
  filterCriteria: Array<IFilterCriteria>;
}

export interface ILibraryFilter extends IFilter {
  iri: string;
  id: string;
  className: string;
  isOpen: boolean;
  scroll?: boolean;
  nodeLabel: string;
  nodeConnector: string;
  description: string;
  displayName: string;
  hover: boolean;
  fields: Array<Field>;
  filterType: FilterType;
  filterCriteria: Array<IFilterCriteria>;
  filters: Array<ILibraryFilter>;
  depth: number;
  paramOpened?: boolean;
  editTitle?: boolean;
  // filter parameters data model
  hasMultipleParameters: boolean;
  filteredParams: Schema;
  parsedSchema: Schema;
  // edit group name params
  originalTitle: string;
  tempTitleEdit: string;
}

export interface IFilterGroup {
  groupName: string;
  filters: Array<ILibraryFilter>;
  count: number;
}

export interface IMinFilterData {
  id: string;
  displayName: string;
  nodeConnector: string;
}

export enum CardType {
  LIBRARY = 'library',
  FILTER = 'filter',
  SAVED = 'saved'
}
