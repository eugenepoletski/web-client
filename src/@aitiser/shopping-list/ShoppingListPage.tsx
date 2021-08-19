import React from 'react';
import ShoppingList from './ShoppingList';
import { Service } from './ShoppingListService';

export const ShoppingListPage = (): JSX.Element => {
  const service = new Service({ baseUrl: 'http://localhost:5000' });
  return <ShoppingList service={service} />;
};
