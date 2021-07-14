import React, { useCallback } from 'react';
import { useMachine } from '@xstate/react';
import { StateValue } from 'xstate';
import controllerMachine,
{ STATE_DASHBOARD, STATE_SHOPPING_LIST } from './pagesMachine';
import Navigation from './common/Navigation/Navigation';
import Dashboard from './pages/Dashboard';
import ShoppingList from './pages/ShoppingList';

const NAV_HOME = 'home';
const NAV_SHOPPING_LIST = 'shoppingList';

const getStateByNavs = (name: string): StateValue | undefined => ({
  [NAV_HOME]: STATE_DASHBOARD,
  [NAV_SHOPPING_LIST]: STATE_SHOPPING_LIST,
})[name];

const state2str = (stateVal: StateValue): string => String(stateVal);

const renderPageComponent = (
  { stateValue }: { stateValue: StateValue },
): JSX.Element => {
  const pageComponentByStateValues = {
    [state2str(STATE_DASHBOARD)]: Dashboard,
    [state2str(STATE_SHOPPING_LIST)]: ShoppingList,
  };

  const PageComponent = pageComponentByStateValues[state2str(stateValue)];

  return (<PageComponent />);
};

const navigationSchema = {
  items: [
    {
      name: NAV_HOME,
      title: 'Home',
    },
    {
      name: NAV_SHOPPING_LIST,
      title: 'Shopping list',
    },
  ],
};

function App(): JSX.Element {
  const [current, send] = useMachine(controllerMachine);

  const handleNavigationClick = useCallback((
    evt, { name },
  ) => send(state2str(getStateByNavs(name) || '')), [send]);

  return (
    <div className="App">
      <Navigation schema={navigationSchema} onClick={handleNavigationClick} />
      {renderPageComponent({ stateValue: current.value })}
    </div>
  );
}

export default App;
