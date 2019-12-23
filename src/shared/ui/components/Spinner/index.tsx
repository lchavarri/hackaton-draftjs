import React from 'react';
import './spinner.scss';

export default function Spinner(props: any) {
  const { primary, size } = props;
  const variantClass = primary ? 'primary' : '';
  const sizeClass = size ? size : 'md';

  return <span className={`spinner ${variantClass} ${sizeClass}`} />;
}
