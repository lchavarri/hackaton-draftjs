import { useState, useEffect } from 'react';

export default function useQuipBoundingClientRect() {
  const isClient =
    typeof window === 'object' && window.quip && window.quip.apps;
  const [rect, setRect] = useState(getBoundingSize);

  function getBoundingSize() {
    return isClient ? window.quip.apps.getBoundingClientRect() : 0;
  }

  useEffect(() => {
    if (!isClient) {
      return;
    }

    function handleResize() {
      setRect(getBoundingSize());
    }

    handleResize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rect.top, rect.left]);

  return {
    ...rect
  };
}
