import React, { useCallback } from 'react';
import {
  AppBar,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Menu as MenuIcon } from '@material-ui/icons';
import { useMachine } from '@xstate/react';
import { StateValue } from 'xstate';
import controllerMachine, {
  STATE_DASHBOARD,
  STATE_SHOPPING_LIST,
} from './pagesMachine';
import Dashboard from './pages/Dashboard';
import { ShoppingListPage } from './@aitiser/shopping-list';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export const NAV_HOME = 'home';
export const NAV_SHOPPING_LIST = 'shoppingList';

const getStateByNavs = (name: string): StateValue | undefined =>
  ({
    [NAV_HOME]: STATE_DASHBOARD,
    [NAV_SHOPPING_LIST]: STATE_SHOPPING_LIST,
  }[name]);

const state2str = (stateVal: StateValue): string => String(stateVal);

const renderPageComponent = ({
  stateValue,
}: {
  stateValue: StateValue;
}): JSX.Element => {
  const pageComponentByStateValues = {
    [state2str(STATE_DASHBOARD)]: Dashboard,
    [state2str(STATE_SHOPPING_LIST)]: ShoppingListPage,
  };

  const PageComponent = pageComponentByStateValues[state2str(stateValue)];

  return <PageComponent />;
};

function App(): JSX.Element {
  const classes = useStyles();
  const [current, send] = useMachine(controllerMachine);

  const handleNavigationClick = useCallback(
    (evt, { name }) => send(state2str(getStateByNavs(name) || '')),
    [send],
  );

  return (
    <div className="App">
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
              onClick={(evt) => handleNavigationClick(evt, { name: NAV_HOME })}
            >
              <MenuIcon />
            </IconButton>
            <Button
              color="inherit"
              onClick={(evt) =>
                handleNavigationClick(evt, { name: NAV_SHOPPING_LIST })
              }
            >
              <Typography variant="h6" className={classes.title}>
                Shopping List
              </Typography>
            </Button>
          </Toolbar>
        </AppBar>
      </div>
      {renderPageComponent({ stateValue: current.value })}
    </div>
  );
}

export default App;
