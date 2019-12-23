import React, { useContext } from 'react';
import { connect } from 'react-redux';

import EidosVariableName from '../../../shared/ui/components/EidosVariableName/EidosVariableName';
import {
  setVariableName,
  validateVariableName
} from '../../redux/actions/jupyterActions';
import {
  getVariableName,
  getVariablePending
} from '../../redux/selectors/jupyterSelector';
import { Context } from '../../../shared/ui/main/main';

function VariableName(props: any) {
  const {
    emptyState,
    variableName,
    isPending,
    setVariableName,
    validateVariableName
  } = props;

  const { liveAppInstanceId, documentId } = useContext(Context);

  const onChange = (newName: string) => {
    return setVariableName(
      liveAppInstanceId,
      documentId,
      variableName,
      newName
    );
  };

  return (
    <EidosVariableName
      variableName={variableName}
      isPending={isPending}
      isSplashPage={emptyState}
      onChange={onChange}
      onValidation={validateVariableName}
    ></EidosVariableName>
  );
}

export default connect(
  (state: any) => {
    return {
      variableName: getVariableName(state),
      isPending: getVariablePending(state)
    };
  },
  { setVariableName, getVariableName, validateVariableName }
)(VariableName);
