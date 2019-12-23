/* tslint:disable */
//  This file was automatically generated and should not be edited.

export type CreateEidosCEUIInput = {
  app_instance_id: string,
  document_id: string,
  content?: string | null,
  active_user?: string | null,
};

export type UpdateEidosCEUIInput = {
  app_instance_id: string,
  document_id: string,
  content?: string | null,
  active_user?: string | null,
};

export type DeleteEidosCEUIInput = {
  app_instance_id: string,
  document_id: string,
};

export type CreateEidosQueryUIInput = {
  app_instance_id: string,
  document_id: string,
  pythonVariableName: string,
  content?: string | null,
  active_user?: string | null,
};

export type UpdateEidosQueryUIInput = {
  app_instance_id: string,
  document_id: string,
  pythonVariableName?: string | null,
  content?: string | null,
  active_user?: string | null,
};

export type DeleteEidosQueryUIInput = {
  app_instance_id: string,
  document_id: string,
};

export type CreateQueryPatternInput = {
  document: string,
  name: string,
  description?: string | null,
  selectedColumns: string,
  groupbyColumns: string,
  filters: string,
  version: number,
  createdAt: string,
  updatedAt: string,
};

export type UpdateQueryPatternInput = {
  document: string,
  name: string,
  description?: string | null,
  selectedColumns?: string | null,
  groupbyColumns?: string | null,
  filters?: string | null,
  version?: number | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type DeleteQueryPatternInput = {
  document: string,
  name: string,
};

export type CreateEidosLabLibraryTypeInput = {
  type_IRI: string,
  type_label: string,
};

export type UpdateEidosLabLibraryTypeInput = {
  type_IRI: string,
  type_label?: string | null,
};

export type DeleteEidosLabLibraryTypeInput = {
  type_IRI: string,
};

export type CreateEidosLabLibraryPortInput = {
  IRI: string,
  label: string,
  port_type: string,
};

export type UpdateEidosLabLibraryPortInput = {
  IRI: string,
  label?: string | null,
  port_type?: string | null,
};

export type DeleteEidosLabLibraryPortInput = {
  IRI: string,
};

export type CreateEidosLabLibraryItemInput = {
  IRI: string,
  label: string,
  description?: string | null,
};

export type UpdateEidosLabLibraryItemInput = {
  IRI: string,
  label?: string | null,
  description?: string | null,
};

export type DeleteEidosLabLibraryItemInput = {
  IRI: string,
};

export type CreateEmailInput = {
  subject: string,
  message: string,
  app_id: string,
};

export type UpdateEmailInput = {
  subject: string,
  message?: string | null,
  app_id?: string | null,
};

export type DeleteEmailInput = {
  subject: string,
};

export type TableEidosCEUIFilterInput = {
  app_instance_id?: TableStringFilterInput | null,
  document_id?: TableStringFilterInput | null,
  active_user?: TableStringFilterInput | null,
};

export type TableStringFilterInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export type TableEidosQueryUIFilterInput = {
  app_instance_id?: TableStringFilterInput | null,
  document_id?: TableStringFilterInput | null,
  pythonVariableName?: TableStringFilterInput | null,
  active_user?: TableStringFilterInput | null,
};

export type TableQueryPatternFilterInput = {
  document?: TableStringFilterInput | null,
  name?: TableStringFilterInput | null,
  description?: TableStringFilterInput | null,
  version?: TableIntFilterInput | null,
  createdAt?: TableStringFilterInput | null,
  updatedAt?: TableStringFilterInput | null,
};

export type TableIntFilterInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  contains?: number | null,
  notContains?: number | null,
  between?: Array< number | null > | null,
};

export type TableEidosLabLibraryTypeFilterInput = {
  type_IRI?: TableStringFilterInput | null,
  type_label?: TableStringFilterInput | null,
};

export type TableEidosLabLibraryPortFilterInput = {
  IRI?: TableStringFilterInput | null,
  label?: TableStringFilterInput | null,
  port_type?: TableStringFilterInput | null,
};

export type TableEidosLabLibraryItemFilterInput = {
  IRI?: TableStringFilterInput | null,
  label?: TableStringFilterInput | null,
  description?: TableStringFilterInput | null,
};

export type TableEmailFilterInput = {
  subject?: TableStringFilterInput | null,
  app_id?: TableStringFilterInput | null,
};

export type CreateEidosCeuiMutationVariables = {
  input: CreateEidosCEUIInput,
};

export type CreateEidosCeuiMutation = {
  createEidosCEUI:  {
    __typename: "EidosCEUI",
    app_instance_id: string,
    document_id: string,
    content: string | null,
    active_user: string | null,
  } | null,
};

export type UpdateEidosCeuiMutationVariables = {
  input: UpdateEidosCEUIInput,
};

export type UpdateEidosCeuiMutation = {
  updateEidosCEUI:  {
    __typename: "EidosCEUI",
    app_instance_id: string,
    document_id: string,
    content: string | null,
    active_user: string | null,
  } | null,
};

export type DeleteEidosCeuiMutationVariables = {
  input: DeleteEidosCEUIInput,
};

export type DeleteEidosCeuiMutation = {
  deleteEidosCEUI:  {
    __typename: "EidosCEUI",
    app_instance_id: string,
    document_id: string,
    content: string | null,
    active_user: string | null,
  } | null,
};

export type CreateEidosQueryUiMutationVariables = {
  input: CreateEidosQueryUIInput,
};

export type CreateEidosQueryUiMutation = {
  createEidosQueryUI:  {
    __typename: "EidosQueryUI",
    app_instance_id: string,
    document_id: string,
    pythonVariableName: string,
    content: string | null,
    active_user: string | null,
  } | null,
};

export type UpdateEidosQueryUiMutationVariables = {
  input: UpdateEidosQueryUIInput,
};

export type UpdateEidosQueryUiMutation = {
  updateEidosQueryUI:  {
    __typename: "EidosQueryUI",
    app_instance_id: string,
    document_id: string,
    pythonVariableName: string,
    content: string | null,
    active_user: string | null,
  } | null,
};

export type DeleteEidosQueryUiMutationVariables = {
  input: DeleteEidosQueryUIInput,
};

export type DeleteEidosQueryUiMutation = {
  deleteEidosQueryUI:  {
    __typename: "EidosQueryUI",
    app_instance_id: string,
    document_id: string,
    pythonVariableName: string,
    content: string | null,
    active_user: string | null,
  } | null,
};

export type CreateQueryPatternMutationVariables = {
  input: CreateQueryPatternInput,
};

export type CreateQueryPatternMutation = {
  createQueryPattern:  {
    __typename: "QueryPattern",
    document: string,
    name: string,
    description: string | null,
    selectedColumns: string,
    groupbyColumns: string,
    filters: string,
    version: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateQueryPatternMutationVariables = {
  input: UpdateQueryPatternInput,
};

export type UpdateQueryPatternMutation = {
  updateQueryPattern:  {
    __typename: "QueryPattern",
    document: string,
    name: string,
    description: string | null,
    selectedColumns: string,
    groupbyColumns: string,
    filters: string,
    version: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteQueryPatternMutationVariables = {
  input: DeleteQueryPatternInput,
};

export type DeleteQueryPatternMutation = {
  deleteQueryPattern:  {
    __typename: "QueryPattern",
    document: string,
    name: string,
    description: string | null,
    selectedColumns: string,
    groupbyColumns: string,
    filters: string,
    version: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateEidosLabLibraryTypeMutationVariables = {
  input: CreateEidosLabLibraryTypeInput,
};

export type CreateEidosLabLibraryTypeMutation = {
  createEidosLabLibraryType:  {
    __typename: "EidosLabLibraryType",
    type_IRI: string,
    type_label: string,
  } | null,
};

export type UpdateEidosLabLibraryTypeMutationVariables = {
  input: UpdateEidosLabLibraryTypeInput,
};

export type UpdateEidosLabLibraryTypeMutation = {
  updateEidosLabLibraryType:  {
    __typename: "EidosLabLibraryType",
    type_IRI: string,
    type_label: string,
  } | null,
};

export type DeleteEidosLabLibraryTypeMutationVariables = {
  input: DeleteEidosLabLibraryTypeInput,
};

export type DeleteEidosLabLibraryTypeMutation = {
  deleteEidosLabLibraryType:  {
    __typename: "EidosLabLibraryType",
    type_IRI: string,
    type_label: string,
  } | null,
};

export type CreateEidosLabLibraryPortMutationVariables = {
  input: CreateEidosLabLibraryPortInput,
};

export type CreateEidosLabLibraryPortMutation = {
  createEidosLabLibraryPort:  {
    __typename: "EidosLabLibraryPort",
    IRI: string,
    label: string,
    port_type: string,
    type:  {
      __typename: "EidosLabLibraryType",
      type_IRI: string,
      type_label: string,
    } | null,
  } | null,
};

export type UpdateEidosLabLibraryPortMutationVariables = {
  input: UpdateEidosLabLibraryPortInput,
};

export type UpdateEidosLabLibraryPortMutation = {
  updateEidosLabLibraryPort:  {
    __typename: "EidosLabLibraryPort",
    IRI: string,
    label: string,
    port_type: string,
    type:  {
      __typename: "EidosLabLibraryType",
      type_IRI: string,
      type_label: string,
    } | null,
  } | null,
};

export type DeleteEidosLabLibraryPortMutationVariables = {
  input: DeleteEidosLabLibraryPortInput,
};

export type DeleteEidosLabLibraryPortMutation = {
  deleteEidosLabLibraryPort:  {
    __typename: "EidosLabLibraryPort",
    IRI: string,
    label: string,
    port_type: string,
    type:  {
      __typename: "EidosLabLibraryType",
      type_IRI: string,
      type_label: string,
    } | null,
  } | null,
};

export type CreateEidosLabLibraryItemMutationVariables = {
  input: CreateEidosLabLibraryItemInput,
};

export type CreateEidosLabLibraryItemMutation = {
  createEidosLabLibraryItem:  {
    __typename: "EidosLabLibraryItem",
    IRI: string,
    label: string,
    description: string | null,
    type:  {
      __typename: "EidosLabLibraryType",
      type_IRI: string,
      type_label: string,
    } | null,
    ports:  Array< {
      __typename: "EidosLabLibraryPort",
      IRI: string,
      label: string,
      port_type: string,
      type:  {
        __typename: "EidosLabLibraryType",
        type_IRI: string,
        type_label: string,
      } | null,
    } | null > | null,
  } | null,
};

export type UpdateEidosLabLibraryItemMutationVariables = {
  input: UpdateEidosLabLibraryItemInput,
};

export type UpdateEidosLabLibraryItemMutation = {
  updateEidosLabLibraryItem:  {
    __typename: "EidosLabLibraryItem",
    IRI: string,
    label: string,
    description: string | null,
    type:  {
      __typename: "EidosLabLibraryType",
      type_IRI: string,
      type_label: string,
    } | null,
    ports:  Array< {
      __typename: "EidosLabLibraryPort",
      IRI: string,
      label: string,
      port_type: string,
      type:  {
        __typename: "EidosLabLibraryType",
        type_IRI: string,
        type_label: string,
      } | null,
    } | null > | null,
  } | null,
};

export type DeleteEidosLabLibraryItemMutationVariables = {
  input: DeleteEidosLabLibraryItemInput,
};

export type DeleteEidosLabLibraryItemMutation = {
  deleteEidosLabLibraryItem:  {
    __typename: "EidosLabLibraryItem",
    IRI: string,
    label: string,
    description: string | null,
    type:  {
      __typename: "EidosLabLibraryType",
      type_IRI: string,
      type_label: string,
    } | null,
    ports:  Array< {
      __typename: "EidosLabLibraryPort",
      IRI: string,
      label: string,
      port_type: string,
      type:  {
        __typename: "EidosLabLibraryType",
        type_IRI: string,
        type_label: string,
      } | null,
    } | null > | null,
  } | null,
};

export type CreateEmailMutationVariables = {
  input: CreateEmailInput,
};

export type CreateEmailMutation = {
  createEmail:  {
    __typename: "Email",
    subject: string | null,
    message: string | null,
    app_id: string | null,
  } | null,
};

export type UpdateEmailMutationVariables = {
  input: UpdateEmailInput,
};

export type UpdateEmailMutation = {
  updateEmail:  {
    __typename: "Email",
    subject: string | null,
    message: string | null,
    app_id: string | null,
  } | null,
};

export type DeleteEmailMutationVariables = {
  input: DeleteEmailInput,
};

export type DeleteEmailMutation = {
  deleteEmail:  {
    __typename: "Email",
    subject: string | null,
    message: string | null,
    app_id: string | null,
  } | null,
};

export type GetEidosCeuiQueryVariables = {
  document_id: string,
  app_instance_id: string,
};

export type GetEidosCeuiQuery = {
  getEidosCEUI:  {
    __typename: "EidosCEUI",
    app_instance_id: string,
    document_id: string,
    content: string | null,
    active_user: string | null,
  } | null,
};

export type ListEidosCeuisQueryVariables = {
  filter?: TableEidosCEUIFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListEidosCeuisQuery = {
  listEidosCEUIS:  {
    __typename: "EidosCEUIConnection",
    items:  Array< {
      __typename: "EidosCEUI",
      app_instance_id: string,
      document_id: string,
      content: string | null,
      active_user: string | null,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type GetEidosQueryUiQueryVariables = {
  app_instance_id: string,
  document_id: string,
};

export type GetEidosQueryUiQuery = {
  getEidosQueryUI:  {
    __typename: "EidosQueryUI",
    app_instance_id: string,
    document_id: string,
    pythonVariableName: string,
    content: string | null,
    active_user: string | null,
  } | null,
};

export type ListEidosQueryUisQueryVariables = {
  filter?: TableEidosQueryUIFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListEidosQueryUisQuery = {
  listEidosQueryUIS:  {
    __typename: "EidosQueryUIConnection",
    items:  Array< {
      __typename: "EidosQueryUI",
      app_instance_id: string,
      document_id: string,
      pythonVariableName: string,
      content: string | null,
      active_user: string | null,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type ListAllEidosQueryUisQueryVariables = {
  filter?: TableEidosQueryUIFilterInput | null,
};

export type ListAllEidosQueryUisQuery = {
  listAllEidosQueryUIS:  {
    __typename: "EidosQueryUIConnection",
    items:  Array< {
      __typename: "EidosQueryUI",
      app_instance_id: string,
      document_id: string,
      pythonVariableName: string,
      content: string | null,
      active_user: string | null,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type ListAllLibrariesQuery = {
  listAllLibraries:  {
    __typename: "ParentClass",
    ActionClass:  Array< {
      __typename: "ActionClass",
      id: string | null,
      added_by: string | null,
      description: string | null,
      modifying: boolean | null,
      name: string | null,
      schema: string | null,
      uid: string | null,
    } | null > | null,
    EquipmentClass:  Array< {
      __typename: "EquipmentClass",
      id: string | null,
      added_by: string | null,
      description: string | null,
      uid: string | null,
      name: string | null,
      schema: string | null,
    } | null > | null,
    FunctionClass:  Array< {
      __typename: "FunctionClass",
      id: string | null,
      added_by: string | null,
      name: string | null,
      description: string | null,
      schema: string | null,
      uid: string | null,
    } | null > | null,
    GroupClass:  Array< {
      __typename: "GroupClass",
      id: string | null,
      added_by: string | null,
      description: string | null,
      name: string | null,
      schema: string | null,
      uid: string | null,
    } | null > | null,
    MeasurementClass:  Array< {
      __typename: "MeasurementClass",
      id: string | null,
      added_by: string | null,
      name: string | null,
      description: string | null,
      schema: string | null,
      uid: string | null,
    } | null > | null,
    ObjectClass:  Array< {
      __typename: "ObjectClass",
      id: string | null,
      added_by: string | null,
      description: string | null,
      name: string | null,
      schema: string | null,
      uid: string | null,
    } | null > | null,
    PropertyClass:  Array< {
      __typename: "PropertyClass",
      id: string | null,
      added_by: string | null,
      description: string | null,
      name: string | null,
      schema: string | null,
      uid: string | null,
    } | null > | null,
  } | null,
};

export type GetQueryPatternQueryVariables = {
  document: string,
  name: string,
};

export type GetQueryPatternQuery = {
  getQueryPattern:  {
    __typename: "QueryPattern",
    document: string,
    name: string,
    description: string | null,
    selectedColumns: string,
    groupbyColumns: string,
    filters: string,
    version: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListQueryPatternsQueryVariables = {
  filter?: TableQueryPatternFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListQueryPatternsQuery = {
  listQueryPatterns:  {
    __typename: "QueryPatternConnection",
    items:  Array< {
      __typename: "QueryPattern",
      document: string,
      name: string,
      description: string | null,
      selectedColumns: string,
      groupbyColumns: string,
      filters: string,
      version: number,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type GetEidosLabLibraryTypeQueryVariables = {
  type_IRI: string,
};

export type GetEidosLabLibraryTypeQuery = {
  getEidosLabLibraryType:  {
    __typename: "EidosLabLibraryType",
    type_IRI: string,
    type_label: string,
  } | null,
};

export type ListEidosLabLibraryTypesQueryVariables = {
  filter?: TableEidosLabLibraryTypeFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListEidosLabLibraryTypesQuery = {
  listEidosLabLibraryTypes:  Array< {
    __typename: "EidosLabLibraryType",
    type_IRI: string,
    type_label: string,
  } | null > | null,
};

export type GetEidosLabLibraryPortQueryVariables = {
  IRI: string,
};

export type GetEidosLabLibraryPortQuery = {
  getEidosLabLibraryPort:  {
    __typename: "EidosLabLibraryPort",
    IRI: string,
    label: string,
    port_type: string,
    type:  {
      __typename: "EidosLabLibraryType",
      type_IRI: string,
      type_label: string,
    } | null,
  } | null,
};

export type ListEidosLabLibraryPortsQueryVariables = {
  filter?: TableEidosLabLibraryPortFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListEidosLabLibraryPortsQuery = {
  listEidosLabLibraryPorts:  Array< {
    __typename: "EidosLabLibraryPort",
    IRI: string,
    label: string,
    port_type: string,
    type:  {
      __typename: "EidosLabLibraryType",
      type_IRI: string,
      type_label: string,
    } | null,
  } | null > | null,
};

export type GetEidosLabLibraryItemQueryVariables = {
  IRI: string,
};

export type GetEidosLabLibraryItemQuery = {
  getEidosLabLibraryItem:  {
    __typename: "EidosLabLibraryItem",
    IRI: string,
    label: string,
    description: string | null,
    type:  {
      __typename: "EidosLabLibraryType",
      type_IRI: string,
      type_label: string,
    } | null,
    ports:  Array< {
      __typename: "EidosLabLibraryPort",
      IRI: string,
      label: string,
      port_type: string,
      type:  {
        __typename: "EidosLabLibraryType",
        type_IRI: string,
        type_label: string,
      } | null,
    } | null > | null,
  } | null,
};

export type ListEidosLabLibraryItemsQueryVariables = {
  filter?: TableEidosLabLibraryItemFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListEidosLabLibraryItemsQuery = {
  listEidosLabLibraryItems:  Array< {
    __typename: "EidosLabLibraryItem",
    IRI: string,
    label: string,
    description: string | null,
    type:  {
      __typename: "EidosLabLibraryType",
      type_IRI: string,
      type_label: string,
    } | null,
    ports:  Array< {
      __typename: "EidosLabLibraryPort",
      IRI: string,
      label: string,
      port_type: string,
      type:  {
        __typename: "EidosLabLibraryType",
        type_IRI: string,
        type_label: string,
      } | null,
    } | null > | null,
  } | null > | null,
};

export type GetEmailQueryVariables = {
  subject: string,
};

export type GetEmailQuery = {
  getEmail:  {
    __typename: "Email",
    subject: string | null,
    message: string | null,
    app_id: string | null,
  } | null,
};

export type ListEmailsQueryVariables = {
  filter?: TableEmailFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListEmailsQuery = {
  listEmails:  {
    __typename: "EmailConnection",
    items:  Array< {
      __typename: "Email",
      subject: string | null,
      message: string | null,
      app_id: string | null,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type OnCreateEidosCeuiSubscriptionVariables = {
  app_instance_id?: string | null,
  document_id?: string | null,
};

export type OnCreateEidosCeuiSubscription = {
  onCreateEidosCEUI:  {
    __typename: "EidosCEUI",
    app_instance_id: string,
    document_id: string,
    content: string | null,
    active_user: string | null,
  } | null,
};

export type OnUpdateEidosCeuiSubscriptionVariables = {
  app_instance_id?: string | null,
  document_id?: string | null,
};

export type OnUpdateEidosCeuiSubscription = {
  onUpdateEidosCEUI:  {
    __typename: "EidosCEUI",
    app_instance_id: string,
    document_id: string,
    content: string | null,
    active_user: string | null,
  } | null,
};

export type OnDeleteEidosCeuiSubscriptionVariables = {
  app_instance_id?: string | null,
  document_id?: string | null,
};

export type OnDeleteEidosCeuiSubscription = {
  onDeleteEidosCEUI:  {
    __typename: "EidosCEUI",
    app_instance_id: string,
    document_id: string,
    content: string | null,
    active_user: string | null,
  } | null,
};

export type OnCreateEidosQueryUiSubscriptionVariables = {
  app_instance_id?: string | null,
  document_id?: string | null,
};

export type OnCreateEidosQueryUiSubscription = {
  onCreateEidosQueryUI:  {
    __typename: "EidosQueryUI",
    app_instance_id: string,
    document_id: string,
    pythonVariableName: string,
    content: string | null,
    active_user: string | null,
  } | null,
};

export type OnUpdateEidosQueryUiSubscriptionVariables = {
  app_instance_id?: string | null,
  document_id?: string | null,
};

export type OnUpdateEidosQueryUiSubscription = {
  onUpdateEidosQueryUI:  {
    __typename: "EidosQueryUI",
    app_instance_id: string,
    document_id: string,
    pythonVariableName: string,
    content: string | null,
    active_user: string | null,
  } | null,
};

export type OnDeleteEidosQueryUiSubscriptionVariables = {
  app_instance_id?: string | null,
  document_id?: string | null,
};

export type OnDeleteEidosQueryUiSubscription = {
  onDeleteEidosQueryUI:  {
    __typename: "EidosQueryUI",
    app_instance_id: string,
    document_id: string,
    pythonVariableName: string,
    content: string | null,
    active_user: string | null,
  } | null,
};

export type OnCreateQueryPatternSubscriptionVariables = {
  document?: string | null,
  name?: string | null,
};

export type OnCreateQueryPatternSubscription = {
  onCreateQueryPattern:  {
    __typename: "QueryPattern",
    document: string,
    name: string,
    description: string | null,
    selectedColumns: string,
    groupbyColumns: string,
    filters: string,
    version: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateQueryPatternSubscriptionVariables = {
  document?: string | null,
  name?: string | null,
};

export type OnUpdateQueryPatternSubscription = {
  onUpdateQueryPattern:  {
    __typename: "QueryPattern",
    document: string,
    name: string,
    description: string | null,
    selectedColumns: string,
    groupbyColumns: string,
    filters: string,
    version: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteQueryPatternSubscriptionVariables = {
  document?: string | null,
  name?: string | null,
};

export type OnDeleteQueryPatternSubscription = {
  onDeleteQueryPattern:  {
    __typename: "QueryPattern",
    document: string,
    name: string,
    description: string | null,
    selectedColumns: string,
    groupbyColumns: string,
    filters: string,
    version: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateEidosLabLibraryTypeSubscriptionVariables = {
  type_IRI?: string | null,
  type_label?: string | null,
};

export type OnCreateEidosLabLibraryTypeSubscription = {
  onCreateEidosLabLibraryType:  {
    __typename: "EidosLabLibraryType",
    type_IRI: string,
    type_label: string,
  } | null,
};

export type OnUpdateEidosLabLibraryTypeSubscriptionVariables = {
  type_IRI?: string | null,
  type_label?: string | null,
};

export type OnUpdateEidosLabLibraryTypeSubscription = {
  onUpdateEidosLabLibraryType:  {
    __typename: "EidosLabLibraryType",
    type_IRI: string,
    type_label: string,
  } | null,
};

export type OnDeleteEidosLabLibraryTypeSubscriptionVariables = {
  type_IRI?: string | null,
  type_label?: string | null,
};

export type OnDeleteEidosLabLibraryTypeSubscription = {
  onDeleteEidosLabLibraryType:  {
    __typename: "EidosLabLibraryType",
    type_IRI: string,
    type_label: string,
  } | null,
};

export type OnCreateEidosLabLibraryPortSubscriptionVariables = {
  IRI?: string | null,
  label?: string | null,
  port_type?: string | null,
};

export type OnCreateEidosLabLibraryPortSubscription = {
  onCreateEidosLabLibraryPort:  {
    __typename: "EidosLabLibraryPort",
    IRI: string,
    label: string,
    port_type: string,
    type:  {
      __typename: "EidosLabLibraryType",
      type_IRI: string,
      type_label: string,
    } | null,
  } | null,
};

export type OnUpdateEidosLabLibraryPortSubscriptionVariables = {
  IRI?: string | null,
  label?: string | null,
  port_type?: string | null,
};

export type OnUpdateEidosLabLibraryPortSubscription = {
  onUpdateEidosLabLibraryPort:  {
    __typename: "EidosLabLibraryPort",
    IRI: string,
    label: string,
    port_type: string,
    type:  {
      __typename: "EidosLabLibraryType",
      type_IRI: string,
      type_label: string,
    } | null,
  } | null,
};

export type OnDeleteEidosLabLibraryPortSubscriptionVariables = {
  IRI?: string | null,
  label?: string | null,
  port_type?: string | null,
};

export type OnDeleteEidosLabLibraryPortSubscription = {
  onDeleteEidosLabLibraryPort:  {
    __typename: "EidosLabLibraryPort",
    IRI: string,
    label: string,
    port_type: string,
    type:  {
      __typename: "EidosLabLibraryType",
      type_IRI: string,
      type_label: string,
    } | null,
  } | null,
};

export type OnCreateEidosLabLibraryItemSubscriptionVariables = {
  IRI?: string | null,
  label?: string | null,
  description?: string | null,
};

export type OnCreateEidosLabLibraryItemSubscription = {
  onCreateEidosLabLibraryItem:  {
    __typename: "EidosLabLibraryItem",
    IRI: string,
    label: string,
    description: string | null,
    type:  {
      __typename: "EidosLabLibraryType",
      type_IRI: string,
      type_label: string,
    } | null,
    ports:  Array< {
      __typename: "EidosLabLibraryPort",
      IRI: string,
      label: string,
      port_type: string,
      type:  {
        __typename: "EidosLabLibraryType",
        type_IRI: string,
        type_label: string,
      } | null,
    } | null > | null,
  } | null,
};

export type OnUpdateEidosLabLibraryItemSubscriptionVariables = {
  IRI?: string | null,
  label?: string | null,
  description?: string | null,
};

export type OnUpdateEidosLabLibraryItemSubscription = {
  onUpdateEidosLabLibraryItem:  {
    __typename: "EidosLabLibraryItem",
    IRI: string,
    label: string,
    description: string | null,
    type:  {
      __typename: "EidosLabLibraryType",
      type_IRI: string,
      type_label: string,
    } | null,
    ports:  Array< {
      __typename: "EidosLabLibraryPort",
      IRI: string,
      label: string,
      port_type: string,
      type:  {
        __typename: "EidosLabLibraryType",
        type_IRI: string,
        type_label: string,
      } | null,
    } | null > | null,
  } | null,
};

export type OnDeleteEidosLabLibraryItemSubscriptionVariables = {
  IRI?: string | null,
  label?: string | null,
  description?: string | null,
};

export type OnDeleteEidosLabLibraryItemSubscription = {
  onDeleteEidosLabLibraryItem:  {
    __typename: "EidosLabLibraryItem",
    IRI: string,
    label: string,
    description: string | null,
    type:  {
      __typename: "EidosLabLibraryType",
      type_IRI: string,
      type_label: string,
    } | null,
    ports:  Array< {
      __typename: "EidosLabLibraryPort",
      IRI: string,
      label: string,
      port_type: string,
      type:  {
        __typename: "EidosLabLibraryType",
        type_IRI: string,
        type_label: string,
      } | null,
    } | null > | null,
  } | null,
};

export type OnCreateEmailSubscriptionVariables = {
  subject?: string | null,
  message?: string | null,
  app_id?: string | null,
};

export type OnCreateEmailSubscription = {
  onCreateEmail:  {
    __typename: "Email",
    subject: string | null,
    message: string | null,
    app_id: string | null,
  } | null,
};

export type OnUpdateEmailSubscriptionVariables = {
  subject?: string | null,
  message?: string | null,
  app_id?: string | null,
};

export type OnUpdateEmailSubscription = {
  onUpdateEmail:  {
    __typename: "Email",
    subject: string | null,
    message: string | null,
    app_id: string | null,
  } | null,
};

export type OnDeleteEmailSubscriptionVariables = {
  subject?: string | null,
  message?: string | null,
  app_id?: string | null,
};

export type OnDeleteEmailSubscription = {
  onDeleteEmail:  {
    __typename: "Email",
    subject: string | null,
    message: string | null,
    app_id: string | null,
  } | null,
};
