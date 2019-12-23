import React from 'react';
import { connect } from 'react-redux';

import {
  FilterCriteriaType,
  IFilterCriteria,
  ILibraryFilter
} from '../layout/layoutTypes';
import FloatParameter from './float/floatParameter';
import IntegerParameter from './integer/integerParameter';
import StringParameter from './string/stringParameter';

type FilterParametersProps = {
  card: ILibraryFilter;
  length?: number;
};

type FilterParametersState = {};

class FilterParameters extends React.Component<
  FilterParametersProps,
  FilterParametersState
> {
  render() {
    const { card, length } = this.props;
    return (
      <div className="parameters-wrapper">
        {card.filterCriteria.map((criteria: IFilterCriteria, index: number) => {
          switch (criteria.type) {
            case FilterCriteriaType.INTEGER:
              return (
                <IntegerParameter
                  param={criteria}
                  key={criteria.id}
                  index={index}
                  length={length}
                />
              );
            case FilterCriteriaType.STRING:
              return (
                <StringParameter
                  param={criteria}
                  key={criteria.id}
                  index={index}
                  length={length}
                />
              );
            case FilterCriteriaType.FLOAT:
              return (
                <FloatParameter
                  param={criteria}
                  key={criteria.id}
                  index={index}
                  length={length}
                />
              );
          }
          return <></>;
        })}
      </div>
    );
  }
}

const mapStateToProps = (state: any, ownProps: FilterParametersProps) => {
  return {
    ...ownProps,
    length: ownProps.card.filterCriteria.length
  };
};

export default connect(
  mapStateToProps,
  {}
)(FilterParameters);
