import React from 'react';
import { shallow, ReactWrapper } from 'enzyme';
import ServerError from '../ServerError';

describe('ServerError component', () => {
  let component: ReactWrapper;
  const props = {
    error: {
      message: 'Unable to get kernel'
    }
  };
  const getComponent = () => <ServerError {...props} />;
  const wrap = () => shallow(getComponent());

  beforeEach(() => {
    component = wrap();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should match component snapshot', () => {
    expect(component).toMatchSnapshot();
  });

  it('should return null if no error prop was provided', () => {
    component.setProps({ error: null });
    component.update();
    expect(component.getElement()).toBe(null);
  });

  it('should render provided message if message is defined', () => {
    component.setProps({ error: { message: 'Some message' } });
    component.update();
    expect(component.html()).not.toContain('Something went wrong');
    expect(component.html()).toContain('Some message');
  });

  it('should render default message if message is not defined', () => {
    component.setProps({ error: {} });
    component.update();
    expect(component.html()).not.toContain(props.error.message);
    expect(component.html()).toContain('Something went wrong');
  });
});
