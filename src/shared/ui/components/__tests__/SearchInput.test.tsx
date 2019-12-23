import React from 'react';
import { shallow, mount, ReactWrapper } from 'enzyme';
import SearchInput from '../SearchInput/SearchInput';

describe('SearchInput component', () => {
  let component: ReactWrapper;
  let props: any;
  const searchCallback = jest.fn();

  const defaultProps = {
    inputId: 'test',
    searchCallback,
    searchTerm: 'Init'
  };
  const getComponent = () => <SearchInput {...props} />;
  const wrap = () => shallow(getComponent());
  const wrapDeep = () => mount(getComponent());

  beforeEach(() => {
    jest.restoreAllMocks();
    props = defaultProps;
    component = wrap();
  });

  it('should match component snapshot', () => {
    expect(component).toMatchSnapshot();
  });

  it('should have the initial searchTerm setted', () => {
    props = { ...defaultProps, searchTerm: '123' };
    component = wrapDeep();

    const inputValue: string | number | string[] = component
      .find('input#testTerm')
      .prop('value');

    expect(inputValue).toEqual('123');
  });

  it('should not call searchCallback on initial load', () => {
    props = { ...defaultProps, searchTerm: '456' };
    component = wrapDeep();

    const inputValue: string | number | string[] = component
      .find('input#testTerm')
      .prop('value');

    expect(inputValue).toEqual('456');
    expect(searchCallback).not.toHaveBeenCalled();
  });

  it('should render the clear button is input has value', () => {
    component = wrapDeep();

    expect(component.exists('button#testResetInput')).toBe(true);
  });

  it('should not render the clear button is input is empty', () => {
    props = { ...defaultProps, searchTerm: '' };
    component = wrapDeep();

    expect(component.exists('button#testResetInput')).toBe(false);
  });

  describe('on input', () => {
    let input: ReactWrapper;
    beforeEach(() => {
      jest.restoreAllMocks();
      component = wrapDeep();
      input = component.find('input#testTerm');
      input.simulate('change', { target: { value: 'update' } });
    });

    it('should call searchCallback with the new value', () => {
      expect(searchCallback).toHaveBeenCalledWith('update');
    });
  });

  describe('on click clear', () => {
    beforeEach(() => {
      jest.restoreAllMocks();
      component = wrapDeep();
      component.find('button#testResetInput').simulate('click');
    });

    it('should delete previous input', () => {
      const inputValue: string | number | string[] = component
        .find('input#testTerm')
        .prop('value');

      expect(inputValue).toEqual('');
    });

    it('should call searchCallback with the empty string', () => {
      expect(searchCallback).toHaveBeenCalledWith('');
    });
  });
});
