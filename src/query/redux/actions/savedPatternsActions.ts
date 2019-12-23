import { API, graphqlOperation } from 'aws-amplify';

import { listQueryPatterns } from '../../graphql/queries';
import {
  deleteQueryPattern,
  createQueryPattern,
  updateQueryPattern
} from '../../graphql/mutations';
import {
  UPDATE_SAVED_PATTERNS_DATA,
  UPDATE_SAVED_PATTERN_NAME_AVAILABLE,
  SAVED_PATTERN_REQUEST_PENDING,
  SAVED_PATTERN_REQUEST_SUCCESS,
  SAVED_PATTERN_REQUEST_FAILED,
  SAVED_PATTERN_SEARCH_TERM
} from '../actionTypes';
import { SavedPattern } from '../reducers/savedPatternsReducer';
import { ILibraryFilter } from '../../components/layout/layoutTypes';
import { ColumnData } from '../../../shared/ui/components/TagsDnd/tagsDnd';
import { removeEmpty, parseAWSString } from '../../utils/objectUtils';

export interface QueryPattern {
  document: string;
  name: string;
  description: string;
  filters?: Array<ILibraryFilter>;
  selectedColumns?: Array<ColumnData>;
  groupbyColumns?: Array<ColumnData>;
  version?: number;
  createdAt?: string;
  updatedAt?: string;
  initials?: string;
}

export const updateSavedPatternsData = (
  savedPatterns: Array<SavedPattern>
) => ({
  type: UPDATE_SAVED_PATTERNS_DATA,
  payload: {
    savedPatterns
  }
});

export const updateSavePatternNameAvailable = (nameAvailable: boolean) => ({
  type: UPDATE_SAVED_PATTERN_NAME_AVAILABLE,
  payload: {
    nameAvailable
  }
});

export const savePattern = (
  pattern: QueryPattern,
  previousName: string | boolean
) => {
  return async (dispatch: Function) => {
    dispatch({
      type: SAVED_PATTERN_REQUEST_PENDING
    });
    try {
      const isUpdate = pattern.name === previousName;
      const gqlOperation = isUpdate ? updateQueryPattern : createQueryPattern;
      const {
        filters,
        groupbyColumns,
        selectedColumns,
        ...restPattern
      } = removeEmpty(pattern);

      const input = {
        ...restPattern,
        description: pattern.description || null,
        filters: JSON.stringify(parseAWSString(filters)),
        groupbyColumns: JSON.stringify(parseAWSString(groupbyColumns)),
        selectedColumns: JSON.stringify(parseAWSString(selectedColumns)),
        version: pattern.version || 1,
        updatedAt: new Date().toISOString()
      };
      const { data } = (await API.graphql(
        graphqlOperation(gqlOperation, { input })
      )) as { data: any };

      if (data && data.createQueryPattern) {
        if (previousName) {
          await API.graphql(
            graphqlOperation(deleteQueryPattern, {
              input: { document: pattern.document, name: previousName }
            })
          );
        }

        dispatch({
          type: SAVED_PATTERN_REQUEST_SUCCESS
        });
      }
    } catch (e) {
      dispatch({
        type: SAVED_PATTERN_REQUEST_FAILED,
        payload: e.message
      });
    }
  };
};

export const deletePattern = (document: string, name: string) => {
  return async (dispatch: Function) => {
    dispatch({
      type: SAVED_PATTERN_REQUEST_PENDING
    });
    try {
      await API.graphql(
        graphqlOperation(deleteQueryPattern, { input: { document, name } })
      );

      dispatch({
        type: SAVED_PATTERN_REQUEST_SUCCESS
      });
    } catch (e) {
      dispatch({
        type: SAVED_PATTERN_REQUEST_FAILED,
        payload: e.message
      });
    }
  };
};

export const getSavedPatterns = () => {
  return async (dispatch: Function) => {
    dispatch({
      type: SAVED_PATTERN_REQUEST_PENDING
    });
    try {
      const { data } = (await API.graphql(
        graphqlOperation(listQueryPatterns, {})
      )) as { data: any };

      const savedPatterns =
        data && data.listQueryPatterns ? data.listQueryPatterns.items : [];

      dispatch(updateSavedPatternsData(savedPatterns));
      dispatch({
        type: SAVED_PATTERN_REQUEST_SUCCESS
      });

      return true;
    } catch (e) {
      dispatch({
        type: SAVED_PATTERN_REQUEST_FAILED,
        payload: e.message
      });

      return e;
    }
  };
};

export const updateSavePatternSearchTerm = (searchTerm: string) => ({
  type: SAVED_PATTERN_SEARCH_TERM,
  payload: {
    searchTerm
  }
});
