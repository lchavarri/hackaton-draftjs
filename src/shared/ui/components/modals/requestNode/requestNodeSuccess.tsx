import React, { useState, useEffect } from 'react';

import EidosModal from '../eidosModal';

export default function RequestNodeSuccess(props: any) {
  const [isOpen, setIsOpen] = useState(props.isOpen);

  const { title, handleClose } = props;

  useEffect(() => {
    setIsOpen(props.isOpen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.isOpen]);

  return (
    <EidosModal
      modalTitle={title || 'THANK YOU'}
      closeOnOutSideClick={false}
      size="tiny"
      actions={[]}
      modalOpen={isOpen}
      handleClose={handleClose}
    >
      <div className="ui form request-node-modal">
        <h5>
          Your request for the addition(s) to the ontology has been successfully
          submitted.
        </h5>
      </div>
    </EidosModal>
  );
}
