import * as serviceWorker from '../serviceWorker';

export const rootRecord = () =>
  window.quip ? window.quip.apps.getRootRecord() : '';
export const quipAppId = () =>
  window.quip ? window.quip.apps.getRootRecordId() : '';
export const liveAppUniqueId = () =>
  window.quip ? rootRecord().getUniqueId() : '';
export const quipDocumentId = () =>
  window.quip ? window.quip.apps.getThreadId() : '';
export const quipUserId = () =>
  window.quip ? window.quip.apps.getViewingUser().getId() : '';

export const isQuipApp = () => !!window.quip;

export const currentAppRecord = () =>
  window.quip ? rootRecord().get('currentRecord') : {};

export const rootRender = (rootRender: Function) => {
  if (isQuipApp()) {
    const { RootRecord, MyRecord } = require('./quipRecord');

    window.quip.apps.registerClass(RootRecord, 'root-record');
    window.quip.apps.registerClass(MyRecord, 'my-record');

    window.quip.apps.initialize({
      initializationCallback: function(rootNode: any) {
        rootRender(rootNode);
      }
    });
  } else {
    rootRender(document.getElementById('root'));

    // If you want your app to work offline and load faster, you can change
    // unregister() to register() below. Note this comes with some pitfalls.
    // Learn more about service workers: http://bit.ly/CRA-PWA
    serviceWorker.unregister();
  }
};

export const getUserPreferences = (name: string) => {
  var prefs = window.quip.apps.getUserPreferences();
  return prefs.getForKey(`${name}-${window.quip.apps.getThreadId()}`);
};

export const setUserPreferences = (name: string, value: string) => {
  var prefs = window.quip.apps.getUserPreferences();
  let p: any = {};
  p[`${name}-${window.quip.apps.getThreadId()}`] = value;
  prefs.save(p);
};
