import './booleanConnector.scss';

import React from 'react';
import { connect } from 'react-redux';
import { Dropdown } from 'semantic-ui-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/pro-light-svg-icons';

export enum ConnectorType {
  PARAMETER = 'parameter',
  FILTER = 'filter'
}

type BooleanConnectorProps = {
  hasConnector: boolean;
  changeHandler: any;
  id: string;
  type: string;
  value: string;
};

export interface DropdownOption {
  key: string;
  value: string;
  text: string;
}

export let filterOptions = [
  { key: 'and', value: 'and', text: 'and' },
  { key: 'or', value: 'or', text: 'or' },
  { key: 'xor', value: 'xor', text: 'xor' },
  { key: 'then', value: 'then', text: 'then (Coming Soon)', disabled: true },
  { key: 'next', value: 'next', text: 'next (Coming Soon)', disabled: true }
];

export let parameterOptions = [
  { key: 'and', value: 'and', text: 'and' },
  { key: 'or', value: 'or', text: 'or' },
  { key: 'xor', value: 'xor', text: 'xor' }
];

const BooleanConnector = (props: BooleanConnectorProps) => {
  let options: Array<DropdownOption> = [];
  switch (props.type) {
    case ConnectorType.PARAMETER:
      options = parameterOptions;
      break;
    case ConnectorType.FILTER:
      options = filterOptions;
      break;
  }
  return (
    <div className="boolean-connector">
      {props.hasConnector ? (
        <img
          alt="info"
          src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCjxzdmcgd2lkdGg9IjEzcHgiIGhlaWdodD0iNDdweCIgdmlld0JveD0iMCAwIDEzIDQ3IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPg0KICAgIDwhLS0gR2VuZXJhdG9yOiBza2V0Y2h0b29sIDUzLjEgKDcyNjMxKSAtIGh0dHBzOi8vc2tldGNoYXBwLmNvbSAtLT4NCiAgICA8dGl0bGU+RTdFMTYwMUQtQkNGMy00NTRCLUI3RUQtRDYwNkI1RkE1NDQ4PC90aXRsZT4NCiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggc2tldGNodG9vbC48L2Rlc2M+DQogICAgPGcgaWQ9IkNvcm5pbmctTVZQLURlc2lnbnMiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPg0KICAgICAgICA8ZyBpZD0iQ29ybmluZy1NVlAtLS1SZXN1bHRzLURlZmF1bHQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC02Ny4wMDAwMDAsIC0yNDkuMDAwMDAwKSIgZmlsbD0iI0QxRDdFMyI+DQogICAgICAgICAgICA8ZyBpZD0iRmlsdGVyLVBhdGgtRHJhd2VyIj4NCiAgICAgICAgICAgICAgICA8ZyBpZD0iQm9vbGVhbiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjUuMDAwMDAwLCAyNDkuMDAwMDAwKSI+DQogICAgICAgICAgICAgICAgICAgIDxwb2x5Z29uIGlkPSJQYXRoIiBwb2ludHM9IjU0Ljc0NTA5OCAzOS4zMzUxMDYzIDUzLjYyMTkzNjIgMzguMTE2MzU2MyA0OS4xNjkxMTc2IDQyLjkzOTQ5NDYgNDkuMTY5MTE3NiAtMS42MDQ2MTkyMWUtMTYgNDcuNTc1OTgwNCAtMS42MDQ2MTkyMWUtMTYgNDcuNTc1OTgwNCA0Mi45Mzk0OTQ2IDQzLjEzMTEyNzQgMzguMTA3NzEyNyA0MiAzOS4zMzUxMDYzIDQ4LjM3MjU0OSA0Ni4yNDk5OTk5Ij48L3BvbHlnb24+DQogICAgICAgICAgICAgICAgPC9nPg0KICAgICAgICAgICAgPC9nPg0KICAgICAgICA8L2c+DQogICAgPC9nPg0KPC9zdmc+"
        />
      ) : (
        ''
      )}
      <Dropdown
        inline={!props.hasConnector}
        fluid={props.hasConnector}
        selection={props.hasConnector}
        options={options}
        value={props.value ? props.value : options[0].value}
        onChange={props.changeHandler}
        id={'boolean-' + props.id}
        icon={
          <i className="dropdown icon">
            <FontAwesomeIcon icon={faAngleDown} />
          </i>
        }
      />
    </div>
  );
};

const mapStateToProps = (state: any, ownProps: BooleanConnectorProps) => {
  return {
    ...ownProps
  };
};

export default connect(
  mapStateToProps,
  {}
)(BooleanConnector);
