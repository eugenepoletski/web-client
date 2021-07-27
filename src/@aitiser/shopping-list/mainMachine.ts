/**
 * @description Shopping list module main state machine
 */
import { createMachine } from 'xstate';

export const STATE_DEFAULT = '@shopping-list/STATE_DEFAULT';

const mainMachine = createMachine({
  id: '@shopping-list/main',
  context: {
    items: [],
  },
  states: {
    default: {},
  },
});

export default mainMachine;
