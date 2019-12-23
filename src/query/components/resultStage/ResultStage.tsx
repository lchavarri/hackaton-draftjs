import './ResultStage.scss';

import React from 'react';
import { connect } from 'react-redux';
import { Container, Grid, Header, Menu } from 'semantic-ui-react';

// Local imports
import {
  populateCypher,
  populateTableColumns,
  setFirstLoad,
  setSettingVisible,
  toggleFilterPath,
  clearSettings,
  setLoadingState,
  toggleScrollEffect,
  setSelectedColumns
} from '../../redux/actions';
import {
  getFiltersState,
  getRawLibraryFilterState
} from '../../redux/selectors/filter/filterSelector';
import ColumnBuilder, { ColumnData } from './columnBuilder/columnBuilder';
import GroupBy from './groupBy/groupBy';
import ResultsPreview from './ResultsPreview';
import LoadingAnimation from '../loading/loadingAnimation';

type Props = {
  isLoading?: boolean;
  resultScroll?: boolean;
};

export type ResultStageState = {
  displayResults: string;
  settingsVisible: boolean;
  selectedColumns: Array<ColumnData>;
  tableColumns: Array<Array<string>>;
  tableTop10: Array<Array<string>>;
  count: number;
  isFirstLoad: boolean;
  isLoading?: boolean;
  groupBySelectedColumns: Array<ColumnData>;
  hasDefinedTableSettings: boolean;
  executionStartedAt: Date | null;
  executionEndedAt: Date | null;
};

class ResultStage extends React.Component<any, ResultStageState> {
  componentWillReceiveProps(nextProps: any) {
    if (this.props.isFirstLoad && !nextProps.isFirstLoad) {
      if (!nextProps.selectedColumns || !nextProps.selectedColumns.length) {
        this.props.setSelectedColumns(nextProps.inFilterPath);
      }
    }
  }

  settingsClick = () =>
    this.props.setSettingVisible(!this.props.settingsVisible);
  clearSettings = () => this.props.clearSettings();

  handleScroll = (e: any) => {
    if (e.defaultPrevented) {
      return;
    }
    this.props.toggleScrollEffect(undefined, undefined, e.target.scrollTop > 1);
  };

  render() {
    const {
      clearSettingsEnabled,
      displayResults,
      settingsVisible,
      isLoading,
      resultScroll,
      expandPane,
      showResults
    } = this.props;

    return (
      <div className="result-stage">
        <div
          onClick={expandPane}
          className={
            'filter-menu-wrapper menu-wrapper' +
            (resultScroll && (!isLoading || displayResults === '')
              ? ' shadow'
              : '') +
            (showResults ? ' hover' : '')
          }
        >
          <Menu text tabular attached="top" className="drawer-top sticky">
            <Container fluid>
              <Header as="h2">Query Results</Header>
              <Menu.Item
                onClick={e => {
                  e.stopPropagation();
                  this.clearSettings();
                }}
                disabled={!clearSettingsEnabled}
                id="clearSettings"
              >
                Clear Settings
              </Menu.Item>
              <Menu.Item
                onClick={e => {
                  e.stopPropagation();
                  this.settingsClick();
                }}
                id="toggleSettings"
              >
                {settingsVisible ? 'Hide' : 'Show'} Settings
              </Menu.Item>
            </Container>
          </Menu>
        </div>
        <div className="result-stage-wrapper">
          <div
            className="container-scrollable"
            onScroll={(e: React.UIEvent<HTMLDivElement>) =>
              this.handleScroll(e)
            }
          >
            <Container
              fluid
              className={
                settingsVisible
                  ? 'padded animate'
                  : 'padded animate animate-hide'
              }
            >
              <Grid columns={1}>
                <Grid.Row>
                  <Grid.Column width={16} className="flex-row">
                    <label>Columns</label>
                    <ColumnBuilder />
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column width={16} className="flex-row">
                    <label>Group By</label>
                    <GroupBy />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Container>

            <Container fluid className="padded">
              {!isLoading ? (
                displayResults !== '' ? (
                  <ResultsPreview />
                ) : (
                  <div className="stage-empty">
                    <h1>See Results</h1>
                    <p>
                      Once you have a filter pattern, select ‘See Results’ to
                      view the resulting data in a table
                    </p>
                  </div>
                )
              ) : (
                <LoadingAnimation />
              )}
            </Container>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: any, ownProps: Props) => {
  const { filters, layout } = state;
  const {
    displayResults,
    settingsVisible,
    selectedColumns,
    isFirstLoad,
    isLoading,
    inFilterPath,
    groupBySelectedColumns
  } = filters;

  return {
    ...ownProps,
    filters: getFiltersState(filters),
    rawlibrary: getRawLibraryFilterState(filters),
    filterPathVisible: layout.filterPathVisible,
    displayResults,
    settingsVisible,
    clearSettingsEnabled: selectedColumns.length >= 1,
    isFirstLoad,
    isLoading,
    resultScroll: state.layout.resultScroll,
    inFilterPath,
    selectedColumns,
    groupBySelectedColumns
  };
};

export default connect(mapStateToProps, {
  toggleFilterPath,
  setSettingVisible,
  clearSettings,
  populateCypher,
  populateTableColumns,
  setFirstLoad,
  setLoadingState,
  toggleScrollEffect,
  setSelectedColumns
})(ResultStage);
