import {
  TOGGLE_FILTER_PATH,
  TOGGLE_LIBRARY,
  TOGGLE_SAVED,
  TOGGLE_LOAD_PATTERN_OPEN_MODAL,
  TOGGLE_SCROLL_EFFECT,
  TOGGLE_EMPTY_GROUP_DELETED_OPEN_MODAL,
  SET_SPLIT_POSITION,
  SET_SERVER_ERROR,
  CLEAR_SERVER_ERROR,
  DISPLAY_TOAST,
  CLEAR_TOAST_OPEN,
  SET_DOCUMENT_ID
} from '../actionTypes';
import { IServerError } from '../../../shared/core/interfaces';
import { ToastType } from '../../../shared/ui/components/ToastMessage';

export const toggleFilterPath = () => ({
  type: TOGGLE_FILTER_PATH,
  payload: {}
});

export const toggleLibrary = () => ({
  type: TOGGLE_LIBRARY,
  payload: {}
});

export const toggleSaved = () => ({
  type: TOGGLE_SAVED,
  payload: {}
});

export const toggleEmptyGroupDeletedOpenModal = (targetGroup: string) => ({
  type: TOGGLE_EMPTY_GROUP_DELETED_OPEN_MODAL,
  payload: {
    targetGroup
  }
});

export const toggleLoadPatternOpenModal = () => ({
  type: TOGGLE_LOAD_PATTERN_OPEN_MODAL,
  payload: {}
});

export const toggleScrollEffect = (
  pathScroll?: boolean,
  libraryScroll?: boolean,
  resultScroll?: boolean,
  savedPatternScroll?: boolean
) => ({
  type: TOGGLE_SCROLL_EFFECT,
  payload: {
    pathScroll,
    libraryScroll,
    resultScroll,
    savedPatternScroll
  }
});

export const setSplitPosition = (splitPosition: number) => ({
  type: SET_SPLIT_POSITION,
  payload: { splitPosition }
});

export const setServerError = (error: IServerError) => ({
  type: SET_SERVER_ERROR,
  payload: error
});

export const clearServerError = () => ({
  type: CLEAR_SERVER_ERROR
});

export const displayTimmedToast = (message: string) => ({
  type: DISPLAY_TOAST,
  payload: {
    type: ToastType.TIMED_TOAST,
    message
  }
});

export const displayDismissableToast = (message: string) => ({
  type: DISPLAY_TOAST,
  payload: {
    type: ToastType.DISMISSABLE_TOAST,
    message
  }
});

export const clearToastOpen = () => ({
  type: CLEAR_TOAST_OPEN,
  payload: {}
});

export const setDocumentId = (documentId: string) => ({
  type: SET_DOCUMENT_ID,
  payload: documentId
});
