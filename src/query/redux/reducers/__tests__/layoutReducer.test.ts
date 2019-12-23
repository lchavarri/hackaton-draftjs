import reducer from '../layoutReducer';
import * as types from '../../actionTypes';

describe('Filter Path Reducer', () => {
  const initialState: any = {
    filterPathVisible: true,
    libraryVisible: true,
    savedPatternStageVisible: false,
    loadPatternModalOpened: false,
    pathScroll: false,
    libraryScroll: false,
    resultScroll: false,
    savedPatternScroll: false,
    targetGroup: ''
  };

  it('should handle TOGGLE_FILTER_PATH', () => {
    const testSet = reducer(initialState, {
      type: types.TOGGLE_FILTER_PATH,
      payload: {}
    });

    expect(testSet.filterPathVisible).toEqual(false);
  });

  it('should handle TOGGLE_LIBRARY', () => {
    const testSet = reducer(initialState, {
      type: types.TOGGLE_LIBRARY,
      payload: {}
    });

    expect(testSet.libraryVisible).toEqual(false);
    expect(testSet.savedPatternStageVisible).toEqual(false);
  });

  it('should handle TOGGLE_SAVED', () => {
    const testSet = reducer(initialState, {
      type: types.TOGGLE_SAVED,
      payload: {}
    });

    expect(testSet.savedPatternStageVisible).toEqual(true);
    expect(testSet.libraryVisible).toEqual(false);
  });

  it('should handle TOGGLE_LOAD_PATTERN_OPEN_MODAL', () => {
    const testSet = reducer(initialState, {
      type: types.TOGGLE_LOAD_PATTERN_OPEN_MODAL,
      payload: {}
    });

    expect(testSet.loadPatternModalOpened).toEqual(true);
  });

  it('should handle TOGGLE_SCROLL_EFFECT', () => {
    const testSet = reducer(initialState, {
      type: types.TOGGLE_SCROLL_EFFECT,
      payload: {
        pathScroll: false,
        libraryScroll: true,
        resultScroll: false,
        savedPatternScroll: true
      }
    });

    expect(testSet.pathScroll).toEqual(false);
    expect(testSet.libraryScroll).toEqual(true);
    expect(testSet.resultScroll).toEqual(false);
    expect(testSet.savedPatternScroll).toEqual(true);
  });
});
