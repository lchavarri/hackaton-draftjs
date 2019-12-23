import React, { useState } from "react";
import { Editor, EditorState, RichUtils } from "draft-js";

import BlockStyleControls from "../components/BlockStylesControls";
import InlineStyleControls from "../components/InlineStylesControls";

const StyledEditor = (props: any) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  function myBlockStyleFn(contentBlock) {
    const type = contentBlock.getType();
    if (type === "blockquote") {
      return "superFancyBlockquote";
    }
  }

  function handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  }

  function toggleBlockType(blockType: string) {
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  }

  function toggleInlineStyle(inlineStyle: string) {
    setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  }

  return (
    <>
      <div className="controls-wrapper">
        <BlockStyleControls
          editorState={editorState}
          onToggle={toggleBlockType}
        />
        <InlineStyleControls
          editorState={editorState}
          onToggle={toggleInlineStyle}
        />
      </div>
      <Editor
        editorState={editorState}
        onChange={setEditorState}
        handleKeyCommand={handleKeyCommand}
        blockStyleFn={myBlockStyleFn}
      />
    </>
  );
};

export default StyledEditor;
