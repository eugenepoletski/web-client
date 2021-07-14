import React, { useCallback } from 'react';
import { useMachine } from '@xstate/react';
import controllerMachine,
{ DASHBOARD, SHOPPING_LIST } from './pagesMachine';
import Navigation from './common/Navigation/Navigation';
import Dashboard from './pages/Dashboard';
import ShoppingList from './pages/ShoppingList';

const getStateByNavName = (name: string): string | undefined => ({
  home: DASHBOARD,
  shoppingList: SHOPPING_LIST,
})[name];

const Page = ({ name }: { name: string }): JSX.Element | null => {
  switch (name) {
    case DASHBOARD:
      return <Dashboard />;
    case SHOPPING_LIST:
      return <ShoppingList />;
    default:
      return null;
  }
};

function App(): JSX.Element {
  const [current, send] = useMachine(controllerMachine);

  const handleNavigationClick = useCallback((
    evt, { name },
  ) => send(getStateByNavName(name) || ''), [send]);

  return (
    <div className="App">
      <Navigation onClick={handleNavigationClick} />
      <Page name={`${current.value}`} />
    </div>
  );
}

export default App;
