import '../columnBuilder/columnBuilder.scss';

import React from 'react';
import { connect } from 'react-redux';

import {
  updateGroupBySearch,
  changeGroupByDropState,
  buildGroupByDefault,
  resetGroupBySearch
} from '../../../redux/actions';
import TagsDnd from '../../../../shared/ui/components/TagsDnd/tagsDnd';
import SearchableDropdown from '../searchableDropDown/searchableDropDown';
import { ColumnData } from '../columnBuilder/columnBuilder';

export type GroupByState = {};

class GroupBy extends React.Component<any, GroupByState> {
  tags: Array<ColumnData> = [];

  addColumn = (el: any, column: ColumnData) => {
    const { groupBySelectedColumns } = this.props;
    let columns: Array<ColumnData>;
    const existInSelected = groupBySelectedColumns.find((col: ColumnData) => {
      return (
        column.displayName === col.displayName &&
        column.parameterName === col.parameterName
      );
    });
    if (!existInSelected) {
      columns = [...groupBySelectedColumns, column];

      this.props.buildGroupByDefault(columns);
    }
  };

  updateSelectedColumns = (columns: Array<ColumnData>) => {
    this.props.buildGroupByDefault(columns);
  };

  filterResults = (searchTerm: string) =>
    this.props.updateGroupBySearch(searchTerm);
  resetGroupBySearch = () => this.props.resetGroupBySearch();

  changeColumnBuilderDropState = (value: boolean) => {
    this.props.changeGroupByDropState(value);
    this.props.buildGroupByDefault(this.props.groupBySelectedColumns);
  };

  render() {
    const {
      groupByFilteredOptions,
      groupBySelectedColumns,
      groupBySearch,
      groupByOpened,
      selectedColumns
    } = this.props;
    return (
      <div className="column-builder" onScroll={e => e.preventDefault()}>
        <div className="wrapper">
          <SearchableDropdown
            triggerLabel="+ Add"
            dropdownId="groupBySelectionDropdown"
            dropdownOptions={[
              {
                id: 'groupBy',
                isCollapsed: false,
                groupOptionsName: 'Columns Used In Table',
                options: groupByFilteredOptions
              }
            ]}
            emptySectionMessage={
              !selectedColumns || !selectedColumns.length
                ? 'No options available. Please define your table columns.'
                : 'No options available to add'
            }
            changeDropState={(value: boolean) =>
              this.changeColumnBuilderDropState(value)
            }
            opened={groupByOpened}
            filterOptions={(searchTerm: string) =>
              this.filterResults(searchTerm)
            }
            searchTerm={groupBySearch}
            selectOption={(event: any, option: ColumnData) =>
              this.addColumn(event, option)
            }
            collapseLongGroups={false}
            toggleOptionsGroupCollapsed={(group: any) =>
              this.props.toggleColumnBuilderSectionCollapsedState(
                group + 'Collapsed'
              )
            }
            resetSearch={this.resetGroupBySearch}
          />
        </div>
        <TagsDnd
          tagList={groupBySelectedColumns}
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
    groupBySelectedColumns,
    groupByFilteredOptions,
    groupByOpened,
    groupBySearch,
    selectedColumns
  } = filters;

  return {
    ...ownProps,
    groupByFilteredOptions,
    groupBySelectedColumns,
    groupByOpened,
    groupBySearch,
    selectedColumns
  };
};

export default connect(
  mapStateToProps,
  {
    updateGroupBySearch,
    resetGroupBySearch,
    changeGroupByDropState,
    buildGroupByDefault
  }
)(GroupBy);
