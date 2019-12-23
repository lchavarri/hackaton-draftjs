import React, { UIEvent } from 'react';
import { Card } from 'semantic-ui-react';
import { connect } from 'react-redux';
// Ignoring because lib does not include typings
// @ts-ignore
import Sortable from 'react-sortablejs';

import {
  toggleScrollEffect,
  deletePattern,
  getSavedPatterns,
  filterDragStarted,
  filterDragEnded,
  QueryPattern
} from '../../../../redux/actions';
import { IColumnDataDto } from '../../../../../shared/core/index';
import SavedCard from '../../../DragCard/savedCard/savedCard';
import SaveAsPath from '../../../modals/saveAsPath/saveAsPath';
import DeleteModal from '../../../modals/deleteModal/deleteModal';
import { Context } from '../../LayoutMax';

type Props = {
  savedPatternStageVisible: boolean;
  toggleScrollEffect: Function;
  patterns: Array<QueryPattern>;
  highlighted: string;
  noResults: boolean;
  loading?: boolean;
  getSavedPatterns: Function;
  deletePattern: Function;
  filterDragStarted: Function;
  filterDragEnded: Function;
  onScroll: (event: UIEvent<HTMLDivElement>) => void;
  splitPosition?: boolean;
  document: string;
};

type State = {
  editModalOpen: boolean;
  deleteModalOpen: boolean;
};

class SavedPatternsList extends React.Component<Props, State> {
  patternToEdit: QueryPattern | undefined;
  patternToDelete: QueryPattern | undefined;
  constructor(props: Props) {
    super(props);
    this.state = {
      editModalOpen: false,
      deleteModalOpen: false
    };
  }

  openEditModal = (pattern: QueryPattern) => {
    this.patternToEdit = pattern;
    this.setState({ editModalOpen: true });
  };

  openDeleteModal = (pattern: QueryPattern) => {
    this.patternToDelete = pattern;
    this.setState({ deleteModalOpen: true });
  };

  handleDeletePattern = async () => {
    if (!this.patternToDelete) {
      return;
    }

    const { deletePattern, getSavedPatterns } = this.props;
    const { document, name } = this.patternToDelete;
    try {
      await deletePattern(document, name);
      this.setState({ deleteModalOpen: false });

      await getSavedPatterns();
    } catch (e) {}
  };

  handleScroll = (e: any) =>
    this.props.toggleScrollEffect(
      undefined,
      undefined,
      undefined,
      e.target.scrollTop > 1
    );

  //TODO: get clumnsFilters & groupByColumns
  selectedColumnFilters: Array<IColumnDataDto> = [];
  groupbyColumns: Array<IColumnDataDto> = [];

  renderCards = () => {
    const { patterns, highlighted, loading, document } = this.props;

    if (loading) {
      return 'Loading data';
    }

    if (!patterns) {
      return null;
    }

    return patterns.map((pattern: QueryPattern) => {
      return (
        <SavedCard
          key={pattern.name}
          pattern={pattern}
          isOwner={pattern.document === document}
          highlighted={highlighted}
          openEditModal={this.openEditModal}
          openDeleteModal={this.openDeleteModal}
        />
      );
    });
  };

  renderSortable = () => {
    const { patterns, noResults, loading } = this.props;

    if (loading) {
      return 'Loading data';
    }

    if (noResults) {
      return <h4>No results found.</h4>;
    }

    if (!patterns.length) {
      return (
        <div className="saved-empty">
          <h4>No Saved Patterns Yet</h4>
          <p>
            Once you have created a pattern, save it by using the pattern menu.
          </p>
        </div>
      );
    }

    return (
      <div className="group-container">
        <Context.Consumer>
          {value => (
            <Sortable
              options={{
                group: {
                  name: 'filters',
                  pull: true,
                  revertClone: true,
                  put: false
                },
                handle: '.drag-handle',
                animation: 150,
                direction: 'vertical',
                forceFallback: true,
                fallbackClass: 'dragged-shadow',
                filter: '.buttons',
                fallbackOnBody: false,
                fallbackTolerance: 5,
                invertSwap: false,
                swapThreshold: 0.15,
                sort: false,
                scroll: true,
                scrollSensitivity: 20, // px, how near the mouse must be to an edge to start scrolling.
                scrollSpeed: 15, // px
                bubbleScroll: true, // apply autoscroll to all parent elements, allowing for easier movement
                dragoverBubble: true,
                delay: 0,
                onClone: (evt: any) => {
                  value.expandPane(0, !!this.props.splitPosition);
                },
                onChoose: (e: any) => {
                  document.body.style.cursor = 'grabbing';
                  this.props.filterDragStarted();
                },
                onUnchoose: (e: any) => {
                  document.body.style.cursor = 'initial';
                  this.props.filterDragEnded();
                }
              }}
              className="filter-path-draggable-card-list"
              id="savedFilterPatterns"
              onChange={(draggedId: any, o: any, evt: any) => {}} //this.onDragEnd(evt)}
            >
              {this.renderCards()}
            </Sortable>
          )}
        </Context.Consumer>
      </div>
    );
  };

  getModalActions = () => {
    return [
      {
        text: 'DELETE PATTERN',
        action: () => this.handleDeletePattern(),
        position: 'left',
        type: 'red basic',
        disabled: this.props.loading
      },
      {
        text: 'CANCEL',
        type: 'text',
        action: () => this.setState({ deleteModalOpen: false }),
        position: 'left',
        disabled: this.props.loading
      }
    ];
  };

  render() {
    const { onScroll } = this.props;
    const { editModalOpen, deleteModalOpen } = this.state;

    return (
      <>
        <div className="filter-library" onScroll={onScroll}>
          <div className="container-scrollable">
            <Card.Group className="cards-library">
              {this.renderSortable()}
            </Card.Group>
          </div>
        </div>
        <SaveAsPath
          isOpen={editModalOpen}
          handleClose={() => this.setState({ editModalOpen: false })}
          title="Edit Pattern"
          buttonTitle="Save Details"
          data={this.patternToEdit}
          isUpdate={true}
        />
        <DeleteModal
          modalOpen={deleteModalOpen}
          handleClose={() => this.setState({ deleteModalOpen: false })}
          actions={this.getModalActions()}
          title="DELETE PATTERN?"
          content="This pattern will be deleted for all Eidos users forever. Are you sure you want to continue?"
        />
      </>
    );
  }
}

const mapStateToProps = (state: any, ownProps: any) => {
  const { savedPatterns, layout } = state;

  return {
    ...ownProps,
    loading: savedPatterns.loading,
    splitPosition: layout.splitPosition,
    document: layout.documentId
  };
};

export default connect(
  mapStateToProps,
  {
    toggleScrollEffect,
    deletePattern,
    getSavedPatterns,
    filterDragStarted,
    filterDragEnded
  }
)(SavedPatternsList);
