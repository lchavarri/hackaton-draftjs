import React from 'react';
import { connect } from 'react-redux';
import { debounce } from 'throttle-debounce';

// Local imports
import {
  getSavedPatterns,
  toggleScrollEffect,
  updateSavePatternSearchTerm
} from '../../../../redux/actions';
import { IColumnDataDto } from '../../../../../shared/core/index';
import SavedPatternsMenu from './SavedPatternsMenu';
import SavedPatternsList from './SavedPatternsList';
import { updateSavedPatternsData } from '../../../../redux/actions/savedPatternsActions';
import { SavedPattern } from '../../../../redux/reducers/savedPatternsReducer';
import useScrollable from '../../../../../shared/ui/hooks/useScrollable';
import { format } from 'date-fns';

class SavedPatterns extends React.Component<any> {
  mounted: boolean = false;
  //TODO: get clumnsFilters & groupByColumns
  selectedColumnFilters: Array<IColumnDataDto> = [];
  groupbyColumns: Array<IColumnDataDto> = [];

  highlighted: string = '';
  sortBy: string = 'date';

  state = {
    patterns: this.props.patterns,
    noResults: false
  };

  async componentDidMount() {
    this.mounted = true;
    const { patterns, searchTerm } = this.props;

    if (!patterns.length) {
      try {
        await this.props.getSavedPatterns();
      } catch (e) {
        console.error(e);
      }
    }
    this.onFilter(searchTerm);
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidUpdate(prevProps: any) {
    const { patterns } = this.props;

    if (prevProps.patterns !== patterns && this.mounted) {
      this.onFilter(this.highlighted);
    }
  }

  onFilter = debounce(500, (term: string) => {
    this.highlighted = term;
    this.props.updateSavePatternSearchTerm(term);

    // Filter List
    const patterns = this.searchSavedPatterns(term);

    this.setState({
      // Sort list
      patterns: this.sortSavedPatterns(this.sortBy, patterns),
      noResults: !patterns.length || term === ' '
    });
  });

  onSort = (sort: string) => {
    this.sortBy = sort;

    // Filter list
    const patterns = this.searchSavedPatterns(this.highlighted);

    // Sort list
    this.setState({ patterns: this.sortSavedPatterns(sort, patterns) });
  };

  sortSavedPatterns = (sortBy: string, list: Array<SavedPattern>) => {
    if (!list) return [];

    const sorted = [...list].sort((a: SavedPattern, b: SavedPattern) => {
      switch (sortBy) {
        case 'date':
          //latest first
          if (a.createdAt > b.createdAt) return -1;
          if (a.createdAt < b.createdAt) return 1;
          return 0;
        case 'author':
          return a.document.localeCompare(b.document);
        // Sort by Name by default
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return sorted;
  };

  searchSavedPatterns = (term: string) => {
    const { patterns } = this.props;

    if (!patterns) return [];

    const searchTerm = term.toLocaleLowerCase();

    const filtered = patterns.filter((pattern: SavedPattern) => {
      let { name = '', description = '', document = '' } = pattern;
      description = description || '';
      const createdDate = format(pattern.createdAt || '', 'MM/DD/YYYY');

      return (
        name.toLowerCase().includes(searchTerm) ||
        description.toLowerCase().includes(searchTerm) ||
        createdDate.toLowerCase().includes(searchTerm) ||
        document.toLowerCase().includes(searchTerm)
      );
    });

    return [...filtered];
  };

  render() {
    const { savedPatternStageVisible, loading, expandPane } = this.props;
    const { setRef, onScroll } = useScrollable();
    return (
      <>
        <SavedPatternsMenu
          setRef={setRef}
          savedPatternStageVisible={savedPatternStageVisible}
          patterns={this.state.patterns}
          onFilter={this.onFilter}
          onSort={this.onSort}
        />
        <SavedPatternsList
          onScroll={onScroll}
          savedPatternStageVisible={savedPatternStageVisible}
          patterns={this.state.patterns}
          highlighted={this.highlighted}
          noResults={this.state.noResults}
          loading={loading}
          expandPane={expandPane}
        />
      </>
    );
  }
}

const mapStateToProps = (state: any, ownProps: any) => {
  const { savedPatterns } = state;

  return {
    ...ownProps,
    patterns: savedPatterns.savedPatterns,
    loading: savedPatterns.loading,
    searchTerm: savedPatterns.searchTerm
  };
};

export default connect(
  mapStateToProps,
  {
    toggleScrollEffect,
    updateSavedPatternsData,
    getSavedPatterns,
    updateSavePatternSearchTerm
  }
)(SavedPatterns);
