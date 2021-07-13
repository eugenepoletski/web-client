import React from 'react';
import { useMachine } from '@xstate/react';
import controllerMachine,
{ DASHBOARD, SHOPPING_LIST } from './controllerMachine';
import Dashboard from './pages/Dashboard';
import ShoppingList from './pages/ShoppingList';

function App(): JSX.Element {
  const [current, send] = useMachine(controllerMachine);
  return (
    <div className="App">
      {current.matches(DASHBOARD) && <Dashboard />}
      {current.matches(SHOPPING_LIST) && <ShoppingList />}
    </div>
  );
}

export default App;
