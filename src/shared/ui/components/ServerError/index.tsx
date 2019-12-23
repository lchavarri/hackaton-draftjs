import React from 'react';
import DismissableMessage from '../DismissableMessage';

// TODO: Add error message to Eidos Query for Kernel failure message.
export default function ServerError(props: any) {
  const { error } = props;
  if (!error) {
    return null;
  }

  const { message = 'Something went wrong', timestamp } = error;

  return (
    <DismissableMessage variant="negative" key={timestamp}>
      {message}
    </DismissableMessage>
  );
}
