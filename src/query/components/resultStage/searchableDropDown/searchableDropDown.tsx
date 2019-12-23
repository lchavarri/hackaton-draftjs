import React from 'react';
import { Dropdown, Message } from 'semantic-ui-react';

import { ColumnData } from '../columnBuilder/columnBuilder';
import SearchInput from '../../../../shared/ui/components/SearchInput/SearchInput';
import '../columnBuilder/columnBuilder.scss';

export interface GroupedDropDownOptions {
  id: string;
  isCollapsed: boolean;
  groupOptionsName: string;
  options: Array<ColumnData>;
}

export type SearchableDropdownState = {};
export type SearchableDropdownProps = {
  dropdownId: string;
  dropdownOptions: Array<GroupedDropDownOptions>;
  opened: boolean;
  collapseLongGroups: boolean;
  searchTerm: string;
  triggerLabel: string;
  emptySectionMessage: string;

  // executable actions
  filterOptions: (term: string) => void;
  selectOption: Function;
  toggleOptionsGroupCollapsed: Function;
  changeDropState: Function;
  resetSearch: Function;
};

class SearchableDropdown extends React.Component<
  SearchableDropdownProps,
  SearchableDropdownState
> {
  render() {
    const {
      triggerLabel,
      dropdownId,
      dropdownOptions,
      changeDropState,
      opened,
      filterOptions,
      searchTerm,
      selectOption,
      collapseLongGroups,
      toggleOptionsGroupCollapsed,
      emptySectionMessage
    } = this.props;

    const searchId = 'searchTerm-';

    function handleBlur(event: React.KeyboardEvent<HTMLElement>) {
      const ev = (event as any) as React.FocusEvent;
      const related = ev.relatedTarget as HTMLElement;
      const blurToHimself = related && ev.target === event.currentTarget;
      const blurToChildren = related && ev.currentTarget.contains(related);
      if (blurToHimself || blurToChildren) {
        return;
      }
      changeDropState(false);
    }

    return (
      <Dropdown
        text={triggerLabel}
        multiple
        icon={null}
        id={dropdownId}
        onOpen={e => changeDropState(true)}
        onBlur={handleBlur}
        open={opened}
      >
        <Dropdown.Menu>
          <SearchInput
            searchTerm={searchTerm}
            inputId={searchId + dropdownId}
            searchCallback={filterOptions}
            placeholder="Search for options"
            isFocused={opened}
          ></SearchInput>
          <Dropdown.Menu scrolling>
            {dropdownOptions.map((group: GroupedDropDownOptions) => {
              return (
                <section key={group.id}>
                  <Dropdown.Header>
                    {group.groupOptionsName} ({group.options.length})
                  </Dropdown.Header>
                  {group.options && group.options.length ? (
                    <div>
                      {group.options.map(
                        (option: ColumnData, index: number) => {
                          return (collapseLongGroups &&
                            group.isCollapsed &&
                            index < 5) ||
                            (collapseLongGroups && !group.isCollapsed) ||
                            !collapseLongGroups ? (
                            <Dropdown.Item
                              key={option.id}
                              value={option.id}
                              onMouseDown={(e: any) => {
                                e.preventDefault();
                              }}
                              onClick={event => selectOption(event, option)}
                            >
                              <span>
                                {option.displayName} :{' '}
                                <em property="italic">
                                  {option.parameterName}
                                </em>
                              </span>
                            </Dropdown.Item>
                          ) : (
                            ''
                          );
                        }
                      )}
                      {collapseLongGroups &&
                      group.options.length &&
                      group.options.length > 5 ? (
                        <button
                          id={'toggleGroupCollapse-' + group.groupOptionsName}
                          onMouseDown={(e: any) => {
                            e.preventDefault();
                          }}
                          className="ui button text"
                          onClick={() => toggleOptionsGroupCollapsed(group.id)}
                        >
                          Show {group.isCollapsed ? 'All' : 'Less'}
                        </button>
                      ) : (
                        ''
                      )}
                    </div>
                  ) : searchTerm === '' ? (
                    <Message>
                      {emptySectionMessage
                        ? emptySectionMessage
                        : 'No options available to add'}
                    </Message>
                  ) : (
                    <Message>No results available to add</Message>
                  )}
                </section>
              );
            })}
          </Dropdown.Menu>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

export default SearchableDropdown;
