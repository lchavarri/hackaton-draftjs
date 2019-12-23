// Local imports
import {
  UPDATE_SAVED_PATTERNS_DATA,
  UPDATE_SAVE_PATTERN_NAME,
  UPDATE_SAVE_PATTERN_DESCRIPTION,
  UPDATE_SAVED_PATTERN_NAME_AVAILABLE,
  SAVED_PATTERN_REQUEST_PENDING,
  SAVED_PATTERN_REQUEST_SUCCESS,
  SAVED_PATTERN_REQUEST_FAILED,
  SAVED_PATTERN_SEARCH_TERM
} from '../actionTypes';
import { ILibraryFilter } from '../../components/layout/layoutTypes';
import { ColumnData } from '../../components/resultStage/columnBuilder/columnBuilder';

export interface SavedPattern {
  id: string;
  name: string;
  document: string;
  filters: Array<ILibraryFilter>;
  selectedColumns: Array<ColumnData>;
  groupbyColumns: Array<ColumnData>;
  description: string;
  createdAt: string;
  initials: string;
  hover?: boolean;
  isOpen?: boolean;
  isOwner?: boolean;
}

type SavedPatternsState = {
  savedPatterns: Array<SavedPattern>;
  savePatternDescription: string;
  savePatternName: string;
  isPatternNameAvailable: boolean;
  loading: boolean;
  error: string;
  searchTerm: string;
};

const initialState: SavedPatternsState = {
  savedPatterns: [],
  savePatternDescription: '',
  savePatternName: '',
  isPatternNameAvailable: true,
  loading: false,
  error: '',
  searchTerm: ''
};

const getInitials = (fullName: string) => {
  return fullName
    .split(' ')
    .map(word => {
      return word.substring(0, 1).toUpperCase();
    })
    .join('');
};

export default function(state = initialState, action: any) {
  switch (action.type) {
    case UPDATE_SAVED_PATTERNS_DATA: {
      const { savedPatterns } = action.payload;
      return {
        ...state,
        savedPatterns: savedPatterns.map((pattern: SavedPattern) => {
          return {
            ...pattern,
            id: `${pattern.name}_${pattern.document}`,
            initials: getInitials(pattern.document)
          };
        })
      };
    }

    case UPDATE_SAVE_PATTERN_NAME: {
      const { savePatternName } = action.payload;
      return {
        ...state,
        savePatternName
      };
    }

    case UPDATE_SAVE_PATTERN_DESCRIPTION: {
      const { savePatternDescription } = action.payload;
      return {
        ...state,
        savePatternDescription
      };
    }

    case UPDATE_SAVED_PATTERN_NAME_AVAILABLE: {
      const { nameAvailable } = action.payload;
      return {
        ...state,
        isPatternNameAvailable: nameAvailable
      };
    }

    case SAVED_PATTERN_REQUEST_PENDING: {
      return {
        ...state,
        loading: true
      };
    }

    case SAVED_PATTERN_REQUEST_SUCCESS: {
      return {
        ...state,
        loading: false
      };
    }

    case SAVED_PATTERN_REQUEST_FAILED: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    case SAVED_PATTERN_SEARCH_TERM: {
      const { searchTerm } = action.payload;
      return {
        ...state,
        searchTerm: searchTerm
      };
    }

    default:
      return state;
  }
}
