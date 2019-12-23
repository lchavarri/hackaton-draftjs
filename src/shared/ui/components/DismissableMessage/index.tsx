import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/pro-light-svg-icons';

import './DismissableMessage.scss';

export default function DismissableMessage(props: any) {
  const [visible, setVisible] = useState(true);
  const [clamped, setClamped] = useState(true);
  const { children, header, onClose, variant } = props;

  const handleClose = () => {
    setVisible(false);
    if (onClose) {
      onClose();
    }
  };

  if (!visible) {
    return null;
  }

  return (
    <div className={`ui dismissable message ${variant ? variant : ''}`}>
      <i className="icon close" onClick={handleClose}>
        <FontAwesomeIcon icon={faTimes} />
      </i>
      <div className="content" onClick={() => setClamped(!clamped)}>
        {header ? <div className="header">{header}</div> : <></>}
        <p className={clamped ? 'clamped' : ''}>{children}</p>
      </div>
    </div>
  );
}
