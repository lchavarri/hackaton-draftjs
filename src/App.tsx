import React, { useEffect, useState, createContext } from "react";

import CustomEditor from "./components/CustomEditor";
import * as EditorService from "./utils/EditorService";

import "./App.scss";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";

export type IAppContext = {
  editorState?: any;
  mutateEditorState?: (e: EditorState) => void;
  readOnlyMode?: boolean;
  setReadOnlyMode?: Function;
};

export const AppContext = createContext<IAppContext>({});

export default function App() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [readOnlyMode, setReadOnlyMode] = useState(false);

  useEffect(() => {
    EditorService.connectEditor(
      "testraw",
      convertToRaw(editorState.getCurrentContent()),
      newRawState => {
        const oldRawState = convertToRaw(editorState.getCurrentContent());
        if (JSON.stringify(newRawState) != JSON.stringify(oldRawState)) {
          const content = convertFromRaw(newRawState);
          setEditorState(EditorState.createWithContent(content));
        }
      }
    );
  });

  function mutateEditorState(newEditorState: EditorState) {
    setEditorState(newEditorState);

    const oldRawContent = convertToRaw(editorState.getCurrentContent());
    const newRawContent = convertToRaw(newEditorState.getCurrentContent());
    EditorService.updateEditor("testraw", oldRawContent, newRawContent);
  }

  return (
    <AppContext.Provider
      value={{ editorState, mutateEditorState, readOnlyMode, setReadOnlyMode }}
    >
      <div className="app-wrapper" onDoubleClick={() => setReadOnlyMode(false)}>
        <CustomEditor
          editorState={editorState}
          mutateEditorState={mutateEditorState}
        ></CustomEditor>
      </div>
    </AppContext.Provider>
  );
}
