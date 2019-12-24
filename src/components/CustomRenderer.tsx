import React, { useMemo, useContext } from "react";

import { AppContext } from "../App";
import { RendererProps } from "../utils/DraftUtils";
import Eidos from "../eidos/index";
import Query from "../query/index";

const StrategyRenderer = (props: RendererProps) => {
  const { contentState, block } = props;
  const { setReadOnlyMode } = useContext(AppContext);

  const entity = contentState.getEntity(block.getEntityAt(0));
  const type = entity.getType();
  const data = entity.getData();

  const memoizedJsx = useMemo(() => {
    function getComponent() {
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
        case "eidos":
          return <Eidos></Eidos>;
        case "query":
          return <Query></Query>;
      }
    }

    return (
      <div
        onFocus={() => setReadOnlyMode(true)}
        onBlur={() => setReadOnlyMode(false)}
      >
        {getComponent()}
      </div>
    );
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
