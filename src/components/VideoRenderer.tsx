import React, { useMemo } from "react";
import { RendererProps } from "../utils/DraftUtils";

const Video = (props: RendererProps) => {
  const { contentState, block } = props;
  const entity = contentState.getEntity(block.getEntityAt(0));
  const { src } = entity.getData();

  const memoizedJsx = useMemo(() => {
    console.log("$$$ Video render");
    return (
      <iframe width="300" height="300" src={src} allow="autoplay;"></iframe>
    );
  }, [src]);

  return memoizedJsx;
};

export default Video;
