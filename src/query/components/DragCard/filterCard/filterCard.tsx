import './filterCard.scss';

import React from 'react';
import { connect } from 'react-redux';

import { isMultiDrag } from '../../../redux/selectors/filter/filterSelector';
import GroupCard from './groupCard/groupCard';
import SimpleCard from './simpleCard/simpleCard';
import { FilterType } from '../../layout/layoutTypes';
import {
  filterSelection,
  toggleFilterSelection,
  bulkToggleFilterSelection,
  toggleFilterSelectionPrevented
} from '../../../redux/actions';

type Props = {
  card: any;
  index: number;
  contextLength: number;
  id: string;
  parentDropPrevented?: boolean;
};

const FORBIDDEN_DISPLAY_TIME = 2750;

class FilterCard extends React.Component<any, any> {
  forbidenTimeout: any;
  constructor(props: any) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  // Using onClick as it will be correctly
  // preventing if there was a drag
  onClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.defaultPrevented) {
      return;
    }
    // marking the event as used
    event.preventDefault();

    // If cancelled dragging mid air - Prevent default and do NOT performAction
    if (this.props.filterIdBeingDragged) {
      return;
    }

    this.performAction(event);
  };

  // Determines if the multiSelect key was used
  wasControlSelectKeyUsed = (event: React.MouseEvent<HTMLElement>) =>
    event.ctrlKey || event.metaKey;
  wasMultiSelectKeyUsed = (event: React.MouseEvent<HTMLElement>) =>
    event.shiftKey;

  performAction = (event: React.MouseEvent<HTMLElement>) => {
    const { card } = this.props;

    if (this.wasMultiSelectKeyUsed(event)) {
      this.props.bulkToggleFilterSelection(card.id);

      // on multiple forbidden selections ensure messages are shown the right amount of time
      if (this.forbidenTimeout) {
        clearTimeout(this.forbidenTimeout);
        this.forbidenTimeout = null;
      }

      this.forbidenTimeout = setTimeout(() => {
        // If the action was prevented rollback the blocking icon after a certain amount of time
        this.props.toggleFilterSelectionPrevented();
      }, FORBIDDEN_DISPLAY_TIME);
      return;
    }
    if (this.wasControlSelectKeyUsed(event)) {
      this.props.toggleFilterSelection(card.id);

      // on multiple forbidden selections ensure messages are shown the right amount of time
      if (this.forbidenTimeout) {
        clearTimeout(this.forbidenTimeout);
        this.forbidenTimeout = null;
      }

      this.forbidenTimeout = setTimeout(() => {
        // If the action was prevented rollback the blocking icon after a certain amount of time
        this.props.toggleFilterSelectionPrevented();
      }, FORBIDDEN_DISPLAY_TIME);
      return;
    }
    this.props.filterSelection(card.id);
  };

  render() {
    const {
      card,
      contextLength,
      index,
      onDragEnd,
      isMultipleDrag,
      multiDragCount,
      filterIdBeingDragged,
      openDeleteModal,
      selectionPrevented
    } = this.props;

    if (selectionPrevented) {
      document.body.style.cursor = 'not-allowed';
    } else if (
      !selectionPrevented &&
      document.body.style.cursor !== 'grabbing'
    ) {
      document.body.style.cursor = 'default';
    }

    return (
      <div className="filter-card" key={card.id} id={card.id}>
        {isMultipleDrag &&
        multiDragCount > 1 &&
        card.selected &&
        card.id === filterIdBeingDragged ? (
          <div className={'badge ui label xs animate'}>{multiDragCount}</div>
        ) : (
          ''
        )}
        {card.filterType === FilterType.GROUP ? (
          <GroupCard
            card={card}
            index={index}
            contextLength={contextLength}
            onDragEnd={onDragEnd}
            manageSelection={this.onClick}
            openDeleteModal={openDeleteModal}
            parentDropPrevented={this.props.parentDropPrevented || false}
          />
        ) : (
          <SimpleCard
            card={card}
            index={index}
            isSimpleCard={true}
            contextLength={contextLength}
            manageSelection={this.onClick}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state: any, ownProps: Props) => {
  const { filters } = state;
  const { isMultipleDrag, multiDragCount } = isMultiDrag(filters);

  return {
    ...ownProps,
    filterIdBeingDragged: filters.filterIdBeingDragged,
    isMultipleDrag,
    multiDragCount,
    selectionPrevented: filters.selectionPrevented
  };
};

export default connect(
  mapStateToProps,
  {
    bulkToggleFilterSelection,
    toggleFilterSelection,
    toggleFilterSelectionPrevented,
    filterSelection
  }
)(FilterCard);
