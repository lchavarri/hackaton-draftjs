import React, { useContext, useEffect } from 'react';
import { connect } from 'react-redux';
import uuid from 'uuid';

import LayoutMax from '../layout/LayoutMax';
import LayoutMin from '../layout/LayoutMin';
import useMinMaxHook from '../../../shared/ui/hooks/useFullscreen';
import useCustomMenu from '../../hooks/useCustomMenu';
import { Context } from '../../../shared/ui/main/main';
import {
  setPythonVariableName,
  setKernelStatus,
  exportSpreadsheet,
  downloadCsv
} from '../../redux/actions/jupyterActions';
import {
  updateFiltersOnPath,
  setBuildCypherSuccess,
  setSelectedColumns,
  makeColumnsDefaultSelection,
  buildColumnBuilderDefault,
  displayDismissableToast,
  setDocumentId
} from '../../redux/actions';
import {
  getVariableName,
  isValidVariableName
} from '../../redux/selectors/jupyterSelector';
import ServerError from '../../../shared/ui/components/ServerError';
import { IServerError } from '../../../shared/core';
import { getServerError } from '../../redux/selectors/layoutSelectors';
import { hasCypher } from '../../redux/selectors/resultsSelector';
import useRealTime from '../../hooks/useRealTime';
import { IFilter, ILibraryFilter } from '../layout/layoutTypes';
import { getFiltersState } from '../../redux/selectors/filter/filterSelector';
import { IFilterDTO } from '../../utils/filterDataService';
import * as filterDataService from '../../utils/filterFileDataService';
import useKernel from '../../hooks/useKernel';

type Props = {
  setPythonVariableName: Function;
  setKernelStatus: Function;
  exportSpreadsheet: Function;
  downloadCsv: Function;
  variableName: string;
  serverError: IServerError | null;
  hasCypher: boolean;
  displayDismissableToast: Function;
  isValidVariableName: boolean;
  setDocumentId: Function;
  updateFiltersOnPath: Function;
  setBuildCypherSuccess: Function;
  buildColumnBuilderDefault: Function;
  setSelectedColumns: Function;
  filters: Array<IFilterDTO>;
};
let localFilters: any = [];
let initializedFilters: boolean = false;

function App(props: Props) {
  const [kernelData, kernelLoading, kernelError] = useKernel();
  const {
    setPythonVariableName,
    setKernelStatus,
    exportSpreadsheet,
    downloadCsv,
    variableName,
    serverError,
    hasCypher,
    displayDismissableToast,
    isValidVariableName,
    setDocumentId,
    updateFiltersOnPath,
    filters
  } = props;

  const { documentId } = useContext(Context);
  const hasFilters = filters && filters.length > 0;

  const settingsState = useCustomMenu(
    variableName,
    exportSpreadsheet,
    downloadCsv,
    hasCypher,
    displayDismissableToast,
    isValidVariableName,
    hasFilters
  );
  const { fullscreen } = useMinMaxHook();
  const { updateLiveAppContent } = useRealTime((data: any) => {
    const { content, pythonVariableName } = data;
    const { filters: fetchedFilters } = JSON.parse(content);

    if (pythonVariableName) {
      setPythonVariableName(pythonVariableName);
    }

    if (filters) {
      localFilters = fetchedFilters.map((item: IFilter) => ({
        ...item,
        filters: item.filters || [],
        id: uuid()
      }));
    }
  });

  useEffect(() => {
    setKernelStatus(kernelData, kernelLoading, kernelError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kernelData, kernelLoading, kernelError]);

  useEffect(() => {
    setDocumentId(documentId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function sanitizePath(filters: ILibraryFilter[]) {
    const integrity = await filterDataService.checkFileIntegrity(
      filters as ILibraryFilter[]
    );

    updateFiltersOnPath(integrity.valid ? integrity.filters : []);
  }

  useEffect(() => {
    if (fullscreen) {
      if (initializedFilters) {
        sanitizePath(filters as ILibraryFilter[]);
      } else {
        sanitizePath(localFilters);
        initializedFilters = true;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullscreen]);

  return (
    <>
      <ServerError error={serverError} />
      {fullscreen ? (
        <LayoutMax updateContent={updateLiveAppContent} />
      ) : (
        <LayoutMin settingsState={settingsState} />
      )}
    </>
  );
}

export default connect(
  (state: any) => {
    return {
      variableName: getVariableName(state),
      isValidVariableName: isValidVariableName(state),
      serverError: getServerError(state),
      hasCypher: hasCypher(state),
      filters: getFiltersState(state.filters)
    };
  },
  {
    setPythonVariableName,
    setKernelStatus,
    exportSpreadsheet,
    downloadCsv,
    displayDismissableToast,
    setDocumentId,
    updateFiltersOnPath,
    setBuildCypherSuccess,
    setSelectedColumns,
    makeColumnsDefaultSelection,
    buildColumnBuilderDefault
  }
)(App);
