// tslint:disable
// this is an auto generated file. This will be overwritten

export const getEidosCeui = `query GetEidosCeui($document_id: String!, $app_instance_id: String!) {
  getEidosCEUI(document_id: $document_id, app_instance_id: $app_instance_id) {
    app_instance_id
    document_id
    content
    active_user
  }
}
`;
export const listEidosCeuis = `query ListEidosCeuis(
  $filter: TableEidosCEUIFilterInput
  $limit: Int
  $nextToken: String
) {
  listEidosCEUIS(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      app_instance_id
      document_id
      content
      active_user
    }
    nextToken
  }
}
`;
export const getEidosQueryUi = `query GetEidosQueryUi($app_instance_id: String!, $document_id: String!) {
  getEidosQueryUI(
    app_instance_id: $app_instance_id
    document_id: $document_id
  ) {
    app_instance_id
    document_id
    pythonVariableName
    content
    active_user
  }
}
`;
export const listEidosQueryUis = `query ListEidosQueryUis(
  $filter: TableEidosQueryUIFilterInput
  $limit: Int
  $nextToken: String
) {
  listEidosQueryUIS(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      app_instance_id
      document_id
      pythonVariableName
      content
      active_user
    }
    nextToken
  }
}
`;
export const listAllEidosQueryUis = `query ListAllEidosQueryUis($filter: TableEidosQueryUIFilterInput) {
  listAllEidosQueryUIS(filter: $filter) {
    items {
      app_instance_id
      document_id
      pythonVariableName
      content
      active_user
    }
    nextToken
  }
}
`;
export const listAllLibraries = `query ListAllLibraries {
  listAllLibraries {
    ActionClass {
      id
      added_by
      description
      modifying
      name
      schema
      uid
    }
    EquipmentClass {
      id
      added_by
      description
      uid
      name
      schema
    }
    FunctionClass {
      id
      added_by
      name
      description
      schema
      uid
    }
    GroupClass {
      id
      added_by
      description
      name
      schema
      uid
    }
    MeasurementClass {
      id
      added_by
      name
      description
      schema
      uid
    }
    ObjectClass {
      id
      added_by
      description
      name
      schema
      uid
    }
    PropertyClass {
      id
      added_by
      description
      name
      schema
      uid
    }
  }
}
`;
export const getQueryPattern = `query GetQueryPattern($document: String!, $name: String!) {
  getQueryPattern(document: $document, name: $name) {
    document
    name
    description
    selectedColumns
    groupbyColumns
    filters
    version
    createdAt
    updatedAt
  }
}
`;
export const listQueryPatterns = `query ListQueryPatterns(
  $filter: TableQueryPatternFilterInput
  $limit: Int
  $nextToken: String
) {
  listQueryPatterns(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      document
      name
      description
      selectedColumns
      groupbyColumns
      filters
      version
      createdAt
      updatedAt
    }
    nextToken
  }
}
`;
export const getEidosLabLibraryType = `query GetEidosLabLibraryType($type_IRI: String!) {
  getEidosLabLibraryType(type_IRI: $type_IRI) {
    type_IRI
    type_label
  }
}
`;
export const listEidosLabLibraryTypes = `query ListEidosLabLibraryTypes(
  $filter: TableEidosLabLibraryTypeFilterInput
  $limit: Int
  $nextToken: String
) {
  listEidosLabLibraryTypes(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    type_IRI
    type_label
  }
}
`;
export const getEidosLabLibraryPort = `query GetEidosLabLibraryPort($IRI: String!) {
  getEidosLabLibraryPort(IRI: $IRI) {
    IRI
    label
    port_type
    type {
      type_IRI
      type_label
    }
  }
}
`;
export const listEidosLabLibraryPorts = `query ListEidosLabLibraryPorts(
  $filter: TableEidosLabLibraryPortFilterInput
  $limit: Int
  $nextToken: String
) {
  listEidosLabLibraryPorts(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    IRI
    label
    port_type
    type {
      type_IRI
      type_label
    }
  }
}
`;
export const getEidosLabLibraryItem = `query GetEidosLabLibraryItem($IRI: String!) {
  getEidosLabLibraryItem(IRI: $IRI) {
    IRI
    label
    description
    type {
      type_IRI
      type_label
    }
    ports {
      IRI
      label
      port_type
      type {
        type_IRI
        type_label
      }
    }
  }
}
`;
export const listEidosLabLibraryItems = `query ListEidosLabLibraryItems(
  $filter: TableEidosLabLibraryItemFilterInput
  $limit: Int
  $nextToken: String
) {
  listEidosLabLibraryItems(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    IRI
    label
    description
    type {
      type_IRI
      type_label
    }
    ports {
      IRI
      label
      port_type
      type {
        type_IRI
        type_label
      }
    }
  }
}
`;
export const getEmail = `query GetEmail($subject: String!) {
  getEmail(subject: $subject) {
    subject
    message
    app_id
  }
}
`;
export const listEmails = `query ListEmails(
  $filter: TableEmailFilterInput
  $limit: Int
  $nextToken: String
) {
  listEmails(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      subject
      message
      app_id
    }
    nextToken
  }
}
`;
