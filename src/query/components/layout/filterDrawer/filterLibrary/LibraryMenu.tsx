import React, { useEffect, useState } from 'react';
import { Menu, Dropdown } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/pro-light-svg-icons';
import { debounce } from 'throttle-debounce';

// Local imports
import {
  toggleLibrary,
  searchLibrary,
  addFilterByCriteria,
  updateFilterByCriteria,
  removeAllFilterByOptions
} from '../../../../redux/actions';
import { ColumnData } from '../../../resultStage/columnBuilder/columnBuilder';
import { getLibraryCategoriesOptions } from '../../../../redux/selectors/filter/filterSelector';
import { DropdownOption } from '../../../booleanConnector/booleanConnector';
import SearchInput from '../../../../../shared/ui/components/SearchInput/SearchInput';
import TagsDnd from '../../../../../shared/ui/components/TagsDnd/tagsDnd';

type Props = {
  setRef: Function;
};

function LibraryMenu(props: any) {
  const [search, setSearch] = useState(props.search);
  const { libraryVisible, libraryFilteredClasses, libraryScroll } = props;

  const onSearchInputChanged = debounce(500, (searchTerm: string) => {
    setSearch(searchTerm);
    props.searchLibrary(searchTerm);
  });

  const addFilterByOption = (evt: any, data: any) => {
    props.addFilterByCriteria(data.value);
    props.searchLibrary(search);
  };
  const updateFilterByOption = (data: Array<ColumnData>) => {
    props.updateFilterByCriteria(data);
    props.searchLibrary(search);
  };
  const removeAllFilterByOptions = () => {
    props.removeAllFilterByOptions();
    props.searchLibrary(search);
  };

  useEffect(() => {
    if (props.search && search !== props.search) {
      setSearch(props.search);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.search]);

  // Render utility methods
  const renderDropDownMenu = () => {
    const { libraryFilterCriteriaOptions } = props;

    if (!libraryFilterCriteriaOptions.length) {
      return (
        <Dropdown.Item id="nofilteravailable" key="nofilteravailable">
          No filters available
        </Dropdown.Item>
      );
    }

    return libraryFilterCriteriaOptions.map(
      (criteriaOption: DropdownOption) => {
        return (
          <Dropdown.Item
            id={criteriaOption.value}
            key={criteriaOption.key}
            onClick={(e: any) => {
              addFilterByOption(e, criteriaOption);
            }}
          >
            {criteriaOption.text}
          </Dropdown.Item>
        );
      }
    );
  };

  return (
    <div
      ref={el => props.setRef(el)}
      className={
        'library-menu-wrapper menu-wrapper' +
        (libraryScroll && libraryVisible ? ' shadow' : '')
      }
    >
      <Menu text tabular attached="top">
        <Menu.Item>
          <SearchInput
            searchTerm={props.search}
            searchCallback={onSearchInputChanged}
            inputId="librarySearch"
          />
        </Menu.Item>
        <Dropdown
          id="FilterLibraryFilterByDropdown"
          text="Filter by"
          className="item"
          scrolling
          pointing="top right"
          icon={<FontAwesomeIcon icon={faAngleDown} className="fa-lg" />}
        >
          <Dropdown.Menu>{renderDropDownMenu()}</Dropdown.Menu>
        </Dropdown>
      </Menu>
      {libraryFilteredClasses.length ? (
        <div>
          <Menu text tabular attached="top" className="drawer-top">
            <label>
              Filter by:
              <button
                className="ui button text btn-link"
                onClick={() => removeAllFilterByOptions()}
              >
                clear all
              </button>
            </label>
          </Menu>
          <Menu
            text
            tabular
            vertical
            attached="top"
            className={'drawer-top expandable'}
          >
            <TagsDnd
              tagList={libraryFilteredClasses}
              updateList={updateFilterByOption}
              sortable={false}
            />
          </Menu>
        </div>
      ) : (
        ''
      )}
    </div>
  );
}

const mapStateToProps = (state: any, ownProps: Props) => {
  const { layout, filters } = state;

  return {
    ...ownProps,
    libraryScroll: layout.libraryScroll,
    search: filters.search,
    libraryFilterCriteriaOptions: getLibraryCategoriesOptions(filters),
    libraryFilteredClasses: filters.libraryFilteredClasses
  };
};

export default connect(
  mapStateToProps,
  {
    toggleLibrary,
    searchLibrary,
    addFilterByCriteria,
    updateFilterByCriteria,
    removeAllFilterByOptions
  }
)(LibraryMenu);
