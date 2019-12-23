import React, { useContext } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleDown } from '@fortawesome/pro-light-svg-icons';

import { hasResults } from '../../redux/selectors/resultsSelector';
import {
  getVariableName,
  getExportSpreadsheetPending,
  getDownloadCsvPending,
  isValidVariableName
} from '../../redux/selectors/jupyterSelector';
import {
  exportSpreadsheet,
  downloadCsv
} from '../../redux/actions/jupyterActions';
import { displayDismissableToast } from '../../redux/actions';
import { Context } from '../../../shared/ui/main/main';

function ResultsPreview(props: any) {
  const { documentId } = useContext(Context);
  const {
    hasResults,
    variableName,
    isValidVariableName,
    exportSpreadsheetPending,
    downloadCsvPending,
    exportSpreadsheet,
    downloadCsv,
    displayDismissableToast
  } = props;

  const handleExport = () => {
    if (hasResults) {
      exportSpreadsheet(variableName, documentId);
      displayDismissableToast('Spreadsheet exported to Quip document.');
    }
  };

  const handleDownload = () => {
    if (hasResults) {
      downloadCsv(variableName);
    }
  };

  const disabledExport =
    !isValidVariableName || !hasResults || exportSpreadsheetPending;
  const disabledDownload =
    !isValidVariableName || !hasResults || downloadCsvPending;

  return (
    <>
      <button
        className="ui button text"
        onClick={handleExport}
        disabled={disabledExport}
      >
        Export to Quip Spreadsheet
      </button>
      <button
        id="getCSVFile"
        className="ui button text"
        onClick={handleDownload}
        disabled={disabledDownload}
      >
        <FontAwesomeIcon icon={faArrowCircleDown} className="icon" />
        Download Txt
      </button>
    </>
  );
}

const mapStateToProps = (state: any) => {
  return {
    hasResults: hasResults(state),
    variableName: getVariableName(state),
    isValidVariableName: isValidVariableName(state),
    exportSpreadsheetPending: getExportSpreadsheetPending(state),
    downloadCsvPending: getDownloadCsvPending(state)
  };
};

export default connect(mapStateToProps, {
  exportSpreadsheet,
  downloadCsv,
  displayDismissableToast
})(ResultsPreview);
