import React, { useEffect, useContext } from 'react';
import { Card } from 'semantic-ui-react';
import { IFilterGroup, ILibraryFilter } from '../../layoutTypes';
import DragCard from '../../../DragCard/DragCard';
import * as libraryDataService from '../../../../services/libraryDataService';
import { connect } from 'react-redux';
import {
  populateFilterLibrary,
  toggleLibrary,
  toggleFilterPath,
  toggleScrollEffect,
  toggleFilterLibraryDescription,
  populateFilterLibraryRaw,
  filterDragStarted,
  filterDragEnded
} from '../../../../redux/actions';
import {
  getLibraryFilterState,
  libraryHasResults
} from '../../../../redux/selectors/filter/filterSelector';
import { Context } from '../../LayoutMax';
import { Context as MainCtx } from '../../../../../shared/ui/main/main';
import RequestNodeMessageTrigger from '../../../../../shared/ui/components/modals/requestNode/requestNodeMessageTrigger';
import appNames from '../../../../../shared/ui/appNames';
import { sendEmail } from '../../../../utils/emailSenderUtil';

const Sortable = require('react-sortablejs');

type Props = {};

type FilterLibraryState = {};

let onCloneClosureFn = () => {};

function FilterLibraryList(props: any) {
  const { library, libraryHasResults, search, onScroll } = props;
  const { documentId } = useContext(MainCtx);
  const { expandPane } = useContext(Context);

  //ToDo: Move this to an action creator
  useEffect(() => {
    const { library } = props;
    if (!library.length) {
      libraryDataService.getAllTypeClasses().then((types: any) => {
        props.populateFilterLibrary(types);
        props.populateFilterLibraryRaw(types);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    onCloneClosureFn = () => expandPane(0, !!props.splitPosition);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.splitPosition]);

  useEffect(() => {
    if (!props.dropAllowed && props.isCardBeingDragged) {
      document.body.style.cursor = 'not-allowed';
    } else if (props.isCardBeingDragged) {
      document.body.style.cursor = 'grabbing';
    } else {
      document.body.style.cursor = 'initial';
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.dropAllowed, props.isCardBeingDragged]);

  function submit(args: any) {
    return sendEmail(args, documentId);
  }

  function renderLibrary() {
    if (search && library.length && libraryHasResults)
      return (
        <RequestNodeMessageTrigger
          appName={appNames.EIDOS_QUERY}
          search={search}
          sendRequest={submit}
        />
      );

    return (
      <Card.Group className="cards-library">
        {library.map((filterGroup: IFilterGroup, index: number) => {
          return (
            <div
              className="group-container"
              key={filterGroup.groupName + '' + index}
            >
              <span className="meta">
                {filterGroup.groupName} ({filterGroup.filters.length})
              </span>
              <Sortable
                options={{
                  group: {
                    name: 'filters',
                    pull: (args: any) => {
                      return true;
                    },
                    revertClone: true,
                    put: false // Do not allow items to be put into this list
                  },
                  handle: '.drag-handle',
                  filter: '.buttons',
                  animation: 150,
                  forceFallback: true,
                  fallbackClass: 'dragged-shadow',
                  fallbackOnBody: false,
                  fallbackTolerance: 0,
                  sort: false,
                  direction: 'vertical',
                  scroll: true,
                  scrollSensitivity: 50, // px, how near the mouse must be to an edge to start scrolling.
                  scrollSpeed: 10, // px
                  bubbleScroll: true, // apply autoscroll to all parent elements, allowing for easier movement
                  dragoverBubble: true,
                  onClone: (evt: any) => {
                    props.toggleFilterLibraryDescription(evt.item.id, false);
                    onCloneClosureFn();
                  },
                  onChoose: (e: any) => {
                    props.filterDragStarted();
                  },
                  onUnchoose: (e: any) => {
                    document.body.style.cursor = 'initial';
                    props.filterDragEnded();
                  }
                }}
                className="cards-library"
                id="library"
                onChange={(draggedId: any, o: any, evt: any) => {}} // needed to refresh after a change on the model from outside
              >
                {filterGroup.filters.map(
                  (filter: ILibraryFilter, index: number) => {
                    return (
                      <DragCard
                        card={filter}
                        index={index}
                        length={filterGroup.filters.length}
                        key={filter.id}
                        data-id={filter.id}
                        type="library"
                      />
                    );
                  }
                )}
              </Sortable>
            </div>
          );
        })}
      </Card.Group>
    );
  }

  return (
    <div className="filter-library" onScroll={onScroll}>
      <div className="container-scrollable">{renderLibrary()}</div>
    </div>
  );
}

const mapStateToProps = (state: any, ownProps: Props) => {
  const { filters, layout } = state;

  return {
    ...ownProps,
    library: getLibraryFilterState(filters),
    search: filters.search,
    dropAllowed: filters.dropAllowed,
    isCardBeingDragged: filters.isCardBeingDragged,
    splitPosition: layout.splitPosition,
    libraryHasResults: libraryHasResults(filters)
  };
};

export default connect(mapStateToProps, {
  toggleLibrary,
  toggleFilterPath,
  populateFilterLibrary,
  populateFilterLibraryRaw,
  toggleScrollEffect,
  toggleFilterLibraryDescription,
  filterDragStarted,
  filterDragEnded
})(FilterLibraryList);
