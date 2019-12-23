import React from 'react';

import './MinStateQueryName.scss';
import { ILibraryFilter, IMinFilterData } from './layoutTypes';
import { getMinStatePathData } from '../../utils/filterPathDataUtils';

type MinStateQueryNameProps = {
  filters: Array<ILibraryFilter> | null;
};

export default function MinStateQueryName(props: MinStateQueryNameProps) {
  const { filters } = props;

  if (!filters) return null;

  if (!filters.length) {
    return (
      <div className="min-state-query-name">
        <strong>No Query found.</strong>
      </div>
    );
  }

  const minFilters: Array<IMinFilterData> = getMinStatePathData(filters);

  const jsx = minFilters.map((item: IMinFilterData, index: number) => {
    return (
      <span key={index}>
        <span className="display-name">{item.displayName}</span>
        <span className="connector">{item.nodeConnector}</span>
      </span>
    );
  });

  return <div className="min-state-query-name">{jsx}</div>;
}
