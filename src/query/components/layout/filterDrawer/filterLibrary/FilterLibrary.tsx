import React from 'react';

// Local imports
import FilterLibraryList from './FilterLibraryList';
import LibraryMenu from './LibraryMenu';
import useScrollable from '../../../../../shared/ui/hooks/useScrollable';

export default function FilterLibrary(props: any) {
  const { setRef, onScroll } = useScrollable();

  return (
    <>
      <LibraryMenu setRef={setRef} />
      <FilterLibraryList onScroll={onScroll} />
    </>
  );
}
