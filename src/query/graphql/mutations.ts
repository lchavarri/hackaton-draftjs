// tslint:disable
// this is an auto generated file. This will be overwritten

export const createEidosCeui = `mutation CreateEidosCeui($input: CreateEidosCEUIInput!) {
  createEidosCEUI(input: $input) {
    app_instance_id
    document_id
    content
    active_user
  }
}
`;
export const updateEidosCeui = `mutation UpdateEidosCeui($input: UpdateEidosCEUIInput!) {
  updateEidosCEUI(input: $input) {
    app_instance_id
    document_id
    content
    active_user
  }
}
`;
export const deleteEidosCeui = `mutation DeleteEidosCeui($input: DeleteEidosCEUIInput!) {
  deleteEidosCEUI(input: $input) {
    app_instance_id
    document_id
    content
    active_user
  }
}
`;
export const createEidosQueryUi = `mutation CreateEidosQueryUi($input: CreateEidosQueryUIInput!) {
  createEidosQueryUI(input: $input) {
    app_instance_id
    document_id
    pythonVariableName
    content
    active_user
  }
}
`;
export const updateEidosQueryUi = `mutation UpdateEidosQueryUi($input: UpdateEidosQueryUIInput!) {
  updateEidosQueryUI(input: $input) {
    app_instance_id
    document_id
    pythonVariableName
    content
    active_user
  }
}
`;
export const deleteEidosQueryUi = `mutation DeleteEidosQueryUi($input: DeleteEidosQueryUIInput!) {
  deleteEidosQueryUI(input: $input) {
    app_instance_id
    document_id
    pythonVariableName
    content
    active_user
  }
}
`;
export const createQueryPattern = `mutation CreateQueryPattern($input: CreateQueryPatternInput!) {
  createQueryPattern(input: $input) {
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
export const updateQueryPattern = `mutation UpdateQueryPattern($input: UpdateQueryPatternInput!) {
  updateQueryPattern(input: $input) {
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
export const deleteQueryPattern = `mutation DeleteQueryPattern($input: DeleteQueryPatternInput!) {
  deleteQueryPattern(input: $input) {
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
export const createEidosLabLibraryType = `mutation CreateEidosLabLibraryType($input: CreateEidosLabLibraryTypeInput!) {
  createEidosLabLibraryType(input: $input) {
    type_IRI
    type_label
  }
}
`;
export const updateEidosLabLibraryType = `mutation UpdateEidosLabLibraryType($input: UpdateEidosLabLibraryTypeInput!) {
  updateEidosLabLibraryType(input: $input) {
    type_IRI
    type_label
  }
}
`;
export const deleteEidosLabLibraryType = `mutation DeleteEidosLabLibraryType($input: DeleteEidosLabLibraryTypeInput!) {
  deleteEidosLabLibraryType(input: $input) {
    type_IRI
    type_label
  }
}
`;
export const createEidosLabLibraryPort = `mutation CreateEidosLabLibraryPort($input: CreateEidosLabLibraryPortInput!) {
  createEidosLabLibraryPort(input: $input) {
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
export const updateEidosLabLibraryPort = `mutation UpdateEidosLabLibraryPort($input: UpdateEidosLabLibraryPortInput!) {
  updateEidosLabLibraryPort(input: $input) {
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
export const deleteEidosLabLibraryPort = `mutation DeleteEidosLabLibraryPort($input: DeleteEidosLabLibraryPortInput!) {
  deleteEidosLabLibraryPort(input: $input) {
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
export const createEidosLabLibraryItem = `mutation CreateEidosLabLibraryItem($input: CreateEidosLabLibraryItemInput!) {
  createEidosLabLibraryItem(input: $input) {
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
export const updateEidosLabLibraryItem = `mutation UpdateEidosLabLibraryItem($input: UpdateEidosLabLibraryItemInput!) {
  updateEidosLabLibraryItem(input: $input) {
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
export const deleteEidosLabLibraryItem = `mutation DeleteEidosLabLibraryItem($input: DeleteEidosLabLibraryItemInput!) {
  deleteEidosLabLibraryItem(input: $input) {
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
export const createEmail = `mutation CreateEmail($input: CreateEmailInput!) {
  createEmail(input: $input) {
    subject
    message
    app_id
  }
}
`;
export const updateEmail = `mutation UpdateEmail($input: UpdateEmailInput!) {
  updateEmail(input: $input) {
    subject
    message
    app_id
  }
}
`;
export const deleteEmail = `mutation DeleteEmail($input: DeleteEmailInput!) {
  deleteEmail(input: $input) {
    subject
    message
    app_id
  }
}
`;
