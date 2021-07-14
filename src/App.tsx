import React, { useCallback } from 'react';
import { useMachine } from '@xstate/react';
import controllerMachine,
{ DASHBOARD, SHOPPING_LIST } from './controllerMachine';
import Navigation from './common/Navigation/Navigation';
import Dashboard from './pages/Dashboard';
import ShoppingList from './pages/ShoppingList';

function App(): JSX.Element {
  const [current, send] = useMachine(controllerMachine);

  const handleNavigationClick = useCallback((evt, { name }) => {
    if (name === 'home') {
      return send(DASHBOARD);
    }
    if (name === 'shoppingList') {
      return send(SHOPPING_LIST);
    }
    return undefined;
  }, [send]);

  return (
    <div className="App">
      <Navigation onClick={handleNavigationClick} />
      {current.matches(DASHBOARD) && <Dashboard />}
      {current.matches(SHOPPING_LIST) && <ShoppingList />}
    </div>
  );
}

export default App;
