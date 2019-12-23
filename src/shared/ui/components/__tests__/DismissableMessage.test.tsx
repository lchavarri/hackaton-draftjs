import React from 'react';
import { shallow, ReactWrapper } from 'enzyme';
import DismissableMessage from '../DismissableMessage';

describe('DismissableMessage component', () => {
  let component: ReactWrapper;
  const onCloseSpy = jest.fn();
  const props = {
    variant: 'negative',
    header: 'This is a header',
    onClose: null
  };
  const getComponent = () => <DismissableMessage {...props} />;
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

  it('should have variant class', () => {
    expect(component.exists(`.negative`)).toBe(true);
  });

  it('should not have variant class if not provided', () => {
    component.setProps({ variant: null });
    component.update();
    expect(component.exists(`.negative`)).toBe(false);
  });

  describe('when click on close', () => {
    beforeEach(() => {
      component = wrap();
      component.find('.icon.close').simulate('click');
    });

    it('should return null at render phase', () => {
      expect(component.getElement()).toBe(null);
    });

    it('should not call onClose if not provided', () => {
      expect(onCloseSpy).not.toHaveBeenCalled();
    });

    it('should call onClose callback if any', () => {
      component = wrap();
      component.setProps({ onClose: onCloseSpy });
      component.update();
      component.find('.icon.close').simulate('click');
      expect(onCloseSpy).toHaveBeenCalled();
    });
  });

  it('should have clamped class by default', () => {
    expect(component.exists('.clamped')).toBe(true);
  });

  it('should toggle clamped class on click', () => {
    component.find('.content').simulate('click');
    expect(component.exists('.clamped')).toBe(false);
    component.find('.content').simulate('click');
    expect(component.exists('.clamped')).toBe(true);
  });

  it('should show header if provided', () => {
    const headerElm = component.find('.header');
    expect(headerElm.getElement()).toBeTruthy();
    expect(headerElm.html()).toContain(props.header);
  });

  it('should not have header if not provided', () => {
    component.setProps({ header: null });
    component.update();
    expect(component.exists('.header')).toBe(false);
  });
});
