"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// enums
var FilterType;
(function (FilterType) {
    FilterType["CARD"] = "CARD";
    FilterType["GROUP"] = "GROUP";
})(FilterType = exports.FilterType || (exports.FilterType = {}));
var FilterCriteriaType;
(function (FilterCriteriaType) {
    FilterCriteriaType["STRING"] = "string";
    FilterCriteriaType["INTEGER"] = "integer";
    FilterCriteriaType["FLOAT"] = "float";
})(FilterCriteriaType = exports.FilterCriteriaType || (exports.FilterCriteriaType = {}));
var StringOperatorsType;
(function (StringOperatorsType) {
    StringOperatorsType["CONTAINS"] = "contains";
    StringOperatorsType["NOT_CONTAIN"] = "does not contain";
    StringOperatorsType["EXACT_MATCH"] = "exact match";
})(StringOperatorsType = exports.StringOperatorsType || (exports.StringOperatorsType = {}));
var intOperatorsType;
(function (intOperatorsType) {
    intOperatorsType["NOT_NULL"] = "not null";
    intOperatorsType["NULL"] = "null";
    intOperatorsType["DISTINCT"] = "\u2260";
})(intOperatorsType = exports.intOperatorsType || (exports.intOperatorsType = {}));
var KernelStatus;
(function (KernelStatus) {
    KernelStatus["UNKNOWN"] = "unknown";
    KernelStatus["STARTING"] = "starting";
    KernelStatus["RECONNECTING"] = "reconnecting";
    KernelStatus["IDLE"] = "idle";
    KernelStatus["BUSY"] = "busy";
    KernelStatus["RESTARTING"] = "restarting";
    KernelStatus["STOPPED"] = "dead";
    KernelStatus["CONNECTED"] = "connected";
})(KernelStatus = exports.KernelStatus || (exports.KernelStatus = {}));
