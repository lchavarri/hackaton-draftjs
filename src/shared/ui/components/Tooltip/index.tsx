import React, { ReactElement } from 'react';
import { Popup } from 'semantic-ui-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExclamationTriangle,
  faInfoCircle
} from '@fortawesome/pro-light-svg-icons';

type Props = {
  trigger: ReactElement;
  text: string;
  severity: 'info' | 'warning' | 'danger';
  position?:
    | 'top left'
    | 'top right'
    | 'bottom right'
    | 'bottom left'
    | 'right center'
    | 'left center'
    | 'top center'
    | 'bottom center'
    | undefined;
  size?: 'small' | 'mini' | 'tiny' | 'large' | 'huge' | undefined;
};

export default function Tooltip(props: Props) {
  const { trigger, text, severity, position, size } = props;

  return (
    <Popup
      size={size || 'small'}
      wide="very"
      position={position || 'left center'}
      trigger={trigger}
    >
      {getIcon(severity)}
      &nbsp;<b>{getTitle(severity)}</b> {text}
    </Popup>
  );
}

const getTitle = (severity: string) => {
  switch (severity) {
    case 'warning':
      return 'Warning!';
    case 'danger':
      return 'Danger!';
    case 'info':
    default:
      return 'Information';
  }
};

const getIcon = (severity: string) => {
  switch (severity) {
    case 'warning':
      return (
        <FontAwesomeIcon
          color="orange"
          icon={faExclamationTriangle}
          aria-label="Warning"
        />
      );
    case 'danger':
      return (
        <FontAwesomeIcon
          color="red"
          icon={faExclamationTriangle}
          aria-label="Danger!"
        />
      );
    case 'info':
    default:
      return (
        <FontAwesomeIcon
          color="green"
          icon={faInfoCircle}
          aria-label="Information"
        />
      );
  }
};
