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
import {
  integerOperatorOptions,
  IntegerOperators
} from '../filterCriteriaTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle, faAngleDown } from '@fortawesome/pro-light-svg-icons';

type IntegerParameterProps = {
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

type IntegerParameterState = {};

class IntegerParameter extends React.Component<
  IntegerParameterProps,
  IntegerParameterState
> {
  changeParameterConnector = (event: any, data: any) => {
    this.props.changeParamConnector(this.props.param, data.value);
  };

  changeParamOperator = (param: Parameter, value: string) =>
    this.props.changeParamOperator(param, value);
  changeParamValue = (param: Parameter, value: string) =>
    this.props.changeParamValue(param, value);
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
            placeholder={IntegerOperators.NOT_NULL}
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
            options={integerOperatorOptions}
          />
          {param.operator === IntegerOperators.NOT_NULL ||
          param.operator === IntegerOperators.NULL ? (
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
)(IntegerParameter);
