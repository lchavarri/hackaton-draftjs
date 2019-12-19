import * as React from "react";
import * as ReactDOM from "react-dom";
import quip from "quip-apps-api";
import App from "./App";

export class ParcelApp {
  private _appName: string = "Quip Live App!";

  constructor() {
    this.render();
  }

  private render(): void {
    if (process.env.NODE_ENV === "development") {
      ReactDOM.render(
        React.createElement(App, { app: this }),
        document.getElementById("app")
      );
    } else {
      quip.apps.initialize({
        initializationCallback: function(rootNode) {
          ReactDOM.render(React.createElement(App, { app: this }), rootNode);
        }
      });
    }
  }

  public get appName(): string {
    return this._appName;
  }
}

new ParcelApp();
