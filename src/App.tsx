import React, { useCallback } from 'react';
import { useMachine } from '@xstate/react';
import { StateValue } from 'xstate';
import controllerMachine,
{ DASHBOARD, SHOPPING_LIST } from './pagesMachine';
import Navigation from './common/Navigation/Navigation';
import Dashboard from './pages/Dashboard';
import ShoppingList from './pages/ShoppingList';

// ToDo! Rework Navigation component to define all the mapping
// w/o having hardcoded page names
const getStateByNavName = (name: string): string | undefined => ({
  home: DASHBOARD,
  shoppingList: SHOPPING_LIST,
})[name];

const stateVal2Str = (stateVal: StateValue): string => String(stateVal);

const renderPageComponent = (
  { stateValue }: { stateValue: StateValue },
): JSX.Element => {
  const pageComponentByStateValues = {
    [stateVal2Str(DASHBOARD)]: Dashboard,
    [stateVal2Str(SHOPPING_LIST)]: ShoppingList,
  };

  const PageComponent = pageComponentByStateValues[stateVal2Str(stateValue)];

  return (<PageComponent />);
};

function App(): JSX.Element {
  const [current, send] = useMachine(controllerMachine);

  const handleNavigationClick = useCallback((
    evt, { name },
  ) => send(getStateByNavName(name) || ''), [send]);

  return (
    <div className="App">
      <Navigation onClick={handleNavigationClick} />
      {renderPageComponent({ stateValue: current.value })}
    </div>
  );
}

export default App;
