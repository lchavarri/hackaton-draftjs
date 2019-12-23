import useActionsMenu from '../../shared/ui/hooks/useActionsMenu';
import useActionsSettingsMenu from '../../shared/ui/hooks/useActionsSettingsMenu';
import { useContext } from 'react';
import { Context } from '../../shared/ui/main/main';

// Toggle Menu hook
export default function useCustomMenu(
  variableName: string,
  exportSpreadsheet: Function,
  downloadCsv: Function,
  hasResults: boolean,
  displayDismissableToast: any,
  isValidVariableName: boolean,
  hasFilters: boolean
) {
  const {
    state: settingsState,
    subCommands,
    settingsButtons,
    activeQuipButtons
  } = useActionsSettingsMenu(
    'Show Query Pattern',
    'Show Results',
    'Show Timestamp',
    {
      IDs: [],
      activeButtons: [],
      customButtons: []
    }
  );
  const { documentId } = useContext(Context);

  const menuItemsIDs = [
    'copy_variable',
    'download_txt',
    'send_to_spreadsheet',
    'settings'
  ];

  let disabledIds = [];

  if (!hasFilters) {
    disabledIds.push('show_input');
    disabledIds.push('show_output');
    disabledIds.push('show_timestamp');
  }

  if (!hasResults) {
    disabledIds.push('download_txt');
    disabledIds.push('send_to_spreadsheet');
    disabledIds.push('show_output');
    disabledIds.push('show_timestamp');
  }
  if (!isValidVariableName) {
    disabledIds.push('copy_variable');
    disabledIds.push('download_txt');
    disabledIds.push('send_to_spreadsheet');
  }

  useActionsMenu(
    menuItemsIDs,
    menuItemsIDs,
    [
      {
        id: 'copy_variable',
        label: 'Copy Variable',
        handler: () => {
          var dummyContent = variableName;
          var dummy = document.createElement('input');
          dummy.value = dummyContent;
          document.body.appendChild(dummy);
          dummy.focus();
          dummy.select();
          window.document.execCommand('copy');
          return document.body.removeChild(dummy);
        }
      },
      {
        id: 'download_txt',
        label: 'Download .txt',
        handler: () => downloadCsv(variableName)
      },
      {
        id: 'send_to_spreadsheet',
        label: 'Export to Quip Spreadsheet',
        handler: () => {
          exportSpreadsheet(variableName, documentId);
          displayDismissableToast('Spreadsheet exported to Quip document.');
        }
      },
      {
        id: 'settings',
        label: 'Settings',
        subCommands
      },
      ...settingsButtons
    ],
    disabledIds,
    activeQuipButtons,
    [settingsState, variableName, hasResults, isValidVariableName, hasFilters]
  );

  return settingsState;
}
