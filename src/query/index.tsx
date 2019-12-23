import "semantic-ui-css/semantic.min.css";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import Amplify from "aws-amplify";

import Main from "../shared/ui/main/main";
import store from "./redux/store";
import * as applicationContext from "../shared/ui/utils/applicationContext";
import appNames from "../shared/ui/appNames";

import "./index.scss";
import App from "./components/app/App";

Amplify.configure({
  aws_project_region: "us-east-1",
  aws_appsync_graphqlEndpoint: process.env.REACT_APP_APPSYNC_ENDPOINT,
  aws_appsync_region: "us-east-1",
  aws_appsync_authenticationType: "API_KEY",
  aws_appsync_apiKey: process.env.REACT_APP_APPSYNC_API_KEY
});
declare global {
  interface Window {
    quip: any;
  }
}

export default () => (
  <Provider store={store}>
    <Main appName={appNames.EIDOS_QUERY}>
      <App />
    </Main>
  </Provider>
);

/* const rootRender = (rootNode: any) => {
  ReactDOM.render(
    <Provider store={store}>
      <Main appName={appNames.EIDOS_QUERY}>
        <App />
      </Main>
    </Provider>,
    rootNode
  );
};

applicationContext.rootRender(rootRender); */
