import React from 'react';
import { Dropdown, Menu } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/pro-light-svg-icons';

// Local imports
import SearchInput from '../../../../../shared/ui/components/SearchInput/SearchInput';

type Props = {
  savedPatternScroll?: boolean;
  savedPatternStageVisible?: boolean;
  onFilter: Function;
  onSort: Function;
  setRef: Function;
};

class SavedPatternsMenu extends React.Component<any> {
  render() {
    const { onFilter, onSort, setRef, searchTerm } = this.props;

    const dropdownOptions = [
      {
        key: 'Author Name',
        text: 'Author Name',
        value: 'author'
      },
      {
        key: 'Date Created',
        text: 'Date Created',
        value: 'date'
      },
      {
        key: 'Pattern Name',
        text: 'Pattern Name',
        value: 'name'
      }
    ];

    return (
      <div
        ref={setRef}
        className={`library-menu-wrapper menu-wrapper saved-patterns-menu`}
      >
        <Menu text vertical className="drawer-top">
          <Menu.Item>
            <SearchInput
              searchTerm={searchTerm}
              searchCallback={(term: string) => onFilter(term)}
              inputId="savedPatternsSearch"
            />
          </Menu.Item>
          <Menu.Menu>
            <Menu.Item className="label">
              Sort By:&nbsp;
              <Dropdown
                inline
                id="SavedPatternsFilterByDropdown"
                className="right"
                icon={<FontAwesomeIcon icon={faAngleDown} className="fa-lg" />}
                onChange={(e: any, data: any) => {
                  onSort(data.value);
                }}
                options={dropdownOptions}
                defaultValue={dropdownOptions[1].value}
              />
            </Menu.Item>
          </Menu.Menu>
        </Menu>
        {}
      </div>
    );
  }
}

const mapStateToProps = (state: any, ownProps: Props) => {
  const { layout, savedPatterns } = state;

  return {
    ...ownProps,
    savedPatternScroll: layout.savedPatternScroll,
    searchTerm: savedPatterns.searchTerm
  };
};

export default connect(mapStateToProps)(SavedPatternsMenu);
