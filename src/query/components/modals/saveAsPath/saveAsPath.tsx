import React from 'react';
import { connect } from 'react-redux';
import { Message, Input, TextArea, Form } from 'semantic-ui-react';
import { graphqlOperation, API } from 'aws-amplify';

import { ILibraryFilter } from '../../layout/layoutTypes';
import EidosModal, {
  ModalAction
} from '../../../../shared/ui/components/modals/eidosModal';

import { getFilterDTOData } from '../../../utils/filterDataService';
import { getFiltersState } from '../../../redux/selectors/filter/filterSelector';

import {
  updateSavePatternNameAvailable,
  savePattern,
  getSavedPatterns,
  QueryPattern
} from '../../../redux/actions/savedPatternsActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/pro-light-svg-icons';
import EidosCheckbox from '../../../../shared/ui/components/eidosCheckbox/EidosCheckbox';
import { listQueryPatterns } from '../../../graphql/queries';

type Props = {
  saveAsPatternModalTitle?: string;
  data?: QueryPattern;
  handleopen?: Function;
  handleClose?: Function;
  isOpen?: boolean;
  title?: string;
  buttonTitle?: string;
  document?: string;
};

export type State = {
  actions: Array<ModalAction>;
  filters: Array<ILibraryFilter>;
  inputName: string;
  inputDescription: string;
  touchedInput: boolean;
  showModal: boolean;
  includeSaveSettings: boolean;
  checkingNameAvailability: boolean;
};

class SaveAsPath extends React.Component<any, State> {
  constructor(props: any) {
    super(props);

    this.state = {
      actions: [],
      filters: [],
      inputName: '',
      touchedInput: false,
      inputDescription: '',
      showModal: props.isOpen,
      includeSaveSettings: false,
      checkingNameAvailability: false
    };
  }

  componentDidUpdate(prevProps: Readonly<any>) {
    const pattern = this.props.data || {};

    if (prevProps.isOpen !== this.props.isOpen) {
      this.setState({
        showModal: this.props.isOpen,
        inputDescription: pattern.description || '',
        inputName: pattern.name || '',
        touchedInput: false,
        checkingNameAvailability: false
      });
      this.props.updateSavePatternNameAvailable(true);
    }
  }

  saveAsPath = async () => {
    const { inputName, inputDescription } = this.state;
    const {
      filters,
      savePattern,
      getSavedPatterns,
      data: pattern,
      selectedColumns,
      groupBySelectedColumns,
      isUpdate,
      document
    } = this.props;
    const { includeSaveSettings } = this.state;

    try {
      let selectedColumnsToSave = [];
      let groupBySelectedColumnsToSave = [];
      // First save scenario
      // include settings is checked
      if (includeSaveSettings) {
        selectedColumnsToSave = selectedColumns;
        groupBySelectedColumnsToSave = groupBySelectedColumns;
      }
      // Update Scenario
      else if (isUpdate) {
        selectedColumnsToSave = pattern.selectedColumns;
        groupBySelectedColumnsToSave = pattern.groupbyColumns;
      }
      const patternToSave: QueryPattern = {
        document,
        name: inputName,
        description: inputDescription,
        selectedColumns: selectedColumnsToSave,
        groupbyColumns: groupBySelectedColumnsToSave,
        filters: isUpdate ? pattern.filters : getFilterDTOData(filters),
        createdAt: pattern ? pattern.createdAt : new Date().toISOString()
      };

      // Call action creator to save
      const previousName = isUpdate && pattern.name;
      await savePattern(patternToSave, previousName);

      // Reset form
      this.setState({
        inputDescription: '',
        inputName: '',
        touchedInput: false,
        includeSaveSettings: false,
        checkingNameAvailability: false
      });

      // Close modal
      this.props.handleClose();

      // Call action creator to update list
      await getSavedPatterns();
    } catch (e) {
      console.error(e);
    }
  };

  isPatternNameAvailable = async (savePatternName: string) => {
    try {
      const { data: pattern = {} } = this.props;
      if (!savePatternName || savePatternName === pattern.name) {
        return null;
      }
      this.setState({ checkingNameAvailability: true });
      const {
        data: { listQueryPatterns: listPatterns }
      } = (await API.graphql(
        graphqlOperation(listQueryPatterns, {
          filter: {
            name: { eq: savePatternName }
          }
        })
      )) as {
        data: {
          listQueryPatterns: { items: any };
        };
      };

      if (listPatterns && listPatterns.items.length) {
        this.props.updateSavePatternNameAvailable(false);
      } else {
        this.props.updateSavePatternNameAvailable(true);
      }
    } catch (e) {
      console.error(e);
    }
    this.setState({ checkingNameAvailability: false });
  };

  renderCheckbox = () => {
    const { showSettingsCheckbox, data = {} } = this.props;
    const { includeSaveSettings } = this.state;

    if (!showSettingsCheckbox || data.id) return null;
    return (
      <Form.Field>
        <pre>{includeSaveSettings}</pre>
        <EidosCheckbox
          checked={includeSaveSettings}
          onChange={(e: any, data: any) =>
            this.setState({ includeSaveSettings: !includeSaveSettings })
          }
          id="saveAsIncludeSettings"
          label="Include table settings"
        />
      </Form.Field>
    );
  };

  renderNameErrorMessage = () => {
    const { isPatternNameAvailable } = this.props;
    const { inputName } = this.state;

    if (!inputName.length) return null;
    if (isPatternNameAvailable) return null;

    return (
      <Message className="transparent">
        <FontAwesomeIcon icon={faExclamationCircle} className="red" />
        This pattern name already exists. Please enter a unique name.
      </Message>
    );
  };

  render() {
    const {
      isPatternNameAvailable,
      title,
      handleClose,
      buttonTitle
    } = this.props;
    const {
      inputName,
      inputDescription,
      touchedInput,
      showModal,
      checkingNameAvailability
    } = this.state;
    const isValid = inputName.length && isPatternNameAvailable;

    return (
      <EidosModal
        modalTitle={title || 'Save Pattern'}
        closeOnOutSideClick={false}
        size="tiny"
        actions={[
          {
            text: buttonTitle || 'Save Pattern',
            action: () => this.saveAsPath(),
            position: 'left',
            disabled: !isValid || this.props.loading || checkingNameAvailability
          },
          {
            text: 'Cancel',
            action: handleClose,
            position: 'left',
            disabled: false,
            type: 'text'
          }
        ]}
        modalOpen={showModal}
        handleClose={handleClose}
      >
        <div className="ui form">
          <Form.Field
            required
            className={touchedInput && !isValid ? 'invalid' : ''}
          >
            <label className="required">Name</label>
            <Input
              id="saveAsName"
              type="text"
              placeholder="Type a custom filter pattern name"
              onBlur={() => this.isPatternNameAvailable(inputName)}
              onChange={(e, data) =>
                this.setState({ inputName: data.value, touchedInput: true })
              }
              value={inputName}
              maxLength={35}
            />
            <span className="char-count">
              {inputName ? inputName.length : 0}/35
            </span>
          </Form.Field>
          {this.renderNameErrorMessage()}
          <Form.Field>
            <label>Description</label>
            <TextArea
              id="saveAsDescription"
              placeholder="Type a description for your filter pattern"
              onChange={(e, data: any) =>
                this.setState({ inputDescription: data.value })
              }
              maxLength={200}
              value={inputDescription}
            />
            <span className="char-count">
              {inputDescription ? inputDescription.length : 0}/200
            </span>
          </Form.Field>
          {this.renderCheckbox()}
        </div>
      </EidosModal>
    );
  }
}

const mapStateToProps = (state: any, ownProps: Props) => {
  const { layout, filters, savedPatterns } = state;
  const {
    savePatternName,
    savePatternDescription,
    isPatternNameAvailable,
    loading
  } = savedPatterns;
  const {
    saveAsPatternModalTitle,
    editPatternValue,
    documentId: document
  } = layout;

  return {
    ...ownProps,
    filters: getFiltersState(filters),
    showSettingsCheckbox: filters.selectedColumns.length >= 1,
    selectedColumns: filters.selectedColumns,
    groupBySelectedColumns: filters.groupBySelectedColumns,
    savePatternName,
    savePatternDescription,
    isPatternNameAvailable,
    saveAsPatternModalTitle,
    editPatternValue,
    loading,
    document
  };
};

export default connect(
  mapStateToProps,
  {
    updateSavePatternNameAvailable,
    savePattern,
    getSavedPatterns
  }
)(SaveAsPath);
