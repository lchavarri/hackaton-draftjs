import React from 'react';
import { connect } from 'react-redux';
import { Card } from 'semantic-ui-react';

import {
  getFiltersState,
  getLibraryFilterState,
  getFiltersAmount,
  getRawLibraryFilterState
} from '../../../../redux/selectors/filter/filterSelector';
import DragCard from '../../../DragCard/DragCard';
import { IFilter, ILibraryFilter, IFilterGroup } from '../../layoutTypes';
import {
  toggleScrollEffect,
  addFilterToPath,
  reorderFilterOnPath,
  moveFilterToGroup,
  moveFilterWithinGroup,
  moveFilterFromGroupToPath,
  openFilter,
  closeFilter,
  updateDraggedFilterId,
  filterSelection,
  applySavedPattern,
  applySavedPatternToGroup,
  removeFilterFromPath,
  setSelectedColumns,
  buildGroupByDefault,
  reorderSelectedFiltersOnPath,
  moveSelectedFiltersToGroup
} from '../../../../redux/actions';
import * as fileIntegrity from '../../../../utils/filterFileDataService';

import uuid from 'uuid/v4';
import { SavedPattern } from '../../../../redux/reducers/savedPatternsReducer';
import {
  isMultiSelect,
  isFilterAGroup,
  getFilterById,
  isFilterChildOfGroup,
  getFiltersCount,
  getSelectedFilters
} from '../../../../utils/filterPathDataUtils';
import DeleteModal from '../../../modals/deleteModal/deleteModal';

const Sortable = require('react-sortablejs');

type Props = {};

type FilterPathState = {
  modalOpen: boolean;
};

class FilterPath extends React.Component<any, FilterPathState> {
  modalProps = {};

  constructor(props: Props) {
    super(props);
    this.state = { modalOpen: false };
    this.modalProps = {
      title: 'Delete Filter Group?',
      content:
        "Deleting a group will also delete all of the group's contents. Are you sure you want to continue?",
      handleDelete: this.removeFilterFromPath
    };
  }

  handleScroll = (e: any) =>
    this.props.toggleScrollEffect(e.target.scrollTop > 1, undefined, undefined);

  reorder = (startIndex: number, endIndex: number) =>
    this.props.reorderFilterOnPath(startIndex, endIndex);

  getLibraryObject = (el: ILibraryFilter): ILibraryFilter => {
    return Object.assign({}, el, {
      id: 'moved-' + el.id.replace(' ', '') + '--' + uuid(),
      isOpen: true,
      filterCriteria: []
    });
  };

  moveFilterToGroup = (
    destination: string,
    index: number,
    source: string,
    movedElem: string
  ) => {
    const { library } = this.props;
    if (source === 'library') {
      library.forEach((group: IFilterGroup) => {
        group.filters.forEach((el: ILibraryFilter) => {
          if (el.id === movedElem) {
            this.props.moveFilterToGroup(
              destination,
              index,
              source,
              movedElem,
              this.getLibraryObject(el)
            );
          }
        });
      });
    } else {
      this.props.moveFilterToGroup(destination, index, source, movedElem);
    }
  };

  moveFromLibraryToPath = (
    source: Array<IFilterGroup>,
    elementMoved: string,
    index: any
  ) => {
    // find moved filter
    source.forEach((group: IFilterGroup) => {
      group.filters.forEach((el: ILibraryFilter) => {
        if (el.id === elementMoved) {
          this.props.addFilterToPath(this.getLibraryObject(el), index);
        }
      });
    });
  };

  capitalizeString = (phrase: string) => {
    return phrase
      .split(/\s+/)
      .map(function(word: any) {
        return word.charAt(0).toUpperCase() + word.substr(1);
      })
      .join(' ');
  };

  loadFilters = (
    event: any,
    movedId: string,
    destinationId: string,
    isDroppableAGroup: boolean
  ) => {
    const { from, newIndex } = event;
    const {
      savedPatterns,
      rawLibrary,
      currentFilterPatternLength,
      hasDefinedTableSettings
    } = this.props;

    let filtersToApply = savedPatterns.find((saved: SavedPattern) => {
      return saved.id === movedId;
    });

    const selectedColumns = JSON.parse(filtersToApply.selectedColumns);
    const filters = JSON.parse(filtersToApply.filters);
    const groupbyColumns = JSON.parse(filtersToApply.groupbyColumns);
    const filterName = this.capitalizeString(filtersToApply.name);
    const hasSettings = selectedColumns && selectedColumns.length;
    const loadFiltersPromise = (override: boolean) =>
      fileIntegrity
        .checkFileIntegritySync(filters as Array<ILibraryFilter>, rawLibrary)
        .then((resp: any) => {
          if (
            resp.valid &&
            getFiltersCount(resp.filters) + currentFilterPatternLength <= 99
          ) {
            if (
              isDroppableAGroup &&
              from &&
              from.id === 'savedFilterPatterns'
            ) {
              this.props.applySavedPatternToGroup(
                resp.filters,
                destinationId,
                newIndex
              );
            } else {
              this.props.applySavedPattern(resp.filters, newIndex);
            }
            if (override) {
              this.props.setSelectedColumns(selectedColumns);
              this.props.buildGroupByDefault(groupbyColumns);
            }
          }

          this.setState({ modalOpen: false });
        });

    this.modalProps = {
      actions: [
        {
          text: 'Overwrite Settings',
          position: 'left',
          action: () => loadFiltersPromise(true)
        },
        {
          text: 'Keep Current Settings',
          position: 'left',
          action: () => loadFiltersPromise(false)
        },
        {
          text: 'Cancel',
          type: 'text',
          position: 'left',
          action: () => this.setState({ modalOpen: false })
        }
      ],
      title: 'Overwrite Table Settings?',
      content:
        filterName +
        ' includes settings for the results table. What would you like to do?'
    };

    if (hasDefinedTableSettings && hasSettings) {
      this.setState({ modalOpen: true });
    } else {
      loadFiltersPromise(hasSettings);
    }
  };

  onDragEnd = (event: any) => {
    const { clone, from, to, oldIndex, newIndex } = event;
    const {
      filters,
      library,
      currentFilterPatternLength,
      filterIdBeingDragged
    } = this.props;
    const filterIdBeingDraggedCopy = filterIdBeingDragged;

    document.body.style.cursor = 'initial';
    this.props.updateDraggedFilterId('');

    this.props.openFilter(clone.id);
    const movedId = clone.id;
    const destinationId = to ? to.id : '';
    const sourceId = from.id;

    const isMultiSelected = isMultiSelect(filters);
    const isDroppableAGroup = isFilterAGroup(filters, destinationId);

    const isMovedOnPath = filters.some(
      (filter: ILibraryFilter) => filter.id === movedId
    );
    const movedFilter = getFilterById(filters, movedId);
    const isGroupMovement =
      isMultiSelected && movedFilter && movedFilter.selected;

    const isSourceAGroup = isFilterAGroup(filters, sourceId);
    const isMovedOnGroup = isFilterChildOfGroup(
      filters,
      destinationId,
      movedId
    );

    if (
      (from &&
        from.id === 'savedFilterPatterns' &&
        to &&
        to.id === 'filters') ||
      (isDroppableAGroup && from && from.id === 'savedFilterPatterns')
    ) {
      // Apply saved filter pattern into filter path
      this.loadFilters(event, movedId, destinationId, isDroppableAGroup);
    }
    if (
      !to ||
      (to && to.id === from.id && newIndex === oldIndex) ||
      (to && to.id === 'library' && from.id === 'filters') ||
      (to && to.id === 'library' && from.id === 'library') ||
      (to &&
        to.id === 'filters' &&
        from.id === 'filters' &&
        currentFilterPatternLength > 99) ||
      (to &&
        to.id === 'filters' &&
        from.id === 'library' &&
        currentFilterPatternLength >= 99) ||
      (from.id === 'library' &&
        isDroppableAGroup &&
        currentFilterPatternLength >= 99) ||
      filterIdBeingDraggedCopy === to.id
    ) {
      return;
    }

    // Reorder in Filter Pattern
    if (sourceId === destinationId && !isDroppableAGroup) {
      if (!isGroupMovement) {
        this.reorder(oldIndex, newIndex);
      } else {
        this.props.reorderSelectedFiltersOnPath(newIndex, oldIndex);
      }
    }
    // Move filter from path to group
    else if (
      sourceId !== destinationId &&
      isDroppableAGroup &&
      !isMovedOnGroup
    ) {
      if (!isGroupMovement) {
        this.moveFilterToGroup(destinationId, newIndex, sourceId, movedId);
      } else {
        this.props.moveSelectedFiltersToGroup(newIndex, destinationId);
      }
    }
    // Reorder into group
    else if (
      sourceId === destinationId &&
      isDroppableAGroup &&
      isMovedOnGroup
    ) {
      if (!isGroupMovement) {
        this.props.moveFilterWithinGroup(
          destinationId,
          newIndex,
          sourceId,
          movedId
        );
      } else {
        const selectedFilters = getSelectedFilters(filters);
        const directionCorrection =
          oldIndex < newIndex ? 1 - selectedFilters.length : 0;
        this.props.moveSelectedFiltersToGroup(
          newIndex + directionCorrection,
          destinationId
        );
      }
    }
    // Move filter from group to path
    // Move within groups
    else if (
      sourceId !== destinationId &&
      isSourceAGroup &&
      !isMovedOnPath &&
      !isDroppableAGroup
    ) {
      if (!isGroupMovement) {
        this.props.moveFilterFromGroupToPath(
          destinationId,
          newIndex,
          sourceId,
          movedId
        );
      } else {
        this.props.reorderSelectedFiltersOnPath(newIndex, oldIndex);
      }
    }
    // Move from library to filter pattern
    else if (!isMovedOnPath && !isDroppableAGroup) {
      this.moveFromLibraryToPath(library, movedId, newIndex);
    }
  };

  removeFilterFromPath = (target: string) => {
    this.setState({ modalOpen: false });
    this.props.removeFilterFromPath(target);
  };

  openDeleteModal = (target: string) => {
    this.modalProps = {
      title: 'Delete Filter Group?',
      content:
        "Deleting a group will also delete all of the group's contents. Are you sure you want to continue?",
      handleDelete: () => this.removeFilterFromPath(target)
    };
    this.setState({ modalOpen: true });
  };

  // Clear selection if click on empty area
  // Except if the click was already handled or if is the result of a ongoing drag event
  handleClickOnEmptyArea = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.isDefaultPrevented() || this.props.filterIdBeingDragged) {
      return;
    }
    this.props.filterSelection(null);
  };

  /** React sortable JS events cheat sheet
   * 'onChoose',
   * 'onStart',
   * 'onEnd',
   * 'onAdd',
   * 'onUpdate',
   * 'onSort',
   * 'onRemove',
   * 'onFilter',
   * 'onMove',
   * 'onClone'
   */
  render() {
    const { filters } = this.props;
    const { modalOpen } = this.state;

    return (
      <div
        className="filter-path filter-library"
        onClick={this.handleClickOnEmptyArea}
      >
        <div
          className="container-scrollable"
          onScroll={e => this.handleScroll(e)}
        >
          <DeleteModal
            modalOpen={modalOpen}
            handleClose={() => this.setState({ modalOpen: false })}
            {...this.modalProps}
          />
          <Card.Group className="filter-path-cards">
            <Sortable
              options={{
                group: {
                  name: 'filters',
                  pull: true,
                  revertClone: true,
                  put: ['filters']
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
                scroll: true,
                scrollSensitivity: 20, // px, how near the mouse must be to an edge to start scrolling.
                scrollSpeed: 15, // px
                bubbleScroll: true, // apply autoscroll to all parent elements, allowing for easier movement
                dragoverBubble: true,
                delay: 80,
                touchStartThreshold: 20,
                onChange: (e: any, a: any) => {
                  if (!this.props.dropAllowed && e.from.id !== 'filters') {
                    document.body.style.cursor = 'not-allowed';
                  }
                },
                onChoose: (evt: any, a: any) => {
                  if (evt && evt.item && evt.item.id) {
                    document.body.style.cursor = 'grabbing';
                    this.props.updateDraggedFilterId(evt.item.id);
                  }
                },
                onUnchoose: (evt: any) => {
                  document.body.style.cursor = 'initial';
                  this.props.updateDraggedFilterId('');
                }
              }}
              className="filter-path-draggable-card-list"
              id="filters"
              onChange={(draggedId: any, o: any, evt: any) =>
                this.onDragEnd(evt)
              }
            >
              {filters.map((filter: IFilter, index: number) => {
                return (
                  <DragCard
                    card={filter}
                    index={index}
                    contextLength={filters.length}
                    key={index}
                    data-id={filter.id}
                    type="filter"
                    onDragEnd={this.onDragEnd}
                    openDeleteModal={this.openDeleteModal}
                  />
                );
              })}
            </Sortable>
            {filters && filters.length ? (
              ''
            ) : (
              <div className="stage-empty filter-pattern">
                <img
                  alt="info"
                  src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOTIiIGhlaWdodD0iMTExIiBmaWxsPSJub25lIiB2aWV3Qm94PSIwIDAgMjkyIDExMSI+CiAgICA8cGF0aCBzdHJva2U9IiNFNUU1RTUiIGQ9Ik0xNDMuMzc2IDB2MTAwIi8+CiAgICA8cmVjdCB3aWR0aD0iMTMwLjg3IiBoZWlnaHQ9IjM1LjY3MSIgeD0iMTUwLjg2OSIgZmlsbD0iI2ZmZiIgcng9IjIiLz4KICAgIDxyZWN0IHdpZHRoPSI5NS45NzEiIGhlaWdodD0iNS40ODgiIHg9IjE2MS43NzUiIHk9IjIwLjg1NCIgZmlsbD0idXJsKCNhKSIgcng9IjIuNzQ0Ii8+CiAgICA8cmVjdCB3aWR0aD0iNDIuNTMzIiBoZWlnaHQ9IjUuNDg4IiB4PSIxNjEuNzc1IiB5PSI5LjMyOSIgZmlsbD0iI0YwRjBGMCIgcng9IjIuNzQ0Ii8+CiAgICA8cmVjdCB3aWR0aD0iMTMwLjEyIiBoZWlnaHQ9IjM0LjI1IiB4PSIxNTEuMjQ0IiB5PSI2My4zNzUiIHN0cm9rZT0iI0U1RTVFNSIgc3Ryb2tlLWRhc2hhcnJheT0iMiIgc3Ryb2tlLXdpZHRoPSIuNzUiIGZpbHRlcj0idXJsKCNiKSIgcng9IjEuNjI1Ii8+CiAgICA8cmVjdCB3aWR0aD0iMzkuODMiIGhlaWdodD0iMTYuMDI2IiB4PSIxNTEuMjQ0IiB5PSI0MS4zNzUiIHN0cm9rZT0iI0U1RTVFNSIgc3Ryb2tlLWRhc2hhcnJheT0iMiIgc3Ryb2tlLXdpZHRoPSIuNzUiIGZpbHRlcj0idXJsKCNjKSIgcng9IjEuNjI1Ii8+CiAgICA8cGF0aCBmaWxsPSIjRDhEOERBIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xODIuMTg2IDUwLjAxbDEuNzE1LTEuNzQuNDkuNDk3LTIuMjA1IDIuMjM3LTIuMjA2LTIuMjM3LjQ5MS0uNDk3IDEuNzE1IDEuNzR6IiBjbGlwLXJ1bGU9ImV2ZW5vZGQiLz4KICAgIDxyZWN0IHdpZHRoPSIxMzAuODciIGhlaWdodD0iMTguODkyIiB5PSIxIiBmaWxsPSIjZmZmIiByeD0iMiIvPgogICAgPHJlY3Qgd2lkdGg9IjcwLjI0NiIgaGVpZ2h0PSI1LjM5OCIgeD0iMTAuOTUiIHk9IjguMDE3IiBmaWxsPSJ1cmwoI2QpIiByeD0iMi42OTkiLz4KICAgIDxyZWN0IHdpZHRoPSIxMzAuODciIGhlaWdodD0iMTguODkyIiB5PSIzOSIgZmlsbD0iI2ZmZiIgcng9IjIiLz4KICAgIDxyZWN0IHdpZHRoPSI3MC4yNDYiIGhlaWdodD0iNS4zOTgiIHg9IjExLjE1OSIgeT0iNDYuMDE3IiBmaWxsPSJ1cmwoI2UpIiByeD0iMi42OTkiLz4KICAgIDxyZWN0IHdpZHRoPSIxMzAuODciIGhlaWdodD0iMTkuMDIyIiB5PSI3OC4zMjYiIGZpbGw9IiNmZmYiIHJ4PSIyIi8+CiAgICA8cmVjdCB3aWR0aD0iNzAuMjQ2IiBoZWlnaHQ9IjUuNDM1IiB4PSIxMS4xNTkiIHk9Ijg1LjM5MSIgZmlsbD0idXJsKCNmKSIgcng9IjIuNzE3Ii8+CiAgICA8cmVjdCB3aWR0aD0iMTMwLjg3IiBoZWlnaHQ9IjE4Ljg5MiIgeD0iMTAxLjQ0OSIgeT0iNjQiIGZpbGw9IiNmZmYiIGZpbHRlcj0idXJsKCNnKSIgcng9IjIiLz4KICAgIDxyZWN0IHdpZHRoPSI3MC4yNDYiIGhlaWdodD0iNS4zOTgiIHg9IjExMi4zOTkiIHk9IjcxLjAxNyIgZmlsbD0idXJsKCNoKSIgcng9IjIuNjk5Ii8+CiAgICA8ZGVmcz4KICAgICAgICA8ZmlsdGVyIGlkPSJiIiB3aWR0aD0iMTUwLjg3IiBoZWlnaHQ9IjU1IiB4PSIxNDAuODY5IiB5PSI1NiIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIiBmaWx0ZXJVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICAgICAgICA8ZmVGbG9vZCBmbG9vZC1vcGFjaXR5PSIwIiByZXN1bHQ9IkJhY2tncm91bmRJbWFnZUZpeCIvPgogICAgICAgICAgICA8ZmVDb2xvck1hdHJpeCBpbj0iU291cmNlQWxwaGEiIHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMTI3IDAiLz4KICAgICAgICAgICAgPGZlT2Zmc2V0IGR5PSIzIi8+CiAgICAgICAgICAgIDxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjUiLz4KICAgICAgICAgICAgPGZlQ29sb3JNYXRyaXggdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwLjEgMCIvPgogICAgICAgICAgICA8ZmVCbGVuZCBpbjI9IkJhY2tncm91bmRJbWFnZUZpeCIgcmVzdWx0PSJlZmZlY3QxX2Ryb3BTaGFkb3ciLz4KICAgICAgICAgICAgPGZlQmxlbmQgaW49IlNvdXJjZUdyYXBoaWMiIGluMj0iZWZmZWN0MV9kcm9wU2hhZG93IiByZXN1bHQ9InNoYXBlIi8+CiAgICAgICAgPC9maWx0ZXI+CiAgICAgICAgPGZpbHRlciBpZD0iYyIgd2lkdGg9IjYwLjU4IiBoZWlnaHQ9IjM2Ljc3NiIgeD0iMTQwLjg2OSIgeT0iMzQiIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiIgZmlsdGVyVW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgICAgICAgPGZlRmxvb2QgZmxvb2Qtb3BhY2l0eT0iMCIgcmVzdWx0PSJCYWNrZ3JvdW5kSW1hZ2VGaXgiLz4KICAgICAgICAgICAgPGZlQ29sb3JNYXRyaXggaW49IlNvdXJjZUFscGhhIiB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDEyNyAwIi8+CiAgICAgICAgICAgIDxmZU9mZnNldCBkeT0iMyIvPgogICAgICAgICAgICA8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSI1Ii8+CiAgICAgICAgICAgIDxmZUNvbG9yTWF0cml4IHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMC4xIDAiLz4KICAgICAgICAgICAgPGZlQmxlbmQgaW4yPSJCYWNrZ3JvdW5kSW1hZ2VGaXgiIHJlc3VsdD0iZWZmZWN0MV9kcm9wU2hhZG93Ii8+CiAgICAgICAgICAgIDxmZUJsZW5kIGluPSJTb3VyY2VHcmFwaGljIiBpbjI9ImVmZmVjdDFfZHJvcFNoYWRvdyIgcmVzdWx0PSJzaGFwZSIvPgogICAgICAgIDwvZmlsdGVyPgogICAgICAgIDxmaWx0ZXIgaWQ9ImciIHdpZHRoPSIxMzYuODciIGhlaWdodD0iMjQuODkyIiB4PSI5OC40NDkiIHk9IjYzIiBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9InNSR0IiIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgICAgICAgIDxmZUZsb29kIGZsb29kLW9wYWNpdHk9IjAiIHJlc3VsdD0iQmFja2dyb3VuZEltYWdlRml4Ii8+CiAgICAgICAgICAgIDxmZUNvbG9yTWF0cml4IGluPSJTb3VyY2VBbHBoYSIgdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAxMjcgMCIvPgogICAgICAgICAgICA8ZmVPZmZzZXQgZHk9IjIiLz4KICAgICAgICAgICAgPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMS41Ii8+CiAgICAgICAgICAgIDxmZUNvbG9yTWF0cml4IHZhbHVlcz0iMCAwIDAgMCAwLjU2NDcwNiAwIDAgMCAwIDAuNjQzMTM3IDAgMCAwIDAgMC43MTc2NDcgMCAwIDAgMC4xMiAwIi8+CiAgICAgICAgICAgIDxmZUJsZW5kIGluMj0iQmFja2dyb3VuZEltYWdlRml4IiByZXN1bHQ9ImVmZmVjdDFfZHJvcFNoYWRvdyIvPgogICAgICAgICAgICA8ZmVCbGVuZCBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJlZmZlY3QxX2Ryb3BTaGFkb3ciIHJlc3VsdD0ic2hhcGUiLz4KICAgICAgICA8L2ZpbHRlcj4KICAgICAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSItMTg3Mi42MSIgeDI9Ii0xODcxLjU1IiB5MT0iLTEyNi4yNTciIHkyPSIxMDAuOTQ1IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgICAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiNGMEYwRjAiLz4KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRjBGMEYwIi8+CiAgICAgICAgPC9saW5lYXJHcmFkaWVudD4KICAgICAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImQiIHgxPSItMTQ3OC4xMiIgeDI9Ii0xNDc2LjczIiB5MT0iLTEzNi42NzkiIHkyPSI4Ni43ODkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iI0YwRjBGMCIvPgogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNGMEYwRjAiLz4KICAgICAgICA8L2xpbmVhckdyYWRpZW50PgogICAgICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZSIgeDE9Ii0xNDc3LjkxIiB4Mj0iLTE0NzYuNTIiIHkxPSItOTguNjc5IiB5Mj0iMTI0Ljc4OSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjRjBGMEYwIi8+CiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0YwRjBGMCIvPgogICAgICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICAgICAgPGxpbmVhckdyYWRpZW50IGlkPSJmIiB4MT0iLTE0NzcuOTEiIHgyPSItMTQ3Ni41IiB5MT0iLTYwLjI5OCIgeTI9IjE2NC43MDQiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iI0YwRjBGMCIvPgogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNGMEYwRjAiLz4KICAgICAgICA8L2xpbmVhckdyYWRpZW50PgogICAgICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iaCIgeDE9Ii0xMzc2LjY3IiB4Mj0iLTEzNzUuMjgiIHkxPSItNzMuNjc5IiB5Mj0iMTQ5Ljc4OSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjRjBGMEYwIi8+CiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0YwRjBGMCIvPgogICAgICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8L2RlZnM+Cjwvc3ZnPgo="
                />
                <h1>Get Started</h1>
                <p>
                  Drag and drop a filter from the left anywhere into this panel
                  to add it to your filter pattern
                </p>
              </div>
            )}
          </Card.Group>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: any, ownProps: Props) => {
  const { filters, savedPatterns } = state;

  return {
    ...ownProps,
    library: getLibraryFilterState(filters),
    rawLibrary: getRawLibraryFilterState(filters),
    filters: getFiltersState(filters),
    savedPatterns: savedPatterns.savedPatterns,
    filterIdBeingDragged: filters.filterIdBeingDragged,
    currentFilterPatternLength: getFiltersAmount(filters),
    hasDefinedTableSettings: filters.selectedColumns.length >= 1,
    dropAllowed: filters.dropAllowed
  };
};

export default connect(mapStateToProps, {
  removeFilterFromPath,
  toggleScrollEffect,
  addFilterToPath,
  reorderFilterOnPath,
  reorderSelectedFiltersOnPath,
  moveFilterToGroup,
  moveSelectedFiltersToGroup,
  moveFilterWithinGroup,
  moveFilterFromGroupToPath,
  openFilter,
  closeFilter,
  updateDraggedFilterId,
  filterSelection,
  applySavedPattern,
  applySavedPatternToGroup,
  setSelectedColumns,
  buildGroupByDefault
})(FilterPath);
