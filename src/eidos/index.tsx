import "semantic-ui-css/semantic.min.css";
import React from "react";
import ReactDOM from "react-dom";

import Main from "../shared/ui/main/main";
import * as applicationContext from "../shared/ui/utils/applicationContext";

import "./index.scss";
import App from "./components/App";

declare global {
  interface Window {
    quip: any;
  }
}

export default () => {
  return (
    <Main appName="Eidos Session">
      <App />
    </Main>
  );
};

/* const rootRender = (rootNode: any) => {
  ReactDOM.render(
    <Main styles={{}} appName="Eidos Session">
      <App />
    </Main>,
    rootNode
  );
};

applicationContext.rootRender(rootRender); */
