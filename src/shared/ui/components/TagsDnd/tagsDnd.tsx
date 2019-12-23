import './tagsDnd.scss';

import React from 'react';
import { Button } from 'semantic-ui-react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/pro-light-svg-icons';

const Sortable = require('react-sortablejs');

export interface ColumnData {
  id: string;
  value: string;
  // new params from jupyter
  className: string;
  displayName: string;
  parameterName: string;
  label: string;
}

type Props = {
  tagList: Array<ColumnData>;
  sortable: boolean;
  updateList: Function;
};

export default function TagsDnd(props: Props) {
  const reorder = (result: any) => {
    const resp = result.reduce(
      (accum: Array<ColumnData>, currVal: any, currI: number) => {
        return accum.concat(props.tagList[currVal]);
      },
      []
    );
    props.updateList(resp);
  };

  const remove = (el: any, am: any) => {
    const position = props.tagList.findIndex((elem: any) => {
      return elem.value === am.value;
    });
    props.tagList.splice(position, 1);
    props.updateList(props.tagList);
  };

  const { tagList, sortable } = props;
  return (
    <Sortable
      options={{
        group: {
          name: 'tags',
          pull: sortable,
          put: false // Do not allow items to be put into this list
        },
        animation: 150,
        forceFallback: true,
        fallbackClass: 'dragged-shadow',
        filter: sortable ? '.button' : '.label',
        preventOnFilter: true,
        fallbackOnBody: false,
        swapThreshold: 0.15,
        sort: sortable,
        onChoose: (e: any) => {
          document.body.style.cursor = sortable ? 'grabbing' : 'initial';
        },
        onUnchoose: (e: any) => {
          document.body.style.cursor = 'initial';
        }
      }}
      className="tags-wrapper"
      onChange={(result: any, o: any, b: any) => reorder(result)}
    >
      {tagList.map((option: ColumnData, index: number) => {
        return (
          <div
            key={index}
            id={index + ''}
            data-id={index + ''}
            className={sortable ? 'ui label' : 'ui label not-draggable'}
          >
            <span>{option.label}</span>
            <Button
              icon
              basic
              simple="true"
              floated="right"
              className="xs"
              onClick={event => {
                remove(event, option);
              }}
            >
              <FontAwesomeIcon
                icon={faTimes}
                aria-label="Remove Tag"
                className="icon"
              />
            </Button>
          </div>
        );
      })}
    </Sortable>
  );
}
