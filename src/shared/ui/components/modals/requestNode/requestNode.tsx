import React, { useState, useEffect } from 'react';
import { TextArea, Form, Dropdown } from 'semantic-ui-react';
import * as _ from 'lodash';

import EidosModal from '../eidosModal';
import appNames from '../../../appNames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/pro-solid-svg-icons';
import RequestNodeSuccess from './requestNodeSuccess';

export default function RequestNode(props: any) {
  const [isOpen, setIsOpen] = useState(props.isOpen);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isSubmissionInProgress, setIsSubmissionInProgress] = useState(false);
  const [requestFor, setRequestFor] = useState(props.appName);
  const [requestDescription, setRequestDescription] = useState('');
  const [options] = useState([
    {
      key: appNames.EIDOS_QUERY,
      text: appNames.EIDOS_QUERY,
      value: _.snakeCase(appNames.EIDOS_QUERY)
    },
    {
      key: appNames.EIDOS_LAB,
      text: appNames.EIDOS_LAB,
      value: _.snakeCase(appNames.EIDOS_LAB)
    }
  ]);

  const { title, handleClose, buttonTitle, handleSubmit } = props;

  useEffect(() => {
    setIsOpen(props.isOpen);
    if (!isOpen && props.isOpen) {
      setRequestDescription('');
    } else {
      setRequestFor(_.snakeCase(props.appName));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.isOpen]);

  return (
    <>
      <RequestNodeSuccess
        isOpen={isSuccessOpen}
        handleClose={() => setIsSuccessOpen(false)}
      />
      <EidosModal
        modalTitle={title || 'SUBMIT A REQUEST'}
        closeOnOutSideClick={false}
        size="tiny"
        actions={[
          {
            text: buttonTitle || 'Send Request',
            action: () => {
              // send data and upon success
              setIsSubmissionInProgress(true);
              handleSubmit({
                description: requestDescription,
                appName: _.startCase(requestFor)
              }).then(() => {
                setIsSuccessOpen(true);
                setIsSubmissionInProgress(false);
                // TODO: manage error
              });
            },
            position: 'left',
            disabled: !requestDescription.length || isSubmissionInProgress
          },
          {
            text: 'Cancel',
            action: handleClose,
            position: 'left',
            disabled: false,
            type: 'text'
          }
        ]}
        modalOpen={isOpen}
        handleClose={handleClose}
      >
        <div className="ui form request-node-modal">
          <h5>
            Send us a note to request a new class in the ontology. This will
            allow you to use it in {appNames.EIDOS_QUERY} and{' '}
            {appNames.EIDOS_LAB}.
          </h5>
          <Form.Field>
            <Dropdown
              icon={
                <i className="dropdown icon">
                  <FontAwesomeIcon icon={faCaretDown} className="fa-lg" />
                </i>
              }
              id="requestNodeSelectedApp"
              options={options}
              value={requestFor}
              placeholder="I need it for the application..."
              onChange={(e, { value }) => setRequestFor(value)}
              compact
              selection
            />
          </Form.Field>
          <Form.Field>
            <TextArea
              id="requestNodeDescription"
              placeholder="Tell us more about the pattern you're looking for?"
              onChange={(e, data: any) => setRequestDescription(data.value)}
              maxLength={200}
              value={requestDescription}
            />
            <span className="char-count">
              {requestDescription ? requestDescription.length : 0}/200
            </span>
          </Form.Field>
        </div>
      </EidosModal>
    </>
  );
}
