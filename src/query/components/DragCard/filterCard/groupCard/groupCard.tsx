import React from 'react';
import { connect } from 'react-redux';
import { Button, ButtonGroup, Card, Popup } from 'semantic-ui-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimesCircle,
  faChevronCircleUp,
  faChevronCircleDown
} from '@fortawesome/pro-light-svg-icons';

import { ILibraryFilter } from '../../../layout/layoutTypes';
import FilterCard from '../filterCard';
import {
  changeFilterConnector,
  removeFilterFromPath,
  //toggleEditGroupTitleMode,
  toggleFilterOpened,
  updateGroupName,
  //updateTempGroupName,
  closeFilter,
  openFilter,
  updateDraggedFilterId
} from '../../../../redux/actions';
import BooleanConnector, {
  ConnectorType
} from '../../../booleanConnector/booleanConnector';
import EditableLabel, {
  EditableLabelValidation
} from '../../../../../shared/ui/components/EditableLabel';
const Sortable = require('react-sortablejs');

type Props = {
  card: any;
  index: number;
  parentDropPrevented: boolean;
  //editTitle?: boolean;
  //tempTitleEdit?: string;
};

type FilterCardState = {
  hovered: boolean;
  isOpened: boolean;
};

class GroupCard extends React.Component<any, FilterCardState> {
  constructor(props: any) {
    super(props);
    this.state = {
      hovered: false,
      isOpened: true
    };
  }

  changeConnector = (el: any, data: any) =>
    this.props.changeFilterConnector(this.props.card.id, data.value);

  openFilter = (evt: any) => {
    evt.preventDefault();
    evt.stopPropagation();
    this.setState({ isOpened: !this.state.isOpened });
  };

  onDragEnd = (event: any) => {
    this.props.onDragEnd(event);
  };

  renderCardHeader = () => {
    const {
      card,
      isDraggedFilterSelected,
      selected,
      selectionPrevented,
      filterIdSelectionAttempted,
      filterIdBeingDragged
    } = this.props;
    const { hovered } = this.state;
    const dropPrevented: boolean =
      isDraggedFilterSelected &&
      selected &&
      hovered &&
      filterIdBeingDragged !== card.id;

    const selectPrevented: boolean =
      selectionPrevented && filterIdSelectionAttempted === card.id;
    let tooltipMessage: string = '';

    if (dropPrevented) {
      tooltipMessage = 'You cannot place a selected object inside of itself.';
    } else if (selectPrevented) {
      tooltipMessage = 'You cannot select a group and also its contents.';
    }
    return (
      <Popup
        size={'small'}
        wide="very"
        position={'bottom left'}
        open={dropPrevented || selectPrevented}
        popperDependencies={[dropPrevented, filterIdBeingDragged]}
        trigger={
          <Card.Meta className={'class-name'}>{card.className}</Card.Meta>
        }
      >
        {tooltipMessage}
      </Popup>
    );
  };

  renderOrderNumber = () => {
    const { card, index } = this.props;
    if (card.depth > 0) return null;

    return <span className="order">{index + 1}</span>;
  };

  render() {
    const {
      card,
      childsLength,
      index,
      contextLength,
      nodeConnector,
      selected,
      openDeleteModal,
      isDraggedFilterSelected,
      filterIdBeingDragged
    } = this.props;

    const { hovered } = this.state;

    let isOpened = this.state.isOpened;
    // Collapse while dragging
    if (filterIdBeingDragged === card.id) {
      isOpened = false;
    }

    return (
      <div
        className={
          (selected
            ? 'filter-card-wrapper selected '
            : 'filter-card-wrapper ') +
          (isDraggedFilterSelected &&
          selected &&
          hovered &&
          filterIdBeingDragged !== card.id
            ? ' drop-disabled'
            : '')
        }
        onMouseEnter={() => this.setState({ hovered: true })}
        onMouseLeave={() => this.setState({ hovered: false })}
      >
        <div
          onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            this.props.manageSelection(e);
          }}
        >
          <Card
            className={
              'card-group' +
              (isOpened ? ' expanded' : ' collapsed') +
              ' depth-' +
              (card.depth >= 2 ? 2 : card.depth)
            }
          >
            {this.renderOrderNumber()}
            <Card.Content className="drag-handle">
              <ButtonGroup floated="right">
                <Button
                  icon
                  basic
                  simple="true"
                  className={'xs animate'}
                  onClick={this.openFilter}
                  id={'size-' + card.id}
                >
                  <FontAwesomeIcon
                    className="icon"
                    icon={isOpened ? faChevronCircleUp : faChevronCircleDown}
                    aria-label={isOpened ? 'Close Card' : 'Open Card'}
                  />
                </Button>
                <Button
                  icon
                  basic
                  simple="true"
                  className={'xs animate'}
                  id={'remove-' + card.id}
                  onClick={() => openDeleteModal(card.id)}
                >
                  <FontAwesomeIcon
                    className="icon"
                    icon={faTimesCircle}
                    aria-label="Remove Card"
                  />
                </Button>
              </ButtonGroup>
              {this.renderCardHeader()}

              <Card.Header>
                <EditableLabel
                  originalValue={card.displayName}
                  onChange={(newName: string) =>
                    Promise.resolve(
                      this.props.updateGroupName(card.id, newName)
                    )
                  }
                  charCountEnabled={true}
                  inputProps={{
                    maxLength: 35,
                    pattern: '^[A-Za-z0-9 -]+$',
                    placeholder: 'Type a custom title and hit enter to save'
                  }}
                  onValidation={(validation: EditableLabelValidation) =>
                    validation.valid ? '' : 'Invalid Pattern'
                  }
                  tooltipOnTop={true}
                />
              </Card.Header>
            </Card.Content>
            <Card.Content
              extra
              className={
                isOpened || !card.filters.length
                  ? 'animate'
                  : 'animate animate-hide'
              }
            >
              <Card.Description>
                <Sortable
                  options={{
                    group: {
                      name: 'filters',
                      pull: true,
                      revertClone: true,
                      put: () => {
                        return (
                          !(
                            this.props.isDraggedFilterSelected &&
                            this.props.selected
                          ) && !this.props.parentDropPrevented
                        );
                      } // allow items to be put into this list
                    },
                    handle: '.drag-handle',
                    animation: 0,
                    direction: 'vertical',
                    forceFallback: true,
                    fallbackClass: 'dragged-shadow',
                    preventOnFilter: false,
                    filter: '.buttons,.editable-label',
                    fallbackOnBody: true,
                    fallbackTolerance: 15,
                    invertSwap: false,
                    swapThreshold: 0.15,
                    sort: true,
                    dragoverBubble: true,
                    delay: 80,
                    touchStartThreshold: 20,
                    onChange: (e: any, a: any) => {
                      if (!this.props.dropAllowed && e.from.id !== 'filters') {
                        document.body.style.cursor = 'not-allowed';
                      }
                    },
                    onChoose: (evt: any) => {
                      if (evt && evt.item && evt.item.id) {
                        document.body.style.cursor = 'grabbing';
                        this.props.updateDraggedFilterId(evt.item.id);
                      }
                    },
                    onUnchoose: () => {
                      document.body.style.cursor = 'initial';
                      this.props.updateDraggedFilterId('');
                    }
                  }}
                  className="draggable-card-list"
                  id={card.id}
                  onChange={(draggedId: any, o: any, evt: any) =>
                    this.onDragEnd(evt)
                  }
                >
                  {card.filters.map((filter: ILibraryFilter, index: number) => {
                    return (
                      <FilterCard
                        card={filter}
                        id={filter.id}
                        key={filter.id}
                        index={index}
                        contextLength={childsLength}
                        onDragEnd={this.onDragEnd}
                        openDeleteModal={openDeleteModal}
                        parentDropPrevented={
                          (isDraggedFilterSelected &&
                            selected &&
                            hovered &&
                            filterIdBeingDragged !== card.id) ||
                          this.props.parentDropPrevented
                        }
                      />
                    );
                  })}
                </Sortable>
              </Card.Description>
            </Card.Content>
          </Card>
        </div>
        {index === contextLength - 1 ? (
          ''
        ) : (
          <BooleanConnector
            id={card.id}
            value={nodeConnector}
            changeHandler={this.changeConnector}
            hasConnector={true}
            type={ConnectorType.FILTER}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state: any, ownProps: Props) => {
  const { filters } = state;
  return {
    ...ownProps,
    selected: ownProps.card.selected,
    nodeConnector: ownProps.card.nodeConnector,
    childsLength: ownProps.card.filters.length,
    editTitle: ownProps.card.editTitle,
    tempTitleEdit: ownProps.card.tempTitleEdit,
    isOpened: ownProps.card.isOpen,
    hover: ownProps.card.hover,
    filterIdBeingDragged: filters.filterIdBeingDragged,
    isCardBeingClicked: filters.isCardBeingClicked,
    isDraggedFilterSelected: filters.isDraggedFilterSelected,
    dropAllowed: filters.dropAllowed,
    selectionPrevented: filters.selectionPrevented,
    filterIdSelectionAttempted: filters.filterIdSelectionAttempted
  };
};

export default connect(mapStateToProps, {
  removeFilterFromPath,
  //toggleEditGroupTitleMode,
  updateGroupName,
  //updateTempGroupName,
  updateDraggedFilterId,
  changeFilterConnector,
  toggleFilterOpened,
  closeFilter,
  openFilter
})(GroupCard);
