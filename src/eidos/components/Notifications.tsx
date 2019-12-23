import React from 'react';
import { getKernelStatus, getErrorsArray } from '../redux/selectors';
import { KernelStatus } from '../../shared/ui/services/jupyterService';
import DismissableMessage from '../../shared/ui/components/DismissableMessage';

export default function Notifications(props: any) {
  const { state } = props;
  const status = getKernelStatus(state);
  const errors = getErrorsArray(state);

  const renderInfo = () => {
    if (status === KernelStatus.STOPPED) {
      return (
        <DismissableMessage key={KernelStatus.STOPPED}>
          Start the Session Manager to connect your Eidos Live Apps.
        </DismissableMessage>
      );
    }
  };

  const renderErrors = () => {
    return errors.map(([errorKey, errorMessage]) => (
      <DismissableMessage key={errorKey} variant="negative">
        {errorMessage}
      </DismissableMessage>
    ));
  };

  return (
    <div className="session-manager-notifications">
      {renderInfo()}
      {renderErrors()}
    </div>
  );
}
