import React, {
  useState,
  useRef,
  useLayoutEffect,
  useEffect,
  createContext
} from 'react';
import SplitPane from 'react-split-pane';
import { connect } from 'react-redux';

import './LayoutMax.scss';
import './LayoutAnimation.scss';
import {
  buildColumnBuilderDefault,
  getPattern,
  setSplitPosition
} from '../../redux/actions';
import ResultStage from '../resultStage/ResultStage';
import FilterMenu from './filterDrawer/filterMenu/FilterMenu';
import FilterPath from './filterDrawer/filterPath/filterPath';
import TabBar from './TabBar';
import AppBar from './AppBar';
import EmptyGroupDeletedModal from '../modals/emptyGroupDeleted/emptyGroupDeleted';
import Timestamp from './Timestamp';
import {
  getFiltersState,
  getRawLibraryFilterState,
  getFiltersAmount
} from '../../redux/selectors/filter/filterSelector';
import ResultsButton from './ResultsButton';
import useWindowSize from '../../../shared/ui/hooks/useWindowSize';

type Props = {};

export const Context = createContext<any>({});

function Layout(props: any) {
  const {
    displayResults,
    filtersCount,
    selectedColumns,
    splitPosition,
    setSplitPosition,
    isFirstLoad,
    updateContent
  } = props;

  const ref = useRef<any>(null);
  // Restore value from Store
  const [size, setSize] = useState(splitPosition);
  const [dragging, setDragging] = useState(false);
  const [height, setHeight] = useState(0);
  const [showDrawer, setShowDrawer] = useState(true);
  const [showResults, setShowResults] = useState(!isFirstLoad);
  const windowSize = useWindowSize();

  useEffect(() => {
    if (filtersCount) {
      if (!selectedColumns || !selectedColumns.length) {
        props.buildColumnBuilderDefault();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersCount]);

  function updateUsableSizes() {
    if (ref.current.splitPane) {
      const height = ref.current.splitPane.offsetHeight;
      setHeight(height);
    }
  }

  // When window size changes update usable areas and Thresholds
  useEffect(() => {
    updateUsableSizes();
    setCustomSize(splitPosition);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windowSize.height, windowSize.width]);

  useLayoutEffect(() => {
    updateUsableSizes();
    // Just set the size if it has changed
    if (size !== splitPosition) {
      setSize(splitPosition);
    }
    setShowResults(!!splitPosition);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref.current]);

  const setCustomSize = (resizedHeight: number, forced?: boolean) => {
    if (!showResults && !forced) return;

    const snapThreshold = 120;
    const snapPoint = 80;
    let customSize = 0;

    // Snaps at the bottom
    if (resizedHeight < snapThreshold) {
      customSize = snapPoint;
    }
    // Snaps at the top
    else if (resizedHeight > height - snapThreshold) {
      customSize = height - snapPoint;
    } else {
      customSize = resizedHeight;
    }
    setSize(customSize);
    // Save position
    setSplitPosition(customSize);
  };

  const getSize = () => {
    if (dragging || !height) {
      return;
    }
    return `${(size / height) * 100}%`;
  };

  const renderTimestamp = () => {
    if (!displayResults || !displayResults.length) return null;

    return <Timestamp />;
  };

  return (
    <div className="main max">
      <Context.Provider value={{ expandPane: setCustomSize }}>
        <AppBar />
        <div className="app-wrapper">
          <TabBar showDrawer={showDrawer} setShowDrawer={setShowDrawer} />
          <div className="panels">
            <SplitPane
              size={getSize()}
              defaultSize={splitPosition}
              ref={ref}
              onDragStarted={() => setDragging(true)}
              onDragFinished={(newSize: number) => {
                setDragging(false);
                setCustomSize(newSize);
              }}
              className={
                'split-pane' +
                (dragging ? ' dragging' : '') +
                (showResults ? '' : ' hide-resizer')
              }
              split="horizontal"
              primary="second"
            >
              <div className="path">
                <FilterMenu
                  showDrawer={showDrawer}
                  setShowDrawer={setShowDrawer}
                  expandPane={() => {
                    if (showResults) setCustomSize(0);
                  }}
                  showResults={showResults}
                />
                <FilterPath updateContent={updateContent} />
              </div>
              <ResultStage
                expandPane={() => {
                  if (showResults) setCustomSize(1000);
                }}
                showResults={showResults}
              />
            </SplitPane>
            <div className="footer">
              {renderTimestamp()}
              <ResultsButton
                expandPane={() => {
                  setShowResults(true);
                  setCustomSize(1000, true);
                }}
                updateContent={updateContent}
              />
            </div>
          </div>
        </div>
        <EmptyGroupDeletedModal />
      </Context.Provider>
      <div className="footer nonclickable" />
    </div>
  );
}

const mapStateToProps = (state: any, ownProps: Props) => {
  const { filters, layout } = state;
  const {
    displayResults,
    settingsVisible,
    selectedColumns,
    columnBuilderColumns,
    isFirstLoad,
    groupBySelectedColumns
  } = filters;
  return {
    ...ownProps,
    filters: getFiltersState(filters),
    rawlibrary: getRawLibraryFilterState(filters),
    displayResults,
    settingsVisible,
    selectedColumns,
    groupBySelectedColumns,
    columnBuilderColumns,
    filtersCount: getFiltersAmount(filters),
    splitPosition: layout.splitPosition,
    isFirstLoad
  };
};
export default connect(
  mapStateToProps,
  {
    getPattern,
    buildColumnBuilderDefault,
    setSplitPosition
  }
)(Layout);
