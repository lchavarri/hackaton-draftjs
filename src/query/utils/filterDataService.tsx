import {
  FloatOperators,
  IntegerOperators
} from '../components/filterParameters/filterCriteriaTypes';
import {
  FilterCriteriaType,
  FilterType,
  IFilterCriteria,
  ILibraryFilter,
  Field
} from '../components/layout/layoutTypes';
import JupyterService from '../../shared/ui/services/jupyterService';
import { JSONObject } from '@phosphor/coreutils';
import { setServerError } from '../redux/actions';
import { kernelUnresponsiveMessage } from '../hooks/useKernel';

// interfaces
export interface IFilterCriteriaDTO {
  type: FilterCriteriaType;
  name: string;
  operator: string;
  value: string | number | undefined;
  connector: string;
}

export interface IFilterDTO {
  iri: string;
  className: string;
  nodeLabel: string;
  nodeConnector: string;
  fields: Array<Field>;
  filterType: FilterType;
  filterCriteria: Array<IFilterCriteriaDTO>;
}

export interface IApiFilterCriteriaDTO {
  method: string;
  iri: string;
  operator: string;
  value: string | number | undefined;
  trailing_operator: string;
}
export interface IApiFilterDTO {
  trailing_operator: string;
  iri?: string;
  arguments?: Array<IApiFilterCriteriaDTO>;
  children?: Array<IApiFilterDTO>;
}

export type CypherResults = {
  columns: any;
  top: any;
  count: any;
};

interface KernelResult {
  msg_id: string;
  msg_type: string;
  content: any;
}

function getCriteriaValue(
  operator: string,
  value: string | number | undefined
) {
  if (
    operator === IntegerOperators.NULL ||
    operator === IntegerOperators.NOT_NULL ||
    operator === FloatOperators.NULL ||
    operator === FloatOperators.NOT_NULL
  ) {
    return '';
  }
  return value;
}

function getFilterCriteriaDto(
  filterCriteria: Array<IFilterCriteria>
): Array<IFilterCriteriaDTO> {
  return filterCriteria.map((criteria: IFilterCriteria) => {
    return {
      type: criteria.type,
      name: criteria.name,
      operator: criteria.operator,
      value: getCriteriaValue(criteria.operator, criteria.value),
      connector: criteria.connector
    } as IFilterCriteriaDTO;
  });
}

function getBaseFilterData(filter: ILibraryFilter) {
  return {
    iri: filter.iri,
    className: filter.className,
    displayName: filter.displayName,
    fields: filter.fields,
    nodeLabel: filter.nodeLabel,
    nodeConnector: filter.nodeConnector,
    filterType: filter.filterType
  };
}

export function getFilterDTOData(
  filters: Array<ILibraryFilter>
): Array<IFilterDTO> {
  return filters.map((filter: ILibraryFilter) => {
    return {
      ...getBaseFilterData(filter),
      filterCriteria: getFilterCriteriaDto(filter.filterCriteria),
      filters:
        filter.filterType === FilterType.GROUP && filter.filters
          ? getFilterDTOData(filter.filters)
          : []
    } as IFilterDTO;
  });
}

/**
 * Dtos required by EidosDataFrame to operate directly with json data
 */
function getApiFilterCriteriaDto(
  filterCriteria: Array<IFilterCriteria>
): Array<IApiFilterCriteriaDTO> {
  return filterCriteria.map((criteria: IFilterCriteria) => {
    return {
      iri: criteria.iri,
      method: criteria.method,
      operator: criteria.operator,
      trailing_operator: criteria.connector,
      value: getCriteriaValue(criteria.operator, criteria.value)
    } as IApiFilterCriteriaDTO;
  });
}
export function getApiFilterDTOData(
  filters: Array<ILibraryFilter>
): Array<IApiFilterDTO> {
  return filters.map((filter: ILibraryFilter) => {
    let dto: IApiFilterDTO = {
      trailing_operator: filter.nodeConnector
    };

    if (filter.filterType === FilterType.GROUP && filter.filters) {
      dto.children = getApiFilterDTOData(filter.filters);
    } else if (filter.filterType === FilterType.CARD) {
      dto.arguments = getApiFilterCriteriaDto(filter.filterCriteria);
      dto.iri = filter.iri;
    }
    return dto;
  });
}

export async function filtersQuery(
  variableName: string,
  filtersDto: string,
  columns: string,
  groupColumns: string,
  dispatch: Function,
  topRecords: number = 10
): Promise<CypherResults> {
  try {
    const code = [
      'from eidos.prelude import *',
      'import json',
      `${variableName} = EidosDataFrame(json.loads("""{"filters":${JSON.stringify(
        filtersDto
      )}}"""))`,
      // TODO: use set view once corning returns ontology trhough grpc
      //`${variableName}.set_view(${columns})`,
      `${variableName}.set_groups(${groupColumns})`
    ].join('\n');
    const reply = await JupyterService.executeCode(code);

    // Getting last item of the response array
    const replyStatus =
      reply &&
      reply[reply.length - 1].content &&
      reply[reply.length - 1].content.status;

    if (replyStatus === 'error' || replyStatus === 'aborted') {
      dispatch(
        setServerError({
          code: 0,
          message:
            'Something happened. Results may not be up to date. Please try again.'
        })
      );
    }

    //ToDo: Change this when we have get_columns and get_count back
    /**
     * Actual code:
     * ' +
     *   `  "columns": ${variableName}.get_columns(),` +
     *   `  "top": ${variableName}.get_top_records(${topRecords}),` +
     *   `  "count": ${variableName}.get_count()` +
     *   '
     */
    const result = await getCodeResultsData(
      'json.dumps({' +
        `  "columns": ${variableName}._match_columns(${columns}),` +
        `  "top": ${variableName}.get_top_records(${topRecords}),` +
        `  "count": ${variableName}.__len__()` +
        '})'
    );

    const filtersResult = {
      ...result.pop()
    };

    if (
      !filtersResult.columns ||
      !filtersResult.top ||
      filtersResult.count == null
    ) {
      dispatch(
        setServerError({
          code: 0,
          message:
            'Something happened. Results may not be up to date. Please try again.'
        })
      );
    }
    //ToDo: Change this when we have get_columns back
    filtersResult.columns =
      (filtersResult.top && filtersResult.top.columns) || [];

    return filtersResult;
  } catch (e) {
    dispatch(
      setServerError({
        code: 0,
        message: kernelUnresponsiveMessage
      })
    );
    return {
      columns: [],
      top: [],
      count: 0
    };
  }
}

async function getCodeResultsData(code: string): Promise<any[]> {
  const messages: KernelResult[] = await JupyterService.executeCode(code);
  if (!messages || !messages.length) {
    return [];
  }
  return messages
    .filter(msg => msg.content && msg.content.data)
    .map(msg => {
      const data = msg.content.data as JSONObject;
      let text = data['text/plain'] as string;
      text = text.replace(/\\/gi, '');
      try {
        return JSON.parse(text.substr(1, text.length - 2));
      } catch (error) {
        return '';
      }
    });
}

async function getCodeResultsText(code: string): Promise<any[]> {
  const messages: KernelResult[] = await JupyterService.executeCode(code);
  if (!messages || !messages.length) {
    return [];
  }
  return messages
    .filter(msg => msg.content && msg.content.text)
    .map(msg => {
      let text = msg.content.text as string;
      text = text.replace(/\\/gi, '');
      try {
        return text.substr(1, text.length - 2);
      } catch (error) {
        return '';
      }
    });
}

export const joinColumns = (columns: Array<Array<string>>): string => {
  if (!columns || !columns.length) {
    return '[]';
  }

  return `[${columns
    .map(col => `(${col.map(name => `'${name}'`).join(',')})`)
    .join(',')}]`;
};

export async function exportCsv(variableName: string) {
  const code = `print(${variableName}.to_csv())`;
  const results = await getCodeResultsText(code);
  return results;
}

export async function quipExport(variableName: string, documentID: string) {
  const code = `${variableName}.to_spreadsheet('${documentID}', '${variableName}')`;

  return JupyterService.executeCode(code);
}

export async function checkVariableName(
  variableName: string
): Promise<{ valid: boolean; reason: string }> {
  const code = [
    'from eidos.prelude import *',
    'import json',
    `json.dumps(is_valid_variable_name('${variableName}'))`
  ].join('\n');

  const results = await getCodeResultsData(code);

  const response = results.pop() as { valid: boolean; reason: string };
  if (!response.valid) {
    return Promise.reject(response);
  }

  return response;
}

export async function renameDataFrame(oldName: string, newName: string) {
  const code = [`${newName} = ${oldName}`, `${oldName} = None`].join('\n');

  return JupyterService.executeCode(code);
}
