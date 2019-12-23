import React from 'react';
import { Menu, Container, Header, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/pro-light-svg-icons';

// Local imports
import {
  removeAllFiltersFromPath,
  clearAllFiltersOnPath,
  groupSelectedFilters,
  ungroupSelectedFilters
} from '../../../../redux/actions';
import * as apiservice from '../../../../../shared/ui/services/apiservice';
import { getFilterDTOData } from '../../../../utils/filterDataService';
import {
  getFiltersState,
  getGroupEnable,
  getUngroupEnable
} from '../../../../redux/selectors/filter/filterSelector';
import {
  toggleFilterPath,
  toggleScrollEffect
} from '../../../../redux/actions';
import SaveAsPath from '../../../modals/saveAsPath/saveAsPath';
import { Context } from '../../../../../shared/ui/main/main';

type Props = {
  pathScroll?: boolean;
};

type State = {
  modalOpen: boolean;
};

class FilterMenu extends React.Component<any, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      modalOpen: false
    };
  }

  deleteAll = () => {
    this.props.removeAllFiltersFromPath();
    this.props.toggleScrollEffect(false, undefined, undefined);
  };
  clearAll = () => this.props.clearAllFiltersOnPath();
  getJsonFile = async () => {
    if (this.props.filters.length === 0) return;
    apiservice
      .httpDownloadFile(
        '/downloadFile',
        { jsonDto: getFilterDTOData(this.props.filters) },
        {}
      )
      .then((respo: any) => {
        const url = window.URL.createObjectURL(
          new Blob([`{"filters": ${respo.data}}`])
        );
        const link = document.createElement('a');
        link.href = url;
        const ts = format(new Date(), 'YYYYMMDDHHmmss');
        link.setAttribute('download', `EidosAlpha_FilterPattern_${ts}.json`);
        document.body.appendChild(link);
        link.click();
      });
  };

  groupFilters = () => this.props.groupSelectedFilters();
  ungroupFilters = () => this.props.ungroupSelectedFilters();
  togglePath = () => this.props.toggleFilterPath();

  renderDrawerOpener = () => {
    const { showDrawer, setShowDrawer } = this.props;
    if (showDrawer) return null;

    return (
      <Button
        basic
        className="icon background"
        onClick={e => {
          e.stopPropagation();
          setShowDrawer(true);
        }}
      >
        <FontAwesomeIcon icon={faPlus} />
      </Button>
    );
  };

  render() {
    const {
      filterPathLength,
      pathScroll,
      isGroupEnable,
      isUngroupEnable,
      expandPane,
      showResults
    } = this.props;
    const { modalOpen } = this.state;

    return (
      <div
        onClick={expandPane}
        className={
          'filter-menu-wrapper menu-wrapper' +
          (!pathScroll || filterPathLength === 0 ? '' : ' shadow') +
          (showResults ? ' hover' : '')
        }
      >
        <Context.Consumer>
          {value => (
            <SaveAsPath
              isOpen={modalOpen}
              document={value.documentId}
              handleClose={() => this.setState({ modalOpen: false })}
              title="Save Pattern"
              buttonTitle="Save Pattern"
            />
          )}
        </Context.Consumer>

        <Menu
          text
          attached="top"
          tabular
          className={'drawer-top sticky' + (pathScroll ? ' shadow' : '')}
        >
          {this.renderDrawerOpener()}
          <Container fluid>
            <Header as="h2">Query Pattern</Header>
            <Menu.Item
              id="menuItemSaveAs"
              disabled={filterPathLength === 0}
              onClick={e => {
                e.stopPropagation();
                this.setState({ modalOpen: true });
              }}
            >
              Save
            </Menu.Item>
            <span className="item separator" />
            <Menu.Item
              id="groupBtn"
              onClick={e => {
                e.stopPropagation();
                this.groupFilters();
              }}
              disabled={!isGroupEnable}
            >
              Group
            </Menu.Item>
            <Menu.Item
              id="ungroupBtn"
              onClick={e => {
                e.stopPropagation();
                this.ungroupFilters();
              }}
              disabled={!isUngroupEnable}
            >
              Ungroup
            </Menu.Item>
            <span className="item separator" />
            <Menu.Item
              onClick={e => {
                e.stopPropagation();
                this.clearAll();
              }}
              disabled={!filterPathLength}
              id="clearValues"
            >
              Clear Values
            </Menu.Item>
            <Menu.Item
              onClick={e => {
                e.stopPropagation();
                this.deleteAll();
              }}
              disabled={!filterPathLength}
              id="deleteAllFilters"
            >
              Delete Pattern
            </Menu.Item>
          </Container>
        </Menu>
      </div>
    );
  }
}

const mapStateToProps = (state: any, ownProps: Props) => {
  const { layout, filters } = state;

  return {
    ...ownProps,
    filters: getFiltersState(filters),
    filterPathLength: getFiltersState(filters).length,
    filterPathVisible: layout.filterPathVisible,
    libraryVisible: layout.libraryVisible,
    isGroupEnable: getGroupEnable(filters),
    isUngroupEnable: getUngroupEnable(filters),
    pathScroll: state.layout.pathScroll
  };
};

export default connect(
  mapStateToProps,
  {
    removeAllFiltersFromPath,
    clearAllFiltersOnPath,
    groupSelectedFilters,
    ungroupSelectedFilters,
    toggleFilterPath,
    toggleScrollEffect
  }
)(FilterMenu);
