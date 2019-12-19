import {
  EditorState,
  AtomicBlockUtils,
  ContentState,
  ContentBlock
} from "draft-js";

export type RendererProps = {
  contentState: ContentState;
  block: ContentBlock;
};

type IDraftEntity = {
  type: string;
  mutability: "IMMUTABLE" | "MUTABLE" | "SEGMENTED";
  data?: any;
};

export const addEntity = (
  editorState: EditorState,
  entity: IDraftEntity
): EditorState => {
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
