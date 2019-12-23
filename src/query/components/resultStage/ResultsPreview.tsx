import React from 'react';
import { Grid } from 'semantic-ui-react';
import { connect } from 'react-redux';

import './ResultsPreview.scss';
import ResultsDownload from './ResultsDownload';
import TablePreview from './tablePreview/tablePreview';
import { getVariableName } from '../../redux/selectors/jupyterSelector';

function ResultsPreview(props: any) {
  const { count, displayResults, variableName } = props;

  const plural = count !== 1 ? 's' : '';

  return (
    <div className="results-preview">
      <Grid columns={2}>
        <Grid.Row>
          <Grid.Column width={8} className="results-preview-labels">
            <label>Results Preview:</label>
            {variableName}
            <div className="results-preview-record-count">
              <span id="recordsCount">{count}</span>
              {` record${plural}`}
            </div>
          </Grid.Column>
          <Grid.Column width={8} floated="right" textAlign="right">
            <ResultsDownload />
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <div className="table-responsive-x custom-scroll">
        <TablePreview />
      </div>
      <Grid columns={2}>
        <Grid.Row>
          <Grid.Column mobile={6} tablet={4} computer={13}>
            {count > 10 ? (
              <span>
                + <span id="recordsLeft">{count - 10}</span> record
                {count > 11 ? 's' : ''}.{' '}
                <span>Download the file for the full data set.</span>
              </span>
            ) : (
              ''
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <pre className="cypher">{displayResults}</pre>
    </div>
  );
}

const mapStateToProps = (state: any) => {
  const { filters } = state;
  const { count, displayResults } = filters;
  const variableName = getVariableName(state);

  return {
    displayResults,
    count,
    variableName
  };
};

export default connect(
  mapStateToProps,
  {}
)(ResultsPreview);
