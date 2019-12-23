import React from 'react';
import { shallow, mount, ReactWrapper } from 'enzyme';
import Updated from '../Updated';

describe('Updated component', () => {
  let component: ReactWrapper;
  let props: any;

  const defaultProps = {
    startDate: new Date(),
    endDate: new Date()
  };
  const getComponent = () => <Updated {...props} />;
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
