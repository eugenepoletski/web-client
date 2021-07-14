import { createMachine, StateValue } from 'xstate';

export const STATE_DASHBOARD: StateValue = 'STATE_DASHBOARD';
export const STATE_SHOPPING_LIST: StateValue = 'STATE_SHOPPING_LIST';

const controllerMachine = createMachine({
  id: 'controllerMachine',
  initial: STATE_DASHBOARD,
  states: {
    [STATE_DASHBOARD]: {
      on: {
        [STATE_SHOPPING_LIST]: STATE_SHOPPING_LIST,
      },
    },
    [STATE_SHOPPING_LIST]: {
      on: {
        [STATE_DASHBOARD]: STATE_DASHBOARD,
      },
    },
  },
});

export default controllerMachine;
