import React from 'react';
import { connect } from 'react-redux';

import { List } from 'semantic-ui-react';

import {
  toggleEmptyGroupDeletedOpenModal,
  clearEmptyDeletedGroups
} from '../../../redux/actions';
import EidosModal from '../../../../shared/ui/components/modals/eidosModal';

type LoadPathModalState = {};

class EmptyGroupDeletedModal extends React.Component<any, LoadPathModalState> {
  handleOpen = () => {
    this.toggleEmptyGroupDeleteOpenModal();
  };

  handleClose = () => {
    this.toggleEmptyGroupDeleteOpenModal();
    this.props.clearEmptyDeletedGroups();
  };
  toggleEmptyGroupDeleteOpenModal = () =>
    this.props.toggleEmptyGroupDeletedOpenModal();

  noop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  };

  getRemovedFilters = () => {
    const { removedFilters } = this.props;

    return removedFilters.map((name: string, index: number) => {
      return <List.Item key={index}>{name}</List.Item>;
    });
  };

  render() {
    const { emptyGroupDeletedModalOpened } = this.props;
    return (
      <div onClick={this.noop} onDrag={this.noop}>
        <EidosModal
          modalTitle="Empty Group(s) Deleted"
          subheader=""
          modalOpen={emptyGroupDeletedModalOpened}
          closeOnOutSideClick={false}
          size="tiny"
          actions={[
            {
              text: 'Ok',
              action: () => this.handleClose(),
              position: 'left',
              disabled: false
            }
          ]}
          handleOpen={this.handleOpen}
          handleClose={this.handleClose}
        >
          <h5>We’ve deleted the following empty group(s):</h5>
          <List>{this.getRemovedFilters()}</List>
        </EidosModal>
      </div>
    );
  }
}

const mapStateToProps = (state: any, ownProps: any) => {
  const { filters } = state;

  return {
    ...ownProps,
    removedFilters: filters.removedFilters,
    emptyGroupDeletedModalOpened: filters.emptyGroupDeletedModalOpened
  };
};

export default connect(
  mapStateToProps,
  {
    toggleEmptyGroupDeletedOpenModal,
    clearEmptyDeletedGroups
  }
)(EmptyGroupDeletedModal);
