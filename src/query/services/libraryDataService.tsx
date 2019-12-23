import {
  FilterType,
  IFilterData,
  IFilterGroup
} from '../components/layout/layoutTypes';
import uuid from 'uuid/v4';
import { BrowserHeaders } from 'browser-headers';

import { CMOClient } from '../proto/cmo_pb_service';
import { AllActionsRequest } from '../proto/cmo_pb';

var cmoClientInstance = new CMOClient(
  process.env.REACT_APP_GRPC_URI || '',
  undefined
);

function getClassFilter(groupName: string, group: Array<IFilterData>): any {
  let filterGroup = new Array<IFilterData>();
  // TODO: Disabled until CMO gRPC service has support to generic filters
  // const description =
  //   `This will include any related ` + groupName + ` in your results `;

  // const nodeLabel = `Any ${groupName}`;
  // filterGroup.push({
  //   id: groupName,
  //   className: groupName,
  //   nodeLabel,
  //   nodeConnector: 'and',
  //   description,
  //   displayName: nodeLabel,
  //   selected: false,
  //   hover: false,
  //   fields: [],
  //   filterType: FilterType.CARD,
  //   filterCriteria: []
  // });

  group.forEach((el: any) => {
    const uniqueId = (el.uid ? el.uid : el.class_uid) || uuid();
    let filter: IFilterData = {
      iri: el.iri,
      id: el.name.replace(' ', '-') + '-' + uniqueId,
      className: groupName,
      nodeLabel: el.name,
      nodeConnector: 'and',
      description: el.description,
      displayName: el.name,
      selected: false,
      hover: false,
      fields: el.fields,
      filterType: FilterType.CARD,
      filterCriteria: []
    };
    filterGroup.push(filter);
  });

  filterGroup.sort((a, b) => {
    if (a.displayName < b.displayName) {
      return -1;
    } else if (a.displayName > b.displayName) {
      return 1;
    }
    return 0;
  });

  return filterGroup;
}

function processFilters(data: any) {
  let filters = new Array<IFilterGroup>();
  const libraries =
    data && data.array && data.array[0] && JSON.parse(data.array[0]);
  const keys = Object.keys(JSON.parse(data.array[0]));

  keys.forEach((key: string) => {
    const groupName = key.replace('Class', '');
    const classtypes = libraries[key];
    const group = getClassFilter(groupName, classtypes);
    let filter = {} as IFilterGroup;

    classtypes.forEach(() => {
      if (libraries) {
        filter = {
          groupName: groupName,
          filters: group,
          count: group.length
        };
      }
    });
    filters.push(filter);
  });

  filters.sort((a, b) => {
    if (a.groupName < b.groupName) {
      return -1;
    } else if (a.groupName > b.groupName) {
      return 1;
    }
    return 0;
  });

  return filters;
}

export async function getAllTypeClasses() {
  try {
    var request = new AllActionsRequest();
    var headers = new BrowserHeaders();
    return new Promise(resolve =>
      cmoClientInstance.get_all_actions(request, headers, function(
        err: any,
        response: any
      ) {
        if (err) throw new Error();
        return resolve(processFilters(response));
      })
    );
  } catch (err) {
    return Promise.reject(err);
  }
}
