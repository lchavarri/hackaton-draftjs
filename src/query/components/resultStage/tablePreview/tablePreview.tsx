import React from 'react';
import { connect } from 'react-redux';
import { Table } from 'semantic-ui-react';

type TablePreviewState = {};

class TablePreview extends React.Component<any, TablePreviewState> {
  times: Array<number> = Array.from(new Array(10), (val, index) => index);
  timesHeader: Array<number> = Array.from(new Array(3), (val, index) => index);

  render() {
    const { tableColumns, tableTop10 } = this.props;
    return (
      <Table celled className="trimmed-table">
        <Table.Header>
          {this.timesHeader.map((el: any, rowIndex: number) => {
            return (
              <Table.Row key={rowIndex}>
                {tableColumns.map((column: Array<string>, index: number) => {
                  return (
                    <Table.HeaderCell key={index}>
                      {column[rowIndex]}
                    </Table.HeaderCell>
                  );
                })}
              </Table.Row>
            );
          })}
        </Table.Header>

        <Table.Body>
          {tableTop10.map((row: any, index: number) => {
            return (
              <Table.Row key={index}>
                {tableColumns.map((column: any, index: number) => {
                  return (
                    <Table.Cell key={index}>
                      <div title={row[index]}>{row[index]}</div>
                    </Table.Cell>
                  );
                })}
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    );
  }
}
const mapStateToProps = (state: any) => {
  const { filters } = state;
  const { tableColumns, tableTop10 } = filters;

  return {
    tableColumns,
    tableTop10
  };
};

export default connect(
  mapStateToProps,
  {}
)(TablePreview);
