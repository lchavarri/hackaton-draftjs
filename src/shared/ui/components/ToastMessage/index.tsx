import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/pro-light-svg-icons';

import './ToastMessage.scss';

export enum ToastType {
  TIMED_TOAST = 'TIMED_TOAST',
  DISMISSABLE_TOAST = 'DISMISSABLE_TOAST'
}

enum ToastTypeTime {
  TIMED_TOAST = 2750,
  DISMISSABLE_TOAST = 5000
}

type Props = {
  message: string;
  type: ToastType;
  onClose?: any;
  setVisible?: any;
  visible: boolean;
};

export default function ToastMessage(props: Props) {
  const [displayTimeout, setDisplayTimeout] = useState<any>();
  const [visible, setVisible] = useState(false);
  const { message, type, onClose } = props;

  useEffect(() => {
    if (props.visible) {
      setVisible(true);
      if (props.setVisible) {
        props.setVisible();
      }
      if (displayTimeout) {
        clearTimeout(displayTimeout);
        setDisplayTimeout(null);
      }
      setDisplayTimeout(
        setTimeout(() => {
          setVisible(false);
        }, ToastTypeTime[type])
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.visible]);

  const handleClose = () => {
    setVisible(false);
    if (onClose) {
      onClose();
      if (props.setVisible) {
        props.setVisible();
      }
    }
  };

  const renderClose = () => {
    const { type } = props;
    if (type === ToastType.TIMED_TOAST) return null;

    return (
      <i className="icon close" onClick={handleClose} aria-hidden="true">
        <FontAwesomeIcon icon={faTimes} />
      </i>
    );
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="ui toast message">
      {renderClose()}
      <div className="content">
        <p>{message}</p>
      </div>
    </div>
  );
}
