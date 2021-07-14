import React, { useCallback } from 'react';
import { useMachine } from '@xstate/react';
import controllerMachine,
{ DASHBOARD, SHOPPING_LIST } from './controllerMachine';
import Navigation from './common/Navigation/Navigation';
import Dashboard from './pages/Dashboard';
import ShoppingList from './pages/ShoppingList';

const getStateByNavName = (name: string): string | undefined => ({
  home: DASHBOARD,
  shoppingList: SHOPPING_LIST,
})[name];

function App(): JSX.Element {
  const [current, send] = useMachine(controllerMachine);

  const handleNavigationClick = useCallback((
    evt, { name },
  ) => send(getStateByNavName(name) || ''), [send]);

  return (
    <div className="App">
      <Navigation onClick={handleNavigationClick} />
      {current.matches(DASHBOARD) && <Dashboard />}
      {current.matches(SHOPPING_LIST) && <ShoppingList />}
    </div>
  );
}

export default App;
