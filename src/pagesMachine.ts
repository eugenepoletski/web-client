import { createMachine } from 'xstate';

export const DASHBOARD = 'DASHBOARD';
export const SHOPPING_LIST = 'SHOPPING_LIST';

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
