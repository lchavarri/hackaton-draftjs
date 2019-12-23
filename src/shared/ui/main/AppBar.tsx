import React from 'react';
import { Button } from 'semantic-ui-react';

import useMinMaxHook from '../hooks/useFullscreen';
import './AppBar.scss';

export default function AppBar(props: any) {
  const { fullscreen, setFullscreen } = useMinMaxHook();
  const { appName, children } = props;

  const renderBackButton = () => {
    const label = fullscreen ? 'Back to Notebook' : 'Manage Flow';

    return (
      <Button className="text" onClick={() => setFullscreen(!fullscreen)}>
        {label}
      </Button>
    );
  };
  return (
    <nav className="eidos-appbar">
      <div className="eidos-appbar-name">
        <h3 className="header">{appName}</h3>
        {children}
      </div>
      {renderBackButton()}
    </nav>
  );
}
