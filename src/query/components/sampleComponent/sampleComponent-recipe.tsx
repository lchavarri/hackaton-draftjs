import React from 'react';
import { connect } from 'react-redux';

class Example extends React.Component<any, any> {
  render() {
    return <div>here you template</div>;
  }
}
const mapStateToProps = (state: any, ownProps: any) => {
  return {
    ...ownProps
  };
};

export default connect(
  mapStateToProps,
  {}
)(Example);
