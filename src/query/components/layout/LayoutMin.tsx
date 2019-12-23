import React from 'react';
import { connect } from 'react-redux';

import './LayoutMin.scss';
import ResultsPreview from '../resultStage/ResultsPreview';
import AppBar from './AppBar';
import MinStateQueryName from './MinStateQueryName';
import { getFiltersState } from '../../redux/selectors/filter/filterSelector';
import MinStateEmptyPage from './MinStateEmptyPage';
import Timestamp from './Timestamp';
import { hasCypher } from '../../redux/selectors/resultsSelector';

type Props = {
  hasCypher: boolean;
  hasFilters: boolean;
  filters: any;
  settingsState: {
    inputVisible: boolean;
    outputVisible: boolean;
    timestampVisible: boolean;
  };
};

function LayoutMin(props: Props) {
  const { hasCypher, hasFilters, filters, settingsState } = props;
  const { inputVisible, outputVisible, timestampVisible } = settingsState;

  const renderMinStateEmpty = () => {
    if (!hasFilters) {
      return <MinStateEmptyPage />;
    }

    return (
      <>
        <AppBar />
        <div className="wrapper">
          {renderQueryName()}
          {renderResults()}
          {renderTimestamp()}
        </div>
      </>
    );
  };

  const renderQueryName = () => {
    if (!inputVisible) return null;

    return <MinStateQueryName filters={filters} />;
  };

  const renderResults = () => {
    if (!outputVisible || !hasCypher) return null;

    return <ResultsPreview />;
  };

  const renderTimestamp = () => {
    if (!timestampVisible || !hasCypher) return null;

    return <Timestamp />;
  };

  return <div className="main min">{renderMinStateEmpty()}</div>;
}

const mapStateToProps = (state: any) => {
  const filterPath = getFiltersState(state.filters);
  return {
    hasCypher: hasCypher(state),
    hasFilters: filterPath && filterPath.length > 0,
    filters: filterPath
  };
};

export default connect(
  mapStateToProps,
  {}
)(LayoutMin);
