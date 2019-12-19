import React, { useState } from "react";

import { AtomicBlockUtils, Editor, EditorState } from "draft-js";

const demoUrl = "https://www.youtube.com/embed/9CS7j5I6aOc?autoplay=true";

const customBlockRenderer = block => {
  if (block.getType() !== "atomic") {
    return null;
  }

  const Video = props => {
    const entity = props.contentState.getEntity(props.block.getEntityAt(0));
    const { src } = entity.getData();
    return (
      <iframe width="500" height="500" src={src} allow="autoplay;"></iframe>
    );
  };

  return {
    component: Video,
    editable: false
  };
};

type IDraftEntity = {
  type: string;
  mutability: "IMMUTABLE" | "MUTABLE" | "SEGMENTED";
  data?: any;
};

type IDraftContentState = {
  getLastCreatedEntityKey: () => string;
};

type IDraftEditorState = {
  getCurrentContent: () => {
    createEntity: (...IDraftEntity) => IDraftContentState;
  };
};

type Props = {};

const addEntity = (
  editorState: IDraftEditorState,
  entity: IDraftEntity
): IDraftEditorState => {
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

const CustomEditor = (props: Props) => {
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

  return (
    <div>
      <input type="text" value={url} onChange={e => setUrl(e.target.value)} />
      <button onClick={handleConfirm}>Confirm</button>
      <Editor
        blockRendererFn={customBlockRenderer}
        editorState={editorState}
        onChange={editorState => setEditorState(editorState)}
        placeholder="Enter some text..."
      />
    </div>
  );
};

export default CustomEditor;
