import { LoadPathModalState } from '../../components/modals/loadPath/loadPath';
import { UPDATE_LOAD_PATH_MODAL } from '../actionTypes';

const initialState: LoadPathModalState = {
  actions: [],
  filters: [],
  warning: false,
  error: false,
  processing: false,
  success: false,
  invalid: false
};

export default function(state = initialState, action: any) {
  switch (action.type) {
    case UPDATE_LOAD_PATH_MODAL: {
      return {
        ...state,
        ...action.payload
      };
    }

    default:
      return state;
  }
}
