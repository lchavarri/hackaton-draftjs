import React, { useEffect } from 'react';
import { Button, Popup, Menu } from 'semantic-ui-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/pro-light-svg-icons';
// Local imports
import './AppBar.scss';
import VariableName from './VariableName';
import useMinMaxHook from '../../../shared/ui/hooks/useFullscreen';
import ToastMessage from '../../../shared/ui/components/ToastMessage';
import appNames from '../../../shared/ui/appNames';
import { connect } from 'react-redux';
import { clearToastOpen, toggleScrollEffect } from '../../redux/actions';

function AppBar(props: any) {
  const { fullscreen, setFullscreen } = useMinMaxHook();
  const { toastType, toastVisible, toastMessage, clearToastOpen } = props;

  useEffect(() => {
    if (!fullscreen) props.toggleScrollEffect(false, false, false, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullscreen]);

  const renderBackButton = () => {
    const label = fullscreen ? 'Back to Notebook' : 'Edit in Query Builder';

    return (
      <Button
        className="text"
        onClick={(e: any) => {
          // Prevent double-double click changing fullscreen state
          if (e.detail < 2) {
            setFullscreen(!fullscreen);
          }
        }}
      >
        {label}
      </Button>
    );
  };

  return (
    <div className="app-bar">
      <div className="input-wrapper">
        <Menu.Header as="h3">{appNames.EIDOS_QUERY}:</Menu.Header>
        <VariableName />
        <Popup
          position="right center"
          wide="very"
          size="tiny"
          content="Use the Variable Name to refer to a dataset in your document."
          on="click"
          trigger={
            <span className="input-wrapper-icon">
              <FontAwesomeIcon icon={faQuestionCircle} size="lg" />
            </span>
          }
        />
      </div>
      <ToastMessage
        type={toastType}
        visible={toastVisible}
        message={toastMessage}
        setVisible={clearToastOpen}
      />
      {renderBackButton()}
    </div>
  );
}

const mapStateToProps = (state: any, ownProps: any) => {
  const { layout } = state;
  return {
    ...ownProps,
    toastVisible: layout.toastVisible,
    toastMessage: layout.toastMessage,
    toastType: layout.toastType
  };
};

export default connect(
  mapStateToProps,
  {
    clearToastOpen,
    toggleScrollEffect
  }
)(AppBar);
