import React, { useState, useEffect, useRef, createContext } from 'react';

import * as storage from '../utils/storage';
import * as apiService from '../services/apiservice';
import * as applicationContext from '../utils/applicationContext';
import LoginForm from './loginForm';
import ApolloApp from './apolloapp';
import QuipApp from './quipApp';
import ActionsMenu from './actionsMenu';
import Loading from './loading';

export const Context = createContext<any>({});

export default function Main(props: any) {
  const [loading, setLoading] = useState(false);
  const [logged, setLogged] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [actionsMenu, setActionsMenu] = useState<any>(null);
  const appContainerRef = useRef<any>(null);

  useEffect(() => {
    const params = {
      token_id: storage.get('token_id')
    };
    apiService
      .httpPost('/session', params, {})
      .then(res => {
        if (res.data && res.status === 200) {
          setLogged(true);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const loader = <Loading appName={props.appName} />;
  if (loading) {
    return loader;
  }

  const App = (
    <div className="app-main main" ref={appContainerRef}>
      <ApolloApp>{props.children}</ApolloApp>
    </div>
  );

  if (applicationContext.isQuipApp()) {
    return (
      <QuipApp
        styles={props.styles}
        loader={loader}
        appName={props.appName}
        appContainerRef={appContainerRef}
      >
        {App}
      </QuipApp>
    );
  }

  if (!logged) {
    return (
      <LoginForm
        onLoginSuccess={() => {
          setLogged(true);
        }}
      />
    );
  }

  return (
    <Context.Provider
      value={{
        isQuipApp: false,
        setActionsMenu,
        fullscreen,
        setFullscreen,
        liveAppInstanceId: 'standalone',
        documentId: 'standalone_doc',
        appContainerRef,
        // Standalone implementation for Quip record features
        currentRecord: {
          get: storage.get,
          set: storage.set
        }
      }}
    >
      <ActionsMenu menu={actionsMenu}>{App}</ActionsMenu>
    </Context.Provider>
  );
}
