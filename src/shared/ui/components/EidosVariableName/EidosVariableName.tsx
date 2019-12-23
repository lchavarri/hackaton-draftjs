import React, { useState, useEffect } from 'react';

import EditableLabel, { EditableLabelValidation } from '../EditableLabel';
import './EidosVariableName.scss';

type VariableNameProps = {
  variableName: string;
  isPending: boolean;
  isSplashPage: boolean;
  onChange: (newName: string) => Promise<any>;
  onValidation: (isValid: boolean) => void;
};

export default function EidosVariableName(props: VariableNameProps) {
  const {
    variableName,
    isPending,
    isSplashPage,
    onChange,
    onValidation
  } = props;

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!isPending && !mounted) {
      setMounted(true);
      onValidation(true);
    }
    // eslint-disable-next-line
  }, [isPending, mounted]);

  const handleValidation = (validation: EditableLabelValidation): string => {
    const {
      valid,
      externalValidation,
      message,
      currentValue = ''
    } = validation;

    onValidation(valid);

    if (valid) {
      return '';
    } else if (externalValidation) {
      return message || 'Something went wrong. Try again.';
    } else {
      const validationMessage = /^\d+.*/.test(currentValue)
        ? letterError
        : specialCharError;
      return validationMessage;
    }
  };

  const letterError = "Sorry, names can't start with a number.";
  const specialCharError =
    "Sorry, names can't contain special characters (e.g. $, #, @).";

  const inputProps = {
    pattern: '^[^\\d\\W]\\w*$',
    placeholder: 'Type a name and hit enter to save'
  };

  return (
    <span className="variable-name">
      <EditableLabel
        originalValue={variableName}
        onChange={onChange}
        onValidation={handleValidation}
        replaceSpaces={true}
        inputProps={inputProps}
        loading={isPending}
        tooltipOnTop={isSplashPage}
      />
    </span>
  );
}
