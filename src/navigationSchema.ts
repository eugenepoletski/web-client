export const NAV_HOME = 'home';
export const NAV_SHOPPING_LIST = 'shoppingList';

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

export default navigationSchema;
