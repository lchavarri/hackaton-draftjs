import { Parameter } from '../layout/layoutTypes';
import { StringOperatorsType } from '../../../shared/core';

export enum IntegerOperators {
  NOT_NULL = 'not null',
  NULL = 'null',
  EQUAL = '=',
  NOT_EQUAL = '≠',
  GREATER_THAN = '>',
  GREATER_THAN_EQUAL = '>=',
  LOWER_THAN = '<',
  LOWER_THAN_EQUAL = '<='
}

export const integerOperatorOptions = [
  {
    key: IntegerOperators.NOT_NULL,
    value: IntegerOperators.NOT_NULL,
    text: IntegerOperators.NOT_NULL
  },
  {
    key: IntegerOperators.NULL,
    value: IntegerOperators.NULL,
    text: IntegerOperators.NULL
  },
  {
    key: IntegerOperators.EQUAL,
    value: IntegerOperators.EQUAL,
    text: IntegerOperators.EQUAL
  },
  {
    key: IntegerOperators.NOT_EQUAL,
    value: IntegerOperators.NOT_EQUAL,
    text: IntegerOperators.NOT_EQUAL
  },
  {
    key: IntegerOperators.GREATER_THAN,
    value: IntegerOperators.GREATER_THAN,
    text: IntegerOperators.GREATER_THAN
  },
  {
    key: IntegerOperators.GREATER_THAN_EQUAL,
    value: IntegerOperators.GREATER_THAN_EQUAL,
    text: IntegerOperators.GREATER_THAN_EQUAL
  },
  {
    key: IntegerOperators.LOWER_THAN,
    value: IntegerOperators.LOWER_THAN,
    text: IntegerOperators.LOWER_THAN
  },
  {
    key: IntegerOperators.LOWER_THAN_EQUAL,
    value: IntegerOperators.LOWER_THAN_EQUAL,
    text: IntegerOperators.LOWER_THAN_EQUAL
  }
];

export const DefaultIntegerParameter: Parameter = {
  id: '',
  name: '',
  type: '',
  required: false,
  operator: IntegerOperators.NOT_NULL,
  value: '',
  connector: 'and'
};

export const stringOperatorOptions = [
  {
    key: StringOperatorsType.CONTAINS,
    value: StringOperatorsType.CONTAINS,
    text: StringOperatorsType.CONTAINS
  },
  {
    key: StringOperatorsType.NOT_CONTAIN,
    value: StringOperatorsType.NOT_CONTAIN,
    text: StringOperatorsType.NOT_CONTAIN
  },
  {
    key: StringOperatorsType.EXACT_MATCH,
    value: StringOperatorsType.EXACT_MATCH,
    text: StringOperatorsType.EXACT_MATCH
  }
];

export const DefaultStringParameter: Parameter = {
  id: '',
  name: '',
  type: '',
  required: false,
  operator: StringOperatorsType.CONTAINS,
  value: '',
  connector: 'and'
};

export enum FloatOperators {
  NOT_NULL = 'not null',
  NULL = 'null',
  EQUAL = '=',
  NOT_EQUAL = '≠',
  GREATER_THAN = '>',
  GREATER_THAN_EQUAL = '>=',
  LOWER_THAN = '<',
  LOWER_THAN_EQUAL = '<='
}

export const floatOperatorOptions = [
  {
    key: IntegerOperators.NOT_NULL,
    value: IntegerOperators.NOT_NULL,
    text: IntegerOperators.NOT_NULL
  },
  {
    key: IntegerOperators.NULL,
    value: IntegerOperators.NULL,
    text: IntegerOperators.NULL
  },
  {
    key: IntegerOperators.EQUAL,
    value: IntegerOperators.EQUAL,
    text: IntegerOperators.EQUAL
  },
  {
    key: IntegerOperators.NOT_EQUAL,
    value: IntegerOperators.NOT_EQUAL,
    text: IntegerOperators.NOT_EQUAL
  },
  {
    key: IntegerOperators.GREATER_THAN,
    value: IntegerOperators.GREATER_THAN,
    text: IntegerOperators.GREATER_THAN
  },
  {
    key: IntegerOperators.GREATER_THAN_EQUAL,
    value: IntegerOperators.GREATER_THAN_EQUAL,
    text: IntegerOperators.GREATER_THAN_EQUAL
  },
  {
    key: IntegerOperators.LOWER_THAN,
    value: IntegerOperators.LOWER_THAN,
    text: IntegerOperators.LOWER_THAN
  },
  {
    key: IntegerOperators.LOWER_THAN_EQUAL,
    value: IntegerOperators.LOWER_THAN_EQUAL,
    text: IntegerOperators.LOWER_THAN_EQUAL
  }
];

export const DefaultFloatParameter: Parameter = {
  id: '',
  name: '',
  type: '',
  required: false,
  operator: IntegerOperators.NOT_NULL,
  value: '',
  connector: 'and'
};
