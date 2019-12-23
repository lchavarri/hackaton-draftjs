import React, { useContext } from 'react';
import { Button, Header, Modal } from 'semantic-ui-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/pro-solid-svg-icons';

import { Context as AppContext } from '../../main/main';

export interface ModalAction {
  text: string;
  type?: string;
  action: any;
  position: 'left' | 'right';
  disabled: boolean;
}

type EidosModalProps = {
  header?: any;
  content?: any;
  children: any;
  actions: Array<ModalAction>;
  modalTitle?: string;
  subheader?: string;
  closeOnEscape?: boolean;
  closeOnOutSideClick?: boolean;
  handleClose?: any;
  handleOpen?: any;
  modalOpen?: boolean;
  size?: 'small' | 'mini' | 'tiny' | 'large' | 'fullscreen' | undefined;
};

export default function EidosModal(props: EidosModalProps) {
  const {
    closeOnEscape,
    closeOnOutSideClick,
    modalOpen,
    actions,
    children,
    modalTitle,
    subheader,
    size
  } = props;

  const { appContainerRef } = useContext(AppContext);

  const open = () => {
    if (props.handleOpen) {
      props.handleOpen();
    }
  };

  const close = () => {
    if (props.handleClose) {
      props.handleClose();
    }
  };

  return (
    <Modal
      centered={true}
      mountNode={appContainerRef && appContainerRef.current}
      open={modalOpen}
      onOpen={() => open()}
      onClose={() => close()}
      closeOnEscape={closeOnEscape}
      closeOnDimmerClick={closeOnOutSideClick}
      size={size}
    >
      <button
        id="closeModal"
        onClick={() => close()}
        className="ui button text icon close"
      >
        <FontAwesomeIcon icon={faTimes} className="fas fa-times" />
      </button>
      <Header content={modalTitle} subheader={subheader} />
      <Modal.Content>{children}</Modal.Content>
      <Modal.Actions>
        {actions.map((button: ModalAction, index: number) => {
          return (
            <Button
              id={'modalButton' + index}
              className={button.type ? button.type : 'primary basic'}
              compact
              floated={button.position}
              onClick={button.action}
              disabled={button.disabled}
              key={index}
            >
              {button.text}
            </Button>
          );
        })}
      </Modal.Actions>
    </Modal>
  );
}
