import React from 'react';
import { connect } from 'react-redux';
import { Button, ButtonGroup, Card, Popup } from 'semantic-ui-react';

import {
  changeFilterConnector,
  removeFilterFromPath,
  toggleFilterOpened
} from '../../../../redux/actions';
import BooleanConnector, {
  ConnectorType
} from '../../../booleanConnector/booleanConnector';
import AddFilterParameters from '../../../filterParameters/addFilterParameters';
import FilterParameters from '../../../filterParameters/filterParameters';
import { ILibraryFilter } from '../../../layout/layoutTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimesCircle,
  faChevronCircleDown,
  faChevronCircleUp
} from '@fortawesome/pro-light-svg-icons';

type Props = {
  card: ILibraryFilter;
  index: number;
  isSimpleCard: boolean;
  selected?: boolean;
  hover?: boolean;
  filterIdBeingDragged?: string;
  selectionPrevented?: boolean;
  filterIdSelectionAttempted?: string;
  filterCriteriaLength?: number;
  contextLength?: number;
  manageSelection: any;

  changeFilterConnector?: any;
  toggleFilterOpened?: any;
  removeFilterFromPath?: any;
  nodeConnector?: any;
  filterSelection?: any;
  toggleFilterSelection?: any;
  bulkToggleFilterSelection?: any;
};

type FilterCardState = {};

class SimpleCard extends React.Component<Props, FilterCardState> {
  state = {
    isOpened: true
  };

  changeConnector = (el: any, data: any) =>
    this.props.changeFilterConnector(this.props.card.id, data.value);

  openFilter = (evt: any) => {
    evt.preventDefault();
    evt.stopPropagation();
    this.setState({ isOpened: !this.state.isOpened });
  };

  remove = (evt: any) => {
    evt.preventDefault();
    const { card, removeFilterFromPath } = this.props;
    removeFilterFromPath(card.id);
  };

  renderBooleanConnector = () => {
    const { contextLength, index, card, nodeConnector } = this.props;

    if (contextLength && index === contextLength - 1) return null;

    return (
      <BooleanConnector
        id={card.id}
        value={nodeConnector}
        changeHandler={this.changeConnector}
        hasConnector={true}
        type={ConnectorType.FILTER}
      />
    );
  };

  renderCardHeader = () => {
    const { card, selectionPrevented, filterIdSelectionAttempted } = this.props;
    return (
      <Popup
        size={'small'}
        wide="very"
        position={'bottom left'}
        open={selectionPrevented && filterIdSelectionAttempted === card.id}
        trigger={
          <Card.Meta className={'class-name'}>{card.className}</Card.Meta>
        }
      >
        You cannot select a group and also its contents.
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
      filterCriteriaLength,
      selected,
      isSimpleCard,
      filterIdBeingDragged
    } = this.props;

    let isOpened = this.state.isOpened;
    // Collapse while dragging
    if (filterIdBeingDragged === card.id) {
      isOpened = false;
    }

    return (
      <div
        className={
          selected ? 'filter-card-wrapper selected' : 'filter-card-wrapper'
        }
        id={!isSimpleCard ? card.id : ''}
      >
        <div
          onClick={(e: React.MouseEvent<HTMLDivElement>) =>
            this.props.manageSelection(e)
          }
        >
          <Card className={isOpened ? 'expanded' : 'collapsed'}>
            {this.renderOrderNumber()}
            <Card.Content className="drag-handle">
              <ButtonGroup floated="right">
                <Button
                  icon
                  basic
                  simple="true"
                  className={
                    card.parsedSchema &&
                    card.parsedSchema.params &&
                    card.parsedSchema.params.length
                      ? 'xs animate'
                      : 'xs animate animate-hide'
                  }
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
                  onClick={this.remove}
                  id={'remove-' + card.id}
                >
                  <FontAwesomeIcon
                    className="icon"
                    size="xs"
                    icon={faTimesCircle}
                    aria-label="Remove Card"
                  />
                </Button>
              </ButtonGroup>
              {this.renderCardHeader()}

              <Card.Header>{card.displayName}</Card.Header>
            </Card.Content>
            <Card.Content
              extra
              className={
                isOpened && filterCriteriaLength
                  ? 'animate'
                  : 'animate animate-hide'
              }
            >
              <Card.Description>
                <FilterParameters card={card} />
              </Card.Description>
            </Card.Content>
            <Card.Content
              extra
              className={
                isOpened &&
                card.parsedSchema &&
                card.parsedSchema.params &&
                card.parsedSchema.params.length
                  ? 'animate'
                  : 'animate animate-hide'
              }
            >
              <AddFilterParameters card={card} />
            </Card.Content>
          </Card>
        </div>
        {this.renderBooleanConnector()}
      </div>
    );
  }
}

const mapStateToProps = (state: any, ownProps: Props) => {
  const { filters } = state;
  return {
    selected: ownProps.card.selected,
    nodeConnector: ownProps.card.nodeConnector,
    hover: ownProps.card.hover,
    filterIdBeingDragged: filters.filterIdBeingDragged,
    filterCriteriaLength: ownProps.card.filterCriteria.length,
    selectionPrevented: filters.selectionPrevented,
    filterIdSelectionAttempted: filters.filterIdSelectionAttempted
  };
};

export default connect(
  mapStateToProps,
  {
    removeFilterFromPath,
    changeFilterConnector,
    toggleFilterOpened
  }
)(SimpleCard);
