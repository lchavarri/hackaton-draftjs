import React, { useMemo } from "react";
import { RendererProps } from "../utils/DraftUtils";

const StrategyRenderer = (props: RendererProps) => {
  const { contentState, block } = props;

  const entity = contentState.getEntity(block.getEntityAt(0));
  const type = entity.getType();
  const data = entity.getData();

  const memoizedJsx = useMemo(() => {
    switch (type) {
      case "video":
        return (
          <iframe
            width="300"
            height="300"
            src={data.src}
            allow="autoplay;"
          ></iframe>
        );
      case "image":
        return <img width="300" height="300" src={data.src} />;
    }
  }, [type, data]);

  return memoizedJsx;
};

const CustomBlockRenderer = (block: any) => {
  if (block.getType() !== "atomic") {
    return null;
  }

  return {
    component: StrategyRenderer,
    editable: false
  };
};

export default CustomBlockRenderer;
