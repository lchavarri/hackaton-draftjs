
import React from 'react';
import { connect } from 'react-redux';

type Props = {};

export type LoadingAnimationState = {};

class LoadingAnimation extends React.Component<any, LoadingAnimationState> {
  render() {
    return (
      <div className="flex-center">
        <div className="loading-wrapper">
          <div className="loading fa-spin fa-layers fa-fw">
            <svg height="100" width="100">
              <circle cx="50" cy="50" r="40" />
            </svg>
          </div>
          <div>Loading Results</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: any, ownProps: Props) => {
  return {
    ...ownProps
  };
};

export default connect(
  mapStateToProps,
  {}
)(LoadingAnimation);
