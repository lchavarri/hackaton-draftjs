import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimesCircle } from '@fortawesome/pro-light-svg-icons';
import { Input, Button } from 'semantic-ui-react';

import './SearchInput.scss';

type Props = {
  searchCallback: (term: string) => void;
  cancelCallback?: () => void;
  searchTerm: string;
  inputId: string;
  placeholder?: string;
  onBlur?: Function;
  isFocused?: boolean;
  onReset?: Function;
};

export default function SearchInput(props: Props) {
  const {
    searchCallback,
    cancelCallback = () => {},
    searchTerm,
    inputId,
    placeholder,
    onBlur = () => {},
    isFocused,
    onReset
  } = props;
  const input = useRef<any>(null);
  const [inputValue, setInputValue] = useState(searchTerm || '');

  useEffect(() => {
    if (inputValue !== searchTerm) {
      searchCallback(inputValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  useEffect(() => {
    if (inputValue !== searchTerm) {
      setInputValue(searchTerm);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  useEffect(() => {
    if (isFocused && input && input.current) {
      input.current.focus();
    }
  }, [isFocused, input]);

  const onInputChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(ev.target.value);
  };

  const onKeyDown = (ev: KeyboardEvent) => {
    if (ev.key === 'Escape' && cancelCallback) {
      cancelCallback();
    }
  };

  const resetInput = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setInputValue('');
    if (input && input.current) {
      input.current.focus();
    }

    // Callback for parent component
    if (onReset) {
      onReset();
    }
  };

  const renderButton = () => {
    if (!inputValue || !inputValue.length) return null;

    return (
      <Button
        icon
        floated="right"
        onClick={resetInput}
        id={inputId + 'ResetInput'}
      >
        <FontAwesomeIcon
          icon={faTimesCircle}
          aria-label="Delete Criteria"
          className="icon"
        />
      </Button>
    );
  };

  return (
    <Input
      iconPosition="left"
      className="search clear"
      placeholder={placeholder || 'Search'}
      onChange={onInputChange}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      value={inputValue || ''}
      id={inputId + 'Term'}
      ref={input}
    >
      <i className="icon">
        <FontAwesomeIcon icon={faSearch} />
      </i>
      <input />
      {renderButton()}
    </Input>
  );
}
