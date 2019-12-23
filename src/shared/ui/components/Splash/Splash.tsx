import React from 'react';

import './Splash.scss';

export default function Splash(props: any) {
  const { title, subtitle, children } = props;

  return (
    <div className="splash">
      <h3 className="splash-title">{title}</h3>
      <p className="splash-subtitle">{subtitle}</p>
      <div className="splash-body">{children}</div>
    </div>
  );
}
