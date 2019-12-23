import React from 'react';
import { connect } from 'react-redux';
import { Message } from 'semantic-ui-react';

import {
  toggleLoadPatternOpenModal,
  updateFiltersOnPath
} from '../../../redux/actions';
import { getFiltersState } from '../../../redux/selectors/filter/filterSelector';
import * as fileIntegrity from '../../../utils/filterFileDataService';
import FilePicker from '../../filePicker/filePicker';
import { ILibraryFilter } from '../../layout/layoutTypes';
import EidosModal, {
  ModalAction
} from '../../../../shared/ui/components/modals/eidosModal';
import { updateLoadPathModal } from '../../../redux/actions/loadPathActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExclamationCircle,
  faExclamationTriangle,
  faCircleNotch
} from '@fortawesome/pro-light-svg-icons';

export type LoadPathModalState = {
  actions: Array<ModalAction>;
  filters: Array<ILibraryFilter>;
  warning: boolean;
  error: boolean;
  processing: boolean;
  success: boolean;
  invalid: boolean;
};

class LoadPathModal extends React.Component<any, LoadPathModalState> {
  constructor(props: any) {
    super(props);
  }
  startUpload = () =>
    this.props.updateLoadPathModal({
      actions: this.props.actions,
      filters: [],
      warning: false,
      error: false,
      processing: true,
      success: false,
      invalid: false
    });

  invalidFormat = () =>
    this.props.updateLoadPathModal({
      warning: false,
      error: false,
      processing: false,
      success: false,
      invalid: true,
      actions: [
        {
          text: 'Load Pattern',
          action: () => this.loadPath(),
          position: 'left',
          disabled: true
        }
      ]
    });

  updateFile = (fileData: any) => {
    fileIntegrity.checkFileIntegrityJSON(fileData).then((resp: any) => {
      this.props.updateLoadPathModal({
        warning: false,
        error: !resp.valid,
        processing: false,
        success: resp.valid,
        filters: resp.filters,
        invalid: false,
        actions: [
          {
            text: 'Load Pattern',
            action: () => this.loadPath(),
            position: 'left',
            disabled: !resp.valid
          }
        ]
      });
    });
  };

  configLoadPathModal = () => {
    this.props.updateLoadPathModal({
      actions: [
        {
          text: 'Load Pattern',
          action: () => this.loadPath(),
          position: 'left',
          disabled: true
        }
      ],
      filters: [],
      warning: this.props.filterPathLength >= 1,
      error: false,
      processing: false,
      success: false,
      invalid: false
    });
  };

  componentDidUpdate(prevProps: any) {
    if (
      !prevProps.loadPatternModalOpened &&
      this.props.loadPatternModalOpened
    ) {
      this.configLoadPathModal();
    }
  }

  handleClose = () => {
    this.configLoadPathModal();
    this.toggleLoadPatternOpenModal();
  };

  loadPath = () => {
    this.props.updateFiltersOnPath(this.props.filters);
    this.toggleLoadPatternOpenModal();
  };
  toggleLoadPatternOpenModal = () => this.props.toggleLoadPatternOpenModal();

  noop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  };

  render() {
    const {
      actions,
      warning,
      error,
      processing,
      success,
      invalid
    } = this.props;
    const { loadPatternModalOpened } = this.props;
    return (
      <div onClick={this.noop} onDrag={this.noop}>
        <EidosModal
          modalTitle="Load Pattern"
          subheader="Load a pattern file to add its contents to your filter pattern"
          closeOnOutSideClick={false}
          size="tiny"
          actions={actions}
          modalOpen={loadPatternModalOpened}
          handleClose={this.handleClose}
        >
          <FilePicker
            updateFile={this.updateFile}
            startUpload={this.startUpload}
            invalidFormat={this.invalidFormat}
            success={success}
          >
            <Message className="transparent" hidden={!warning}>
              <FontAwesomeIcon
                icon={faExclamationTriangle}
                className="icon orange"
              />
              <span>
                Loading a file will replace the contents of your current filter
                pattern
              </span>
            </Message>
            <Message className="transparent" hidden={!error}>
              <FontAwesomeIcon
                icon={faExclamationCircle}
                className="icon red"
              />
              <span>
                You can only load files downloaded from this application
              </span>
            </Message>
            <Message className="transparent" hidden={!invalid}>
              <FontAwesomeIcon
                icon={faExclamationCircle}
                className="icon red"
              />
              <span>
                You can only load files downloaded from this application
              </span>
            </Message>
            <Message className="transparent" hidden={!processing}>
              <span className="fa-layers fa-fw">
                <FontAwesomeIcon icon={faCircleNotch} className="fa-spin" />
              </span>
              <span>Processing the file</span>
            </Message>
          </FilePicker>
        </EidosModal>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  const { filters, layout, loadPath } = state;

  return {
    filters: loadPath.filters,
    filterPathLength: getFiltersState(filters).length,
    loadPatternModalOpened: layout.loadPatternModalOpened,
    actions: loadPath.actions,
    error: loadPath.error,
    invalid: loadPath.invalid,
    processing: loadPath.processing,
    success: loadPath.success,
    warning: loadPath.warning
  };
};

export default connect(
  mapStateToProps,
  {
    updateFiltersOnPath,
    toggleLoadPatternOpenModal,
    updateLoadPathModal
  }
)(LoadPathModal);
