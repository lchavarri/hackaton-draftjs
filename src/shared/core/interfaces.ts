import { FilterType, FilterCriteriaType, KernelStatus } from './types';

// interfaces
export interface IFilterDto {
  nodeConnector: string;
  nodeLabel: string;
  className: string;
  filterType: FilterType;
  filterCriteria: Array<IFilterCriteriaDto>;
  filters: Array<IFilterDto>;
}

export interface IFilterCriteriaDto {
  type: FilterCriteriaType;
  name: string;
  operator: string;
  value: string | number | undefined;
  connector: string;
}

export interface IMongoPatternListDto {
  document: string;
  name: string;
  description: string;
  selectedColumns: Array<IColumnDataDto>;
  groupbyColumns: Array<IColumnDataDto>;
  filters: Array<IFilterDto>;
}

export interface IMongoConnection {
  db: any;
  backend: any;
  connection: any;
}

export interface IColumnDataDto {
  id: string;
  value: string;
  className: string;
  displayName: string;
  parameterName: string;
  label: string;
}

export interface IKernelInfo {
  id: string;
  status: KernelStatus;
  serverSettings?: ISettings;
}

export interface ISettings {
  readonly baseUrl: string;
  readonly pageUrl: string;
  readonly wsUrl: string;
  readonly init: RequestInit;
  readonly token: string;
  readonly fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
  readonly Request: typeof Request;
  readonly Headers: typeof Headers;
  readonly WebSocket: typeof WebSocket;
}

export interface IHttpServerConfig {
  ssl: boolean;
  port: number;
  hostname: string;
}

export interface IServerError {
  code: number;
  message: string;
  timestamp?: number;
}
