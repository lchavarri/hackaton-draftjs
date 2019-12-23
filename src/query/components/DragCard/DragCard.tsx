import './DragCard.scss';

import React from 'react';
import { connect } from 'react-redux';

import { ILibraryFilter } from '../layout/layoutTypes';
import FilterCard from './filterCard/filterCard';
import LibraryCard from './libraryCard/libraryCard';

type Props = {
  card: ILibraryFilter;
  index: number;
  contextLength: number;
  type: string;
  onDragEnd?: any;
  openDeleteModal: Function;
};

class DragCard extends React.Component<Props> {

  render() {
    const {
      card,
      onDragEnd,
      type,
      index,
      contextLength,
      openDeleteModal
    } = this.props;
    return type === 'library' ? (
      <LibraryCard card={card} index={index} />
    ) : (
      <FilterCard
        card={card}
        id={card.id}
        index={index}
        contextLength={contextLength}
        onDragEnd={onDragEnd}
        openDeleteModal={openDeleteModal}
      />
    );
  }
}

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    ...ownProps
  };
};

export default connect(
  mapStateToProps,
  {}
)(DragCard);
