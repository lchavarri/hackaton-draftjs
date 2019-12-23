import React from 'react';
import { shallow, mount, ReactWrapper } from 'enzyme';
import EidosCheckbox from '../eidosCheckbox/EidosCheckbox';

describe('EidosCheckbox component', () => {
  let component: ReactWrapper;
  let props: any;

  const defaultProps = {};
  const getComponent = () => <EidosCheckbox {...props} />;
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
