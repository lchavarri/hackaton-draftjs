import { combineReducers } from 'redux';

import filterPathReducer from './filterPathReducer';
import layoutReducer from './layoutReducer';
import loadPathReducer from './loadPathReducer';
import savedPatternsReducer from './savedPatternsReducer';
import jupyterReducer from './jupyterReducer';

export default combineReducers({
  filters: filterPathReducer,
  layout: layoutReducer,
  loadPath: loadPathReducer,
  savedPatterns: savedPatternsReducer,
  jupyter: jupyterReducer
});
