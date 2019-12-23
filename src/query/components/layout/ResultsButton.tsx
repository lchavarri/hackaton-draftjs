import React, { useContext } from 'react';
import { connect } from 'react-redux';

// Local deps
import { Button } from 'semantic-ui-react';

// Local imports
import {
  setLoadingState,
  getResults,
  setFirstLoad,
  makeColumnsDefaultSelection,
  setSettingVisible
} from '../../redux/actions';
import { getFiltersState } from '../../redux/selectors/filter/filterSelector';
import {
  getFilterDTOData,
  getApiFilterDTOData
} from '../../utils/filterDataService';
import {
  getApiColumnModelFromColumnData,
  makeColumnBuilderDefaultSelection
} from '../../utils/columnFilterUtils';
import {
  getVariableName,
  isValidVariableName
} from '../../redux/selectors/jupyterSelector';
import { Context } from '../../../shared/ui/main/main';

type Props = {};

function ResultsButton(props: any) {
  const { liveAppInstanceId } = useContext(Context);

  const {
    isFirstLoad,
    selectedColumns,
    filters,
    groupBySelectedColumns,
    getResults,
    setLoadingState,
    variableName,
    expandPane,
    columnBuilderColumns,
    rawLibrary,
    columnBuilderSearch,
    isValidVariableName,
    setSettingVisible,
    updateContent
  } = props;

  const getResultsCallback = async () => {
    expandPane();
    setLoadingState(true);
    setSettingVisible(false);
    props.setFirstLoad();

    let cols = makeColumnBuilderDefaultSelection(
      filters,
      columnBuilderColumns,
      rawLibrary,
      selectedColumns,
      columnBuilderSearch
    );

    props.makeColumnsDefaultSelection(cols);

    await getResults(
      variableName,
      getApiFilterDTOData(filters),
      getApiColumnModelFromColumnData(cols),
      getApiColumnModelFromColumnData(groupBySelectedColumns),
      liveAppInstanceId
    );

    updateContent(
      {
        filters: getFilterDTOData(filters)
      },
      null
    );
  };

  const buttonDisabled = !filters || !filters.length || !isValidVariableName;

  return (
    <Button
      basic
      primary
      floated="right"
      id="updateResults"
      onClick={getResultsCallback}
      disabled={buttonDisabled}
    >
      {isFirstLoad ? 'Get' : 'Update'} Results
    </Button>
  );
}

const mapStateToProps = (state: any, ownProps: Props) => {
  const { filters } = state;
  const {
    selectedColumns,
    isFirstLoad,
    groupBySelectedColumns,
    columnBuilderColumns,
    rawLibrary,
    columnBuilderSearch
  } = filters;

  return {
    ...ownProps,
    filters: getFiltersState(filters),
    isFirstLoad,
    selectedColumns,
    groupBySelectedColumns,
    columnBuilderColumns,
    rawLibrary,
    columnBuilderSearch,
    variableName: getVariableName(state),
    isValidVariableName: isValidVariableName(state)
  };
};

export default connect(mapStateToProps, {
  getResults,
  setLoadingState,
  setFirstLoad,
  makeColumnsDefaultSelection,
  setSettingVisible
})(ResultsButton);
