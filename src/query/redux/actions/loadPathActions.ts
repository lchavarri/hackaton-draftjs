import { UPDATE_LOAD_PATH_MODAL } from '../actionTypes';
import { LoadPathModalState } from '../../components/modals/loadPath/loadPath';

export const updateLoadPathModal = (modalState: LoadPathModalState) => ({
  type: UPDATE_LOAD_PATH_MODAL,
  payload: {
    ...modalState
  }
});
