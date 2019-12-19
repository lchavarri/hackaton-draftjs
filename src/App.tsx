import React, { useEffect, useState } from "react";

import CustomEditor from "./components/CustomEditor";

import "./App.scss";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";

export default function App() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [timestamp, setTimestamp] = useState(new Date().getTime());

  let interval;
  useEffect(() => {
    interval = setInterval(() => {
      const storedTimestamp: number = +localStorage.getItem("timestamp");
      if (storedTimestamp > timestamp) {
        const storedEditorState = convertFromRaw(
          JSON.parse(localStorage.getItem("editor"))
        );
        setTimestamp(storedTimestamp);
        setEditorState(EditorState.createWithContent(storedEditorState));
      }
    }, 100);
    return () => clearInterval(interval);
  }, [timestamp]);

  function mutateEditorState(newEditorState: EditorState) {
    const newTimestamp = new Date().getTime();

    localStorage.setItem("timestamp", newTimestamp.toString());
    localStorage.setItem(
      "editor",
      JSON.stringify(convertToRaw(newEditorState.getCurrentContent()))
    );

    setTimestamp(newTimestamp);
    setEditorState(newEditorState);
  }

  return (
    <div className="app-wrapper">
      <CustomEditor
        editorState={editorState}
        mutateEditorState={mutateEditorState}
      ></CustomEditor>
    </div>
  );
}
