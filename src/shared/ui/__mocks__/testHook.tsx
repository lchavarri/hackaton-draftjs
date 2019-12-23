import React from 'react';
import { mount } from 'enzyme';

const TestHook = (props: any) => {
  props.callback();
  return null;
};

export const testHook = (callback: Function) => {
  mount(<TestHook callback={callback} />);
};
