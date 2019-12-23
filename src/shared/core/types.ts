// enums
export enum FilterType {
  CARD = 'CARD',
  GROUP = 'GROUP'
}

export enum FilterCriteriaType {
  STRING = 'string',
  INTEGER = 'integer',
  FLOAT = 'float'
}

export enum StringOperatorsType {
  CONTAINS = 'contains',
  NOT_CONTAIN = 'does not contain',
  EXACT_MATCH = 'exact match'
}

export enum intOperatorsType {
  NOT_NULL = 'not null',
  NULL = 'null',
  DISTINCT = '≠'
}

export enum KernelStatus {
  UNKNOWN = 'unknown',
  STARTING = 'starting',
  RECONNECTING = 'reconnecting',
  IDLE = 'idle',
  BUSY = 'busy',
  RESTARTING = 'restarting',
  STOPPED = 'dead',
  CONNECTED = 'connected'
}
