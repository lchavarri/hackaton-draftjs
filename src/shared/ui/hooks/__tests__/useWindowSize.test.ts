import { act } from 'react-dom/test-utils';

import { testHook } from '../../__mocks__/testHook';
import useWindowSize from '../useWindowSize';

describe('UseWindowSize hook', () => {
  let size: any;

  beforeEach(() => {
    testHook(() => {
      size = useWindowSize();
    });
  });

  it('should return the default window size on mount', () => {
    expect(size).toBeTruthy();
    expect(size.width).toEqual(1024);
    expect(size.height).toEqual(768);
  });

  describe('upon resize event', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 800
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 600
      });

      act(() => {
        window.dispatchEvent(new Event('resize'));
      });
    });

    it('should return the updated size', () => {
      expect(size).toBeTruthy();
      expect(size.width).toEqual(800);
      expect(size.height).toEqual(600);
    });
  });
});
