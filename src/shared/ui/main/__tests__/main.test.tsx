import React from 'react';
import { shallow } from 'enzyme';
import Main from '../main';

describe('Main component', () => {
  it('should match component snapshot', () => {
    const wrapper = shallow(<Main />);

    expect(wrapper).toMatchSnapshot();
  });
});
