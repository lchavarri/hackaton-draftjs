import React from 'react';
import { shallow, mount, ReactWrapper } from 'enzyme';
import ToastMessage from '../ToastMessage';

describe('ToastMessage component', () => {
  let component: ReactWrapper;
  let props: any;

  const defaultProps = {};
  const getComponent = () => <ToastMessage {...props} />;
  const wrap = () => shallow(getComponent());
  const wrapDeep = () => mount(getComponent());

  beforeEach(() => {
    props = defaultProps;
    component = wrap();
  });

  it('should match component snapshot', () => {
    expect(component).toMatchSnapshot();
  });
});
