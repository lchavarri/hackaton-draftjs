import React from 'react';
import { shallow, mount, ReactWrapper } from 'enzyme';
import EditableLabel from '../EditableLabel';

describe('EditableLabel component', () => {
  let component: ReactWrapper;
  let props: any;

  const defaultProps = {};
  const getComponent = () => <EditableLabel {...props} />;
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
