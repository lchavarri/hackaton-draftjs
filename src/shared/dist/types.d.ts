export declare enum FilterType {
    CARD = "CARD",
    GROUP = "GROUP"
}
export declare enum FilterCriteriaType {
    STRING = "string",
    INTEGER = "integer",
    FLOAT = "float"
}
export declare enum StringOperatorsType {
    CONTAINS = "contains",
    NOT_CONTAIN = "does not contain",
    EXACT_MATCH = "exact match"
}
export declare enum intOperatorsType {
    NOT_NULL = "not null",
    NULL = "null",
    DISTINCT = "\u2260"
}
export declare enum KernelStatus {
    UNKNOWN = "unknown",
    STARTING = "starting",
    RECONNECTING = "reconnecting",
    IDLE = "idle",
    BUSY = "busy",
    RESTARTING = "restarting",
    STOPPED = "dead",
    CONNECTED = "connected"
}
