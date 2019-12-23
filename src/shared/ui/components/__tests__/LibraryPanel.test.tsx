import React from 'react';
import { shallow, mount, ReactWrapper } from 'enzyme';
import LibraryPanel from '../LibraryPanel/LibraryPanel';

describe('LibraryPanel component', () => {
  let component: ReactWrapper;
  let props: any;

  const defaultProps = {};
  const getComponent = () => <LibraryPanel {...props} />;
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
