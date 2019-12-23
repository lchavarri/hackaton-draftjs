import { UIEvent } from 'react';

// Not really a react hook but keeping naming consistent
export default function useScrollable() {
  let ref: Element;

  const setRef = (refParam: any) => {
    ref = refParam;
  };

  const onScroll = (e: UIEvent<HTMLDivElement>) => {
    if (ref) {
      const safeTopOffset = (e.currentTarget || { children: [] })
        .children[0] || {
        scrollTop: 0
      };

      const topOffset = safeTopOffset.scrollTop;

      if (topOffset) {
        ref.classList.add('shadow');
      } else {
        ref.classList.remove('shadow');
      }
    }
  };

  return { setRef, onScroll };
}
