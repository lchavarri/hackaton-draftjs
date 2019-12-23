import React from 'react';
import { format, differenceInMilliseconds } from 'date-fns';
import './updated.scss';

type Props = {
  startDate: string | number | Date;
  endDate: string | number | Date;
};

export default function Updated(props: Props) {
  const { startDate, endDate } = props;

  const diff = differenceInMilliseconds(endDate, startDate);
  const duration = !diff || isNaN(diff) ? 0 : diff / 1000;

  return (
    <div className="updated-at">
      <div>Updated: {format(startDate, 'YYYY/MM/DD HH:mm:ss')}</div>
      <div>Duration: {duration}s</div>
    </div>
  );
}
