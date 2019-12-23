import './addFilterParameters.scss';

import React, { SyntheticEvent } from 'react';
import { connect } from 'react-redux';
import { Dropdown, Message } from 'semantic-ui-react';

import {
  addFilterParameter,
  filterFilterParamDropDown,
  toggleFilterParamDropDown
} from '../../redux/actions';
import { ILibraryFilter, Parameter } from '../layout/layoutTypes';
import SearchInput from '../../../shared/ui/components/SearchInput/SearchInput';

type AddFilterParametersProps = {
  schema?: any;
  paramOpened?: boolean;
  card: ILibraryFilter;

  toggleFilterParamDropDown?: any;
  filterFilterParamDropDown?: any;
  addFilterParameter?: any;
  parsedSchema: Array<Parameter>;
  filteredParams: Array<Parameter>;
  hasMultipleParameters: boolean;
};

type AddFilterParametersState = {};

class AddFilterParameters extends React.Component<
  AddFilterParametersProps,
  AddFilterParametersState
> {
  search: any = '';

  filterResults = (searchTerm: string) => {
    this.props.filterFilterParamDropDown(this.props.card.id, searchTerm);
    this.search = searchTerm;
  };

  addParameter = (event: SyntheticEvent, parameter: Parameter) => {
    if (this.props.card.filterCriteria.length >= 10) {
      return;
    }
    this.props.addFilterParameter(this.props.card.id, parameter);
    this.changeDropState(false);
    event.stopPropagation();
  };

  changeDropState = (value: boolean) => {
    this.props.toggleFilterParamDropDown(this.props.card.id, value);
    if (!value) {
      this.search = '';
      return;
    }
    this.props.filterFilterParamDropDown(this.props.card.id, this.search);
  };

  handleBlur = (event: React.KeyboardEvent<HTMLElement>) => {
    const ev = (event as any) as React.FocusEvent;
    const related = ev.relatedTarget as HTMLElement;
    const blurToHimself = related && ev.target === event.currentTarget;
    const blurToChildren = related && ev.currentTarget.contains(related);
    if (blurToHimself || blurToChildren) {
      return;
    }
    this.changeDropState(false);
  };

  render() {
    const {
      paramOpened,
      filteredParams,
      parsedSchema,
      hasMultipleParameters,
      card
    } = this.props;
    const maxReached = card.filterCriteria.length >= 10;

    return (
      <div className="dropdown-menu ui dropdown">
        {hasMultipleParameters ? (
          <Dropdown
            text="+ Add Parameter"
            icon={null}
            onOpen={e => this.changeDropState(true)}
            onBlur={this.handleBlur}
            open={paramOpened}
          >
            <Dropdown.Menu open={paramOpened}>
              {parsedSchema.length > 5 ? (
                <SearchInput
                  searchTerm={this.search}
                  inputId="parameter-search"
                  searchCallback={this.filterResults}
                  cancelCallback={() => {
                    this.changeDropState(false);
                  }}
                  isFocused={paramOpened}
                ></SearchInput>
              ) : (
                ''
              )}
              <Dropdown.Menu scrolling open={paramOpened}>
                {filteredParams.map((param: Parameter, index: number) => {
                  return (
                    <Dropdown.Item
                      key={index}
                      onClick={e => {
                        this.addParameter(e, param);
                      }}
                      className={maxReached ? 'not-allowed' : ''}
                      text={param.name}
                      value={param.id}
                    />
                  );
                })}
                {filteredParams.length <= 0 ? (
                  <Message>No results found</Message>
                ) : (
                  ''
                )}
              </Dropdown.Menu>
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          parsedSchema.map((param: Parameter, index: number) => {
            return (
              <div
                className={
                  'parameter-add text' + (maxReached ? ' disabled' : '')
                }
                onClick={e => this.addParameter(e, param)}
                key={index}
              >
                + Add {param.name}
              </div>
            );
          })
        )}
      </div>
    );
  }
}

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    ...ownProps,
    paramOpened: ownProps.card.paramOpened,
    hasMultipleParameters: ownProps.card.hasMultipleParameters,
    parsedSchema: ownProps.card.parsedSchema.params,
    filteredParams: ownProps.card.filteredParams.params
  };
};

export default connect(mapStateToProps, {
  toggleFilterParamDropDown,
  addFilterParameter,
  filterFilterParamDropDown
})(AddFilterParameters);
