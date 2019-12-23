/* eslint-disable */

import { useEffect, useContext } from 'react';
import { Context } from '../main/main';

type Buttons = {
  id: string;
  label: string;
  handler?: Function;
  subCommands?: Array<string>;
};

/**
 * React custom hook to update quip menu toolbar
 * @constructor
 * @param {Array} toolbarCommandIds - The ids to add to toolbar commands
 * @param {Array} subCommands - The ids of the subcommands to add to toolbar
 * @param {Array} subCommands - The ids of the subcommands to add to toolbar
 * @param {Array} disabledCommandIds - The ids of the buttons that should be disabled
 * @param {Array} dependencies - The dependencies that will call the hook if they change
 */
export default function useActionsMenu(
  toolbarCommandIds: Array<string>,
  subCommands: Array<string>,
  buttons: Array<Buttons>,
  disabledCommandIds: Array<string>,
  highlightedCommandIds: Array<string>,
  dependencies: Array<any>
) {
  const { setActionsMenu } = useContext(Context);

  useEffect(() => {
    // Setting custom menu on first render
    if (setActionsMenu) {
      setActionsMenu({
        toolbarCommandIds,
        menuCommands: {
          subCommands,
          buttons
        },
        disabledCommandIds,
        highlightedCommandIds
      });
    }
  }, dependencies);
}
