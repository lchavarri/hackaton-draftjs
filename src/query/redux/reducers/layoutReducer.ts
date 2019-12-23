import {
  TOGGLE_FILTER_PATH,
  TOGGLE_LIBRARY,
  TOGGLE_SAVED,
  TOGGLE_LOAD_PATTERN_OPEN_MODAL,
  TOGGLE_SCROLL_EFFECT,
  SET_SPLIT_POSITION,
  SET_SERVER_ERROR,
  CLEAR_SERVER_ERROR,
  CLEAR_TOAST_OPEN,
  DISPLAY_TOAST,
  SET_DOCUMENT_ID
} from '../actionTypes';
import { IServerError } from '../../../shared/core';
import { ToastType } from '../../../shared/ui/components/ToastMessage';

export type layoutState = {
  filterPathVisible: boolean;
  libraryVisible: boolean;
  savedPatternStageVisible: boolean;
  loadPatternModalOpened: boolean;
  pathScroll?: boolean;
  libraryScroll?: boolean;
  resultScroll?: boolean;
  savedPatternScroll?: boolean;
  targetGroup: string;
  splitPosition: number;
  serverError: IServerError | null;
  toastVisible: boolean;
  toastMessage: string;
  toastType: ToastType;
  documentId: string;
};

const initialState: layoutState = {
  filterPathVisible: true,
  libraryVisible: true,
  savedPatternStageVisible: false,
  loadPatternModalOpened: false,
  pathScroll: false,
  libraryScroll: false,
  resultScroll: false,
  savedPatternScroll: false,
  targetGroup: '',
  splitPosition: 0,
  serverError: null,
  toastVisible: false,
  toastMessage: '',
  toastType: ToastType.TIMED_TOAST,
  documentId: ''
};

export default function(state = initialState, action: any) {
  switch (action.type) {
    case TOGGLE_FILTER_PATH: {
      return {
        ...state,
        filterPathVisible: !state.filterPathVisible
      };
    }
    case TOGGLE_LIBRARY: {
      return {
        ...state,
        savedPatternStageVisible: false,
        libraryVisible: !state.libraryVisible
      };
    }

    case TOGGLE_SAVED: {
      return {
        ...state,
        savedPatternStageVisible: !state.savedPatternStageVisible,
        libraryVisible: false
      };
    }

    case TOGGLE_LOAD_PATTERN_OPEN_MODAL: {
      return {
        ...state,
        loadPatternModalOpened: !state.loadPatternModalOpened
      };
    }

    case TOGGLE_SCROLL_EFFECT: {
      const {
        pathScroll,
        libraryScroll,
        resultScroll,
        savedPatternScroll
      } = action.payload;

      return {
        ...state,
        pathScroll: pathScroll === undefined ? state.pathScroll : pathScroll,
        libraryScroll:
          libraryScroll === undefined ? state.libraryScroll : libraryScroll,
        resultScroll:
          resultScroll === undefined ? state.resultScroll : resultScroll,
        savedPatternScroll:
          savedPatternScroll === undefined
            ? state.savedPatternScroll
            : savedPatternScroll
      };
    }

    case SET_SPLIT_POSITION: {
      const { splitPosition } = action.payload;

      return {
        ...state,
        splitPosition: splitPosition
      };
    }

    case SET_SERVER_ERROR: {
      const code = (action.payload && action.payload.code) || 500;
      const message =
        (action.payload && action.payload.message) || 'Something went wrong';
      return {
        ...state,
        serverError: {
          timestamp: new Date().getTime(),
          code,
          message
        }
      };
    }

    case CLEAR_SERVER_ERROR: {
      return {
        ...state,
        serverError: null
      };
    }

    case CLEAR_TOAST_OPEN: {
      return {
        ...state,
        toastVisible: false
      };
    }

    case DISPLAY_TOAST: {
      const { message, type } = action.payload;
      return {
        ...state,
        toastVisible: true,
        toastMessage: message,
        toastType: type
      };
    }

    case SET_DOCUMENT_ID: {
      return {
        ...state,
        documentId: action.payload
      };
    }

    default:
      return state;
  }
}
