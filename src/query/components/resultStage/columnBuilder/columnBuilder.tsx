import './columnBuilder.scss';

import React from 'react';
import { connect } from 'react-redux';

import {
  changeColumnBuilderDropState,
  setSelectedColumns,
  updateColumnBuilderSearch,
  buildColumnBuilderDefault,
  toggleColumnBuilderSectionCollapsedState,
  resetColumnBuilderSearch,
  buildGroupByDefault
} from '../../../redux/actions';
import {
  getFiltersState,
  getRawLibraryFilterState
} from '../../../redux/selectors/filter/filterSelector';
import { ILibraryFilter, IFilterGroup } from '../../layout/layoutTypes';
import TagsDnd from '../../../../shared/ui/components/TagsDnd/tagsDnd';
import SearchableDropdown from '../searchableDropDown/searchableDropDown';

export interface ColumnData {
  id: string;
  value: string;
  // new params from jupyter
  className: string;
  displayName: string;
  parameterName: string;
  label: string;
}

export type ColumnBuilderState = {
  columnBuilderColumns: Array<ColumnData>;
  inFilterPath: Array<ColumnData>;
  available: Array<ColumnData>;
  other: Array<ColumnData>;
  selectedColumns: Array<ColumnData>;
  columnBuilderOpened: boolean;
  columnBuilderSearch: string;
  currentPattern: Array<ILibraryFilter>;
  rawlibrary: Array<IFilterGroup>;
  usedInFilterPatternCollapsed: boolean;
  availableCollapsed: boolean;
  otherCollapsed: boolean;
  groupByOpened: boolean;
  groupBySearch: string;
  groupBySelectedColumns: Array<ColumnData>;
  groupByFilteredOptions: Array<ColumnData>;
};

class ColumnBuilder extends React.Component<any, ColumnBuilderState> {
  tags: Array<ColumnData> = [];
  constructor(props: any) {
    super(props);
    this.props.buildColumnBuilderDefault();
  }

  addColumn = (el: any, column: ColumnData) => {
    const { selectedColumns } = this.props;
    let columns: Array<ColumnData>;
    const existInSelected = selectedColumns.find((col: ColumnData) => {
      return (
        column.displayName === col.displayName &&
        column.parameterName === col.parameterName
      );
    });
    if (!existInSelected) {
      columns = [...selectedColumns, column];

      this.props.setSelectedColumns(columns);
      this.props.buildColumnBuilderDefault();
    }
  };

  updateSelectedColumns = (columns: Array<ColumnData>) => {
    const { groupBySelectedColumns } = this.props;
    this.props.setSelectedColumns(columns);

    // Group by columns must be a subset of the defined columns, to get that updated re build the list.
    this.props.buildGroupByDefault(groupBySelectedColumns);
  };

  filterResults = (searchTerm: string) =>
    this.props.updateColumnBuilderSearch(searchTerm);
  resetColumnBuilderSearch = () => this.props.resetColumnBuilderSearch();

  changeColumnBuilderDropState = (value: boolean) => {
    if (value) {
      this.props.buildColumnBuilderDefault();
    }
    this.props.changeColumnBuilderDropState(value);
  };

  render() {
    const {
      inFilterPath,
      available,
      other,
      selectedColumns,
      columnBuilderSearch,
      columnBuilderOpened,
      usedInFilterPatternCollapsed,
      availableCollapsed,
      otherCollapsed
    } = this.props;

    return (
      <div className="column-builder" onScroll={e => e.preventDefault()}>
        <div className="label-wrapper">
          <SearchableDropdown
            triggerLabel="+ Add"
            dropdownId="columnBuilderDropdown"
            dropdownOptions={[
              {
                id: 'usedInFilterPattern',
                isCollapsed: usedInFilterPatternCollapsed,
                groupOptionsName: 'Used In Filter Pattern',
                options: inFilterPath
              },
              {
                id: 'available',
                isCollapsed: availableCollapsed,
                groupOptionsName: 'Available',
                options: available
              },
              {
                id: 'other',
                isCollapsed: otherCollapsed,
                groupOptionsName: 'Other',
                options: other
              }
            ]}
            emptySectionMessage="No options available to add"
            changeDropState={(value: boolean) =>
              this.changeColumnBuilderDropState(value)
            }
            opened={columnBuilderOpened}
            filterOptions={this.filterResults}
            searchTerm={columnBuilderSearch}
            selectOption={(event: any, option: ColumnData) =>
              this.addColumn(event, option)
            }
            collapseLongGroups={true}
            toggleOptionsGroupCollapsed={(group: any) =>
              this.props.toggleColumnBuilderSectionCollapsedState(
                group + 'Collapsed'
              )
            }
            resetSearch={this.resetColumnBuilderSearch}
          />
        </div>
        <TagsDnd
          tagList={selectedColumns}
          updateList={this.updateSelectedColumns}
          sortable={true}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: any, ownProps: any) => {
  const { filters } = state;
  const {
    selectedColumns,
    columnBuilderColumns,
    inFilterPath,
    available,
    other,
    columnBuilderSearch,
    columnBuilderOpened,
    usedInFilterPatternCollapsed,
    availableCollapsed,
    otherCollapsed,
    groupBySelectedColumns
  } = filters;

  return {
    ...ownProps,
    rawlibrary: getRawLibraryFilterState(filters),
    filters: getFiltersState(filters),
    columnBuilderColumns,
    selectedColumns,
    columnBuilderSearch,
    columnBuilderOpened,
    groupBySelectedColumns,
    // options in dropdown
    inFilterPath,
    available,
    other,
    usedInFilterPatternCollapsed,
    availableCollapsed,
    otherCollapsed
  };
};

export default connect(
  mapStateToProps,
  {
    setSelectedColumns,
    updateColumnBuilderSearch,
    resetColumnBuilderSearch,
    changeColumnBuilderDropState,
    buildGroupByDefault,
    // new actions revisit previous to figure out possible removals
    buildColumnBuilderDefault,
    toggleColumnBuilderSectionCollapsedState
  }
)(ColumnBuilder);
