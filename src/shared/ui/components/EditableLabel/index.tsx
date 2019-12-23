import React, { useRef, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faExclamationCircle } from '@fortawesome/pro-light-svg-icons';
import { Popup } from 'semantic-ui-react';

import Spinner from '../Spinner';
import './editableLabel.scss';

export type EditableLabelValidation = {
  valid: boolean;
  message?: string;
  externalValidation?: boolean;
  currentValue?: string;
};

type Props = {
  originalValue: string;
  onChange: Function;
  onValidation: (validation: EditableLabelValidation) => string;
  replaceSpaces?: boolean;
  charCountEnabled?: boolean;
  loading?: boolean;
  inputProps: {
    maxLength?: number;
    pattern?: string;
    placeholder?: string;
  };
  tooltipOnTop: boolean;
  isEditing?: boolean;
};

export default function EditableLabel(props: Props) {
  const {
    originalValue,
    onChange,
    onValidation,
    replaceSpaces,
    charCountEnabled,
    inputProps,
    loading: propsLoading,
    tooltipOnTop,
    isEditing
  } = props;

  const inputRef = useRef<any>(null);
  const [editing, setEditing] = useState(isEditing || false);
  const [loading, setLoading] = useState<boolean | undefined>(false);
  const [error, setError] = useState('');
  const [focused, setFocused] = useState(false);
  const [valueLength, setValueLength] = useState(
    originalValue ? originalValue.length : 0
  );

  useEffect(() => {
    setLoading(propsLoading);
  }, [propsLoading]);

  useEffect(() => {
    if (editing) {
      selectInputValue();
    }
    setFocused(editing);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing]);

  useEffect(() => {
    if (focused && inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  }, [focused]);

  const selectInputValue = () => {
    setCustomValidity({ valid: true });
    inputRef.current.setSelectionRange(0, inputRef.current.value.length);
  };

  const setCustomValidity = (validation: EditableLabelValidation) => {
    if (inputRef && inputRef.current) {
      inputRef.current.setCustomValidity(
        validation.valid ? '' : validation.message
      );
    }
    const validationMessage = onValidation({
      ...validation,
      currentValue: inputRef.current && inputRef.current.value
    });
    setError(validationMessage);
  };

  const enterEdit = (e: any) => {
    setEditing(true);
    e.preventDefault();
  };

  const exitEdit = () => {
    if (inputRef.current.value === originalValue) {
      setEditing(false);
      return;
    }

    if (!inputRef.current.value) {
      inputRef.current.value = originalValue;
      setValueLength(originalValue.length);
      setEditing(false);
      return;
    }

    // invalid pattern
    if (inputRef.current.validity.patternMismatch) {
      return;
    }

    setLoading(true);
    setFocused(false);
    onChange(inputRef.current.value)
      .then(() => {
        setLoading(false);
        setEditing(false);
      })
      .catch((err: any) => {
        const message = err && err.message;
        setCustomValidity({ valid: false, message, externalValidation: true });
        setLoading(false);
        setFocused(true);
      });
  };

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      return exitEdit();
    }
    if (e.key === 'Escape') {
      inputRef.current.value = originalValue;
      setValueLength(originalValue.length);
      setCustomValidity({ valid: true });
      return exitEdit();
    }
  };

  const handleInput = () => {
    setValueLength(inputRef.current.value.length);
    if (replaceSpaces) {
      inputRef.current.value = inputRef.current.value.replace(' ', '_');
    }
    if (inputRef.current.validity.patternMismatch) {
      setCustomValidity({
        valid: false,
        message: 'Pattern mismatch',
        externalValidation: false
      });
    } else {
      setCustomValidity({ valid: true });
    }
  };

  const getIcon = () => {
    if (loading) {
      return (
        <span className="editable-label-icon">
          <Spinner primary />
        </span>
      );
    }
    return (
      <span className="editable-label-icon edit" onClick={enterEdit}>
        <FontAwesomeIcon className={'icon'} icon={faPen} />
      </span>
    );
  };

  const charCount = charCountEnabled ? (
    <span className="char-count">
      {valueLength}/{inputProps.maxLength}
    </span>
  ) : null;

  const getInput = () => {
    const input = (
      <input
        type="text"
        title=""
        ref={inputRef}
        className="editable-label-input material"
        defaultValue={originalValue}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          setFocused(false);
          exitEdit();
        }}
        onFocus={() => setFocused(true)}
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onMouseDown={e => {
          e.stopPropagation();
        }}
        onInput={handleInput}
        disabled={loading}
        {...inputProps}
      />
    );

    const showPopup = error && error.length && focused;

    return (
      <Popup
        className={showPopup ? 'danger' : 'hidden'}
        hideOnScroll={true}
        size="tiny"
        wide="very"
        position={tooltipOnTop ? 'top center' : 'right center'}
        trigger={input}
        open={true}
        popperDependencies={[error, focused]}
      >
        <FontAwesomeIcon
          color="inherit"
          icon={faExclamationCircle}
          aria-label="Danger!"
        />
        &nbsp;{error}
      </Popup>
    );
  };

  return (
    <div className={`editable-label ${editing ? 'edit-mode' : ''} `}>
      {charCount}
      {getInput()}
      <span className="editable-label-text">{originalValue}</span>
      {getIcon()}
    </div>
  );
}
