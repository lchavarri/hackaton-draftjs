import React, { useState } from 'react';

import appNames from '../../../appNames';
import './requestNode.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronCircleRight } from '@fortawesome/pro-solid-svg-icons';

import RequestNode from './requestNode';

export default function RequestNodeTrigger(props: any) {
  const [isOpen, setIsOpen] = useState(false);

  function getContextualQuery() {
    if (props.appName === appNames.EIDOS_LAB)
      return <span>Can’t find a Node?</span>;
    return <span>Can't find a Pattern?</span>;
  }

  function getContextualRequestLabel() {
    if (props.appName === appNames.EIDOS_LAB) return <>SUBMIT A REQUEST</>;
    return <>SUBMIT A REQUEST</>;
  }

  return (
    <>
      <RequestNode
        isOpen={isOpen}
        appName={props.appName}
        handleSubmit={(args: any) => {
          return props.sendRequest(args).then(
            () => {
              setIsOpen(false);
              return Promise.resolve();
            },
            (err: any) => {
              // TODO: handle error
              return Promise.reject();
            }
          );
        }}
        handleClose={() => setIsOpen(false)}
      />
      <div className="footer request-node">
        {getContextualQuery()}
        <button
          className="ui button text icon right active"
          onClick={() => setIsOpen(true)}
        >
          {getContextualRequestLabel()}
          <FontAwesomeIcon icon={faChevronCircleRight} />
        </button>
      </div>
    </>
  );
}
