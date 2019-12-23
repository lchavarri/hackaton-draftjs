import React from 'react';
import { connect } from 'react-redux';

// Local deps
import Updated from '../../../shared/ui/components/Updated';

function Timestamp(props: any) {
  const { executionEndedAt, executionStartedAt } = props;

  return <Updated startDate={executionStartedAt} endDate={executionEndedAt} />;
}

const mapStateToProps = (state: any) => {
  const { filters } = state;
  const { executionStartedAt, executionEndedAt } = filters;

  return { executionStartedAt, executionEndedAt };
};

export default connect(
  mapStateToProps,
  {}
)(Timestamp);
