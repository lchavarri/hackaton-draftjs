import React, { useState, useMemo } from "react";
import { AtomicBlockUtils, Editor, EditorState, RichUtils } from "draft-js";

import BlockStyleControls from "./BlockStylesControls";
import InlineStyleControls from "./InlineStylesControls";
import "./Draft.scss";
import "./DraftOverrides.scss";
import "./RichEditor.scss";

type IDraftEntity = {
  type: string;
  mutability: "IMMUTABLE" | "MUTABLE" | "SEGMENTED";
  data?: any;
};

const demoUrl = "https://www.youtube.com/embed/9CS7j5I6aOc?autoplay=true";

const Video = props => {
  const entity = props.contentState.getEntity(props.block.getEntityAt(0));
  const { src } = entity.getData();
  const memoizedJsx = useMemo(() => {
    console.log("$$$ Video render");
    return (
      <iframe width="300" height="300" src={src} allow="autoplay;"></iframe>
    );
  }, [src]);
  return memoizedJsx;
};

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

const addEntity = (
  editorState: EditorState,
  entity: IDraftEntity
): EditorState => {
  console.log("$$$ Add entity");
  const { type, mutability, data } = entity;
  const contentStateWithEntity = editorState
    .getCurrentContent()
    .createEntity(type, mutability, data);

  return AtomicBlockUtils.insertAtomicBlock(
    EditorState.set(editorState, {
      currentContent: contentStateWithEntity
    }),
    contentStateWithEntity.getLastCreatedEntityKey(),
    " "
  );
};

const CustomEditor = (props: any) => {
  console.log("$$$ Custom Editor");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [url, setUrl] = useState(demoUrl);

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
