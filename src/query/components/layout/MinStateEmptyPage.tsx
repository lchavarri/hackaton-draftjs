import React from 'react';
import { Button } from 'semantic-ui-react';

import './MinStateEmptyPage.scss';
import VariableName from './VariableName';
import useMinMaxHook from '../../../shared/ui/hooks/useFullscreen';
import appNames from '../../../shared/ui/appNames';
import {
  isValidVariableName,
  getVariablePending
} from '../../redux/selectors/jupyterSelector';
import { connect } from 'react-redux';

function MinStateEmptyPage(props: any) {
  const { isValidVariableName, variableNamePending } = props;
  const { setFullscreen } = useMinMaxHook();

  const buttonDisabled = variableNamePending || !isValidVariableName;

  return (
    <div className="min-empty">
      <h3 className="min-empty-title">{appNames.EIDOS_QUERY}</h3>
      <p className="min-empty-subtitle">
        Search the SMI dataset using this advanced drag and drop querying tool.
      </p>
      <div className="min-empty-input-wrapper">
        <VariableName emptyState={true} />
      </div>
      <Button
        basic
        primary
        onClick={(e: any) => {
          // Prevent double-double click changing fullscreen state
          if (e.detail < 2) {
            setFullscreen(true);
          }
        }}
        disabled={buttonDisabled}
      >
        BUILD A QUERY
      </Button>
    </div>
  );
}

export default connect(
  (state: any) => {
    return {
      isValidVariableName: isValidVariableName(state),
      variableNamePending: getVariablePending(state)
    };
  },
  {}
)(MinStateEmptyPage);
