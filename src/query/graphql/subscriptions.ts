// tslint:disable
// this is an auto generated file. This will be overwritten

export const onCreateEidosCeui = `subscription OnCreateEidosCeui($app_instance_id: String, $document_id: String) {
  onCreateEidosCEUI(
    app_instance_id: $app_instance_id
    document_id: $document_id
  ) {
    app_instance_id
    document_id
    content
    active_user
  }
}
`;
export const onUpdateEidosCeui = `subscription OnUpdateEidosCeui($app_instance_id: String, $document_id: String) {
  onUpdateEidosCEUI(
    app_instance_id: $app_instance_id
    document_id: $document_id
  ) {
    app_instance_id
    document_id
    content
    active_user
  }
}
`;
export const onDeleteEidosCeui = `subscription OnDeleteEidosCeui($app_instance_id: String, $document_id: String) {
  onDeleteEidosCEUI(
    app_instance_id: $app_instance_id
    document_id: $document_id
  ) {
    app_instance_id
    document_id
    content
    active_user
  }
}
`;
export const onCreateEidosQueryUi = `subscription OnCreateEidosQueryUi(
  $app_instance_id: String
  $document_id: String
) {
  onCreateEidosQueryUI(
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
export const onUpdateEidosQueryUi = `subscription OnUpdateEidosQueryUi(
  $app_instance_id: String
  $document_id: String
) {
  onUpdateEidosQueryUI(
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
export const onDeleteEidosQueryUi = `subscription OnDeleteEidosQueryUi(
  $app_instance_id: String
  $document_id: String
) {
  onDeleteEidosQueryUI(
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
export const onCreateQueryPattern = `subscription OnCreateQueryPattern($document: String, $name: String) {
  onCreateQueryPattern(document: $document, name: $name) {
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
export const onUpdateQueryPattern = `subscription OnUpdateQueryPattern($document: String, $name: String) {
  onUpdateQueryPattern(document: $document, name: $name) {
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
export const onDeleteQueryPattern = `subscription OnDeleteQueryPattern($document: String, $name: String) {
  onDeleteQueryPattern(document: $document, name: $name) {
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
export const onCreateEidosLabLibraryType = `subscription OnCreateEidosLabLibraryType(
  $type_IRI: String
  $type_label: String
) {
  onCreateEidosLabLibraryType(type_IRI: $type_IRI, type_label: $type_label) {
    type_IRI
    type_label
  }
}
`;
export const onUpdateEidosLabLibraryType = `subscription OnUpdateEidosLabLibraryType(
  $type_IRI: String
  $type_label: String
) {
  onUpdateEidosLabLibraryType(type_IRI: $type_IRI, type_label: $type_label) {
    type_IRI
    type_label
  }
}
`;
export const onDeleteEidosLabLibraryType = `subscription OnDeleteEidosLabLibraryType(
  $type_IRI: String
  $type_label: String
) {
  onDeleteEidosLabLibraryType(type_IRI: $type_IRI, type_label: $type_label) {
    type_IRI
    type_label
  }
}
`;
export const onCreateEidosLabLibraryPort = `subscription OnCreateEidosLabLibraryPort(
  $IRI: String
  $label: String
  $port_type: String
) {
  onCreateEidosLabLibraryPort(IRI: $IRI, label: $label, port_type: $port_type) {
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
export const onUpdateEidosLabLibraryPort = `subscription OnUpdateEidosLabLibraryPort(
  $IRI: String
  $label: String
  $port_type: String
) {
  onUpdateEidosLabLibraryPort(IRI: $IRI, label: $label, port_type: $port_type) {
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
export const onDeleteEidosLabLibraryPort = `subscription OnDeleteEidosLabLibraryPort(
  $IRI: String
  $label: String
  $port_type: String
) {
  onDeleteEidosLabLibraryPort(IRI: $IRI, label: $label, port_type: $port_type) {
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
export const onCreateEidosLabLibraryItem = `subscription OnCreateEidosLabLibraryItem(
  $IRI: String
  $label: String
  $description: String
) {
  onCreateEidosLabLibraryItem(
    IRI: $IRI
    label: $label
    description: $description
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
export const onUpdateEidosLabLibraryItem = `subscription OnUpdateEidosLabLibraryItem(
  $IRI: String
  $label: String
  $description: String
) {
  onUpdateEidosLabLibraryItem(
    IRI: $IRI
    label: $label
    description: $description
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
export const onDeleteEidosLabLibraryItem = `subscription OnDeleteEidosLabLibraryItem(
  $IRI: String
  $label: String
  $description: String
) {
  onDeleteEidosLabLibraryItem(
    IRI: $IRI
    label: $label
    description: $description
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
export const onCreateEmail = `subscription OnCreateEmail(
  $subject: String
  $message: AWSJSON
  $app_id: String
) {
  onCreateEmail(subject: $subject, message: $message, app_id: $app_id) {
    subject
    message
    app_id
  }
}
`;
export const onUpdateEmail = `subscription OnUpdateEmail(
  $subject: String
  $message: AWSJSON
  $app_id: String
) {
  onUpdateEmail(subject: $subject, message: $message, app_id: $app_id) {
    subject
    message
    app_id
  }
}
`;
export const onDeleteEmail = `subscription OnDeleteEmail(
  $subject: String
  $message: AWSJSON
  $app_id: String
) {
  onDeleteEmail(subject: $subject, message: $message, app_id: $app_id) {
    subject
    message
    app_id
  }
}
`;
