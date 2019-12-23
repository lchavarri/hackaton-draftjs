import React, { useState } from 'react';

import appNames from '../../../appNames';
import './requestNode.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronCircleRight } from '@fortawesome/pro-solid-svg-icons';

import RequestNode from './requestNode';

export default function RequestNodeMessageTrigger(props: any) {
  const [isOpen, setIsOpen] = useState(false);

  function getContextualQuery() {
    if (props.appName === appNames.EIDOS_LAB) return <p>Can’t find a Node?</p>;
    return <p>Can't find a Pattern?</p>;
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
        handleClose={() => {
          setIsOpen(false);
        }}
      />
      <div className="library-totals">
        <div className="text-overflow-ellipsis">
          {`NO RESULTS FOR ${props.search}`}
        </div>
      </div>
      <div className="ui message centered">
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
