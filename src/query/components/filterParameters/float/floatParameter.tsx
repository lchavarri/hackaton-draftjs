import React from 'react';
import { connect } from 'react-redux';
import { Button, Dropdown, Input } from 'semantic-ui-react';

import {
  changeParamConnector,
  changeParamOperator,
  changeParamValue,
  removeFilterParam
} from '../../../redux/actions';
import BooleanConnector, {
  ConnectorType
} from '../../booleanConnector/booleanConnector';
import { IFilterCriteria, Parameter } from '../../layout/layoutTypes';
import { floatOperatorOptions, FloatOperators } from '../filterCriteriaTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle, faAngleDown } from '@fortawesome/pro-light-svg-icons';

type FloatParameterProps = {
  index: number;
  length: number;
  param: IFilterCriteria;
  paramValue?: string | number | undefined;
  operator: string;
  changeParamOperator?: any;
  changeParamValue?: any;
  changeParamConnector?: any;
  removeFilterParam?: any;
  connector?: any;
};

type FloatParameterState = {};

class FloatParameter extends React.Component<
  FloatParameterProps,
  FloatParameterState
> {
  changeParameterConnector = (event: any, data: any) => {
    this.props.changeParamConnector(this.props.param, data.value);
  };

  changeParamOperator = (param: Parameter, value: string) =>
    this.props.changeParamOperator(param, value);
  changeParamValue = (param: Parameter, value: string) => {
    let chars = value.split('');
    let eIndex = chars.findIndex((e: string) => e === 'e' || e === 'E');
    let opIndex = chars.findIndex((e: string) => e === '+' || e === '-');
    if (eIndex && eIndex > -1 && opIndex && opIndex > -1 && opIndex < eIndex)
      return;
    this.props.changeParamValue(param, value);
  };

  componentWillReceiveProps(nextProps: any) {
    let value = nextProps.paramValue;
    let eCount = String(value).match(/e|E/g);
    let signCount = String(value).match(/\+|-/g);
    let dotCount = String(value).match(/\./g);
    let allValidChars = String(value)
      .split('')
      .every((char: string) => !!char.match(/[0-9+\-eE.]/g));
    let isNegNumber = String(value).split('')[0] === '-';

    // If some of the rules are broken just roll back to prev value
    if (
      (eCount && eCount.length > 1) ||
      (isNegNumber
        ? signCount && signCount.length > 2
        : signCount && signCount.length > 1) ||
      (dotCount && dotCount.length > 1) ||
      !allValidChars
    ) {
      this.props.changeParamValue(this.props.param, this.props.paramValue);
    }
  }

  removeFilterParam = (e: any, param: Parameter) => {
    e.preventDefault();
    this.props.removeFilterParam(param);
  };

  render() {
    const {
      param,
      connector,
      paramValue,
      operator,
      index,
      length
    } = this.props;
    return (
      <div className="filter">
        <Button
          icon
          basic
          simple="true"
          className="xs"
          onClick={e => this.removeFilterParam(e, param)}
        >
          <FontAwesomeIcon icon={faMinusCircle} aria-label="Remove Parameter" />
        </Button>
        <div className="filter-wrapper">
          <span className="filter-label">{param.name}</span>
          <Dropdown
            placeholder={FloatOperators.NOT_NULL}
            search
            selection
            noResultsMessage="No results"
            className="dropdown-sm"
            icon={
              <i className="dropdown icon">
                <FontAwesomeIcon icon={faAngleDown} />
              </i>
            }
            value={operator}
            onChange={(e, data) =>
              this.changeParamOperator(param, data.value as string)
            }
            options={floatOperatorOptions}
          />
          {param.operator === FloatOperators.NOT_NULL ||
          param.operator === FloatOperators.NULL ? (
            ''
          ) : (
            <Input
              type="text"
              className="input-sm"
              value={paramValue}
              onClick={(e: any) => e.preventDefault()}
              onChange={(e, data) => this.changeParamValue(param, data.value)}
            />
          )}
        </div>
        <div className="boolean-connector-wrapper">
          {index === length - 1 ? (
            ''
          ) : (
            <BooleanConnector
              id={param.id}
              value={connector}
              hasConnector={false}
              type={ConnectorType.PARAMETER}
              changeHandler={this.changeParameterConnector}
            />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    ...ownProps,
    paramValue: ownProps.param.value,
    connector: ownProps.param.connector,
    operator: ownProps.param.operator
  };
};

export default connect(
  mapStateToProps,
  {
    changeParamOperator,
    changeParamValue,
    changeParamConnector,
    removeFilterParam
  }
)(FloatParameter);
