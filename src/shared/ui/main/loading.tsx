import React from 'react';

import Spinner from '../components/Spinner';
import './loading.scss';

export default function Loading(props: any) {
  const { appName } = props;
  return (
    <div className="loading-app">
      <span className="loading-app-icon">
        <Spinner primary size="fit" />
      </span>
      <span className="loading-app-text">{`Loading ${appName}...`}</span>
    </div>
  );
}
