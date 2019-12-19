import React from "react";

import DemoEditor from "./DemoEditor";
import MediaEditorExample from "./MediaEditor";
import CustomEditor from "./CustomBlockEditor";
import "./App.scss";

export default function App() {
  return (
    <div className="app-wrapper">
      <DemoEditor></DemoEditor>
      <MediaEditorExample></MediaEditorExample>
      <CustomEditor></CustomEditor>
    </div>
  );
}
