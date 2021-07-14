import { createMachine, StateValue } from 'xstate';

export const DASHBOARD: StateValue = 'DASHBOARD';
export const SHOPPING_LIST: StateValue = 'SHOPPING_LIST';

const controllerMachine = createMachine({
  id: 'controllerMachine',
  initial: DASHBOARD,
  states: {
    [DASHBOARD]: {
      on: {
        [SHOPPING_LIST]: SHOPPING_LIST,
      },
    },
    [SHOPPING_LIST]: {
      on: {
        [DASHBOARD]: DASHBOARD,
      },
    },
  },
});

export default controllerMachine;
