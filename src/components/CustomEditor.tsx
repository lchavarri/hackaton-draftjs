import React, { useState, useContext } from "react";
import { Editor, RichUtils } from "draft-js";

import { addEntity } from "../utils/DraftUtils";
import DraftControls from "./DraftControls";
import CustomBlockRenderer from "./CustomRenderer";
import { AppContext } from "../App";

import "../assets/Draft.scss";
import "../assets/DraftOverrides.scss";
import "../assets/RichEditor.scss";

const customBlockStyler = contentBlock => {
  const type = contentBlock.getType();
  if (type === "blockquote") {
    return "superFancyBlockquote";
  }
};

const CustomEditor = (props: any) => {
  const { editorState, mutateEditorState, readOnlyMode } = useContext(
    AppContext
  );

  const [videoUrl, setVideoUrl] = useState(
    "https://www.youtube.com/embed/9CS7j5I6aOc?autoplay=true"
  );
  const [imageUrl, setImageUrl] = useState(
    "https://media.giphy.com/media/mWUuD8qPSi5B6/giphy.gif"
  );

  function handleAddMedia(type, src) {
    const newEditorState = addEntity(editorState, {
      type,
      mutability: "IMMUTABLE",
      data: { src }
    });
    mutateEditorState(newEditorState);
  }

  function toggleBlockType(blockType: string) {
    mutateEditorState(RichUtils.toggleBlockType(editorState, blockType));
  }

  function toggleInlineStyle(inlineStyle: string) {
    mutateEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  }

  function handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      mutateEditorState(newState);
      return "handled";
    }
    return "not-handled";
  }

  return (
    <div>
      <div>
        <input
          type="text"
          value={videoUrl}
          onChange={e => setVideoUrl(e.target.value)}
        />
        <button onClick={() => handleAddMedia("video", videoUrl)}>
          Add video
        </button>
      </div>
      <div>
        <input
          type="text"
          value={imageUrl}
          onChange={e => setImageUrl(e.target.value)}
        />
        <button onClick={() => handleAddMedia("image", imageUrl)}>
          Add image
        </button>
      </div>
      <div>
        <button onClick={() => handleAddMedia("eidos", imageUrl)}>
          Add Session
        </button>
      </div>
      <div>
        <button onClick={() => handleAddMedia("query", imageUrl)}>
          Add Query
        </button>
      </div>
      <DraftControls
        editorState={editorState}
        toggleBlockType={toggleBlockType}
        toggleInlineStyle={toggleInlineStyle}
      ></DraftControls>
      <Editor
        blockRendererFn={CustomBlockRenderer}
        blockStyleFn={customBlockStyler}
        editorState={editorState}
        onChange={mutateEditorState}
        handleKeyCommand={handleKeyCommand}
        readOnly={readOnlyMode}
      />
    </div>
  );
};

export default CustomEditor;
