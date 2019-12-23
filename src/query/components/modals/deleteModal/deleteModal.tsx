import React from 'react';

import EidosModal, {
  ModalAction
} from '../../../../shared/ui/components/modals/eidosModal';

type LoadPathModalState = {
  actions: Array<ModalAction>;
};

export default class DeleteModal extends React.Component<
  any,
  LoadPathModalState
> {
  actions: Array<object> = [];
  constructor(props: any) {
    super(props);
    this.actions = [
      {
        text: 'Delete Group',
        action: () => this.props.handleDelete(),
        position: 'left',
        type: 'red basic',
        disabled: false
      },
      {
        text: 'Cancel',
        type: 'text',
        action: () => this.props.handleClose(),
        position: 'left',
        disabled: false
      }
    ];
  }

  noop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  };

  render() {
    const { actions, modalOpen, handleClose, content, title } = this.props;
    return (
      <div onClick={this.noop} onDrag={this.noop}>
        <EidosModal
          modalTitle={title}
          subheader=""
          modalOpen={modalOpen}
          closeOnOutSideClick={false}
          size="tiny"
          actions={actions || this.actions}
          handleClose={handleClose}
        >
          {content}
        </EidosModal>
      </div>
    );
  }
}
