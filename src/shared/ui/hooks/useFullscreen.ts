import { useContext } from 'react';
import { Context } from '../main/main';

/**
 * React custom hook to access full screen variables and functions from Quip
 */
export default function useFullscreen() {
  const { fullscreen, setFullscreen } = useContext(Context);

  const fullscreenVar = fullscreen !== undefined ? fullscreen : true;
  const setFullScreenFunction = setFullscreen
    ? setFullscreen
    : () => console.warn('Not in Quip Context');

  return { fullscreen: fullscreenVar, setFullscreen: setFullScreenFunction };
}
