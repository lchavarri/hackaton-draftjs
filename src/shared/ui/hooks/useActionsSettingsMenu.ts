import { useReducer } from 'react';

const INITIAL_STATE = {
  inputVisible: true,
  outputVisible: true,
  timestampVisible: true
};

type Action = {
  type: string;
  payload?: any;
};

type ExtraButtons = {
  IDs: Array<string>;
  activeButtons: Array<string>;
  customButtons: Array<any>;
};

const TOGGLE_INPUT = 'TOGGLE_INPUT';
const TOGGLE_OUTPUT = 'TOGGLE_OUTPUT';
const TOGGLE_TS = 'TOGGLE_TS';
const SHOW_OUTPUT = 'SHOW_OUTPUT';

function reducer(state = INITIAL_STATE, action: Action) {
  switch (action.type) {
    case TOGGLE_INPUT:
      return { ...state, inputVisible: !state.inputVisible };
    case TOGGLE_OUTPUT:
      return { ...state, outputVisible: !state.outputVisible };
    case TOGGLE_TS:
      return { ...state, timestampVisible: !state.timestampVisible };
    case SHOW_OUTPUT:
      return { ...state, outputVisible: true };
    default:
      return INITIAL_STATE;
  }
}
// This can be refactored to handle settings dropdown separated and be reusable
// across live apps.
// Toggle Menu hook
export default function useActionsSettingsMenu(
  inputLabel: string,
  outputLabel: string,
  tsLabel: string,
  extraButtons: ExtraButtons
) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const { inputVisible, outputVisible, timestampVisible } = state;
  const { IDs, activeButtons, customButtons } = extraButtons;

  let activeQuipButtons = [...activeButtons];
  if (inputVisible) {
    activeQuipButtons.push('show_input');
  }
  if (outputVisible) {
    activeQuipButtons.push('show_output');
  }
  if (timestampVisible) {
    activeQuipButtons.push('show_timestamp');
  }

  const subCommands = ['show_input', 'show_output', 'show_timestamp', ...IDs];
  const settingsButtons = [
    {
      id: 'show_input',
      label: inputLabel,
      handler: () => dispatch({ type: TOGGLE_INPUT })
    },
    {
      id: 'show_output',
      label: outputLabel,
      handler: () => dispatch({ type: TOGGLE_OUTPUT })
    },
    {
      id: 'show_timestamp',
      label: tsLabel,
      handler: () => dispatch({ type: TOGGLE_TS })
    },
    ...customButtons
  ];

  // TODO: expose a more generic way to interact with settings state
  const showOutput = () => {
    dispatch({ type: SHOW_OUTPUT });
  };

  return {
    state,
    subCommands,
    settingsButtons,
    activeQuipButtons,
    showOutput
  };
}
