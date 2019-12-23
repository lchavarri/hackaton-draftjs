import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faBars } from '@fortawesome/pro-light-svg-icons';

import './LibraryPanel.scss';

export default function LibraryPanel(props: any) {
  const [libraryCollapsed, setLibraryCollapsed] = useState(false);
  const title = props.title || 'Close Library Panel';
  const collapsedClass = libraryCollapsed ? 'collapsed' : '';

  const actionButton = libraryCollapsed ? (
    <button
      className="eidos-library-toggle ui button"
      onClick={() => setLibraryCollapsed(false)}
    >
      <FontAwesomeIcon icon={faBars} className="icon" aria-hidden="true" />
    </button>
  ) : (
    <button
      className="eidos-library-toggle ui button text"
      onClick={() => setLibraryCollapsed(true)}
    >
      <FontAwesomeIcon icon={faTimes} className="icon" aria-hidden="true" />{' '}
      {title}
    </button>
  );

  return (
    <>
      {actionButton}
      <aside className={`eidos-library ${collapsedClass}`}>
        {props.children}
      </aside>
    </>
  );
}
