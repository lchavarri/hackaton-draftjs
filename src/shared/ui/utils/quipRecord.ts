export class RootRecord extends window.quip.apps.RootRecord {
  static getProperties = () => ({
    currentRecord: MyRecord
  });

  static getDefaultProperties = () => ({
    currentRecord: {}
  });
}

export class MyRecord extends window.quip.apps.Record {
  static getProperties = () => ({
    flowId: 'string'
  });

  static getDefaultProperties = () => ({
    flowId: null
  });
}
