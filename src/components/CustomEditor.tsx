import React, { useState } from "react";
import { Editor, EditorState, RichUtils } from "draft-js";

import BlockStyleControls from "./BlockStylesControls";
import InlineStyleControls from "./InlineStylesControls";
import Video from "./VideoRenderer";
import { addEntity } from "../utils/DraftUtils";

import "../assets/Draft.scss";
import "../assets/DraftOverrides.scss";
import "../assets/RichEditor.scss";

const customBlockRenderer = block => {
  console.log("$$$ customBlockRenderer render");
  if (block.getType() !== "atomic") {
    return null;
  }

  return {
    component: Video,
    editable: false
  };
};

const customBlockStyler = contentBlock => {
  const type = contentBlock.getType();
  if (type === "blockquote") {
    return "superFancyBlockquote";
  }
};

const CustomEditor = (props: any) => {
  console.log("$$$ Custom Editor");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [url, setUrl] = useState(
    "https://www.youtube.com/embed/9CS7j5I6aOc?autoplay=true"
  );

  const handleConfirm = () => {
    const newEditorState = addEntity(editorState, {
      type: "custom",
      mutability: "IMMUTABLE",
      data: { src: url }
    });
    setEditorState(newEditorState);
  };

  function toggleBlockType(blockType: string) {
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  }

  function toggleInlineStyle(inlineStyle: string) {
    setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  }

  function handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  }

  return (
    <div>
      <input type="text" value={url} onChange={e => setUrl(e.target.value)} />
      <button onClick={handleConfirm}>Add video</button>
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
        blockRendererFn={customBlockRenderer}
        blockStyleFn={customBlockStyler}
        editorState={editorState}
        onChange={editorState => setEditorState(editorState)}
        handleKeyCommand={handleKeyCommand}
      />
    </div>
  );
};

export default CustomEditor;
