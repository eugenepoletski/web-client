import React, { useEffect, useState } from 'react';
import ListItem from './shoppingList/ListItem';
import { Service } from './ShoppingListService';

export interface IItem {
  id: string;
  title: string;
  completed: boolean;
}

const ShoppingList = (): JSX.Element => {
  const [items, setItems] = useState<IItem[]>([]);

  useEffect(() => {
    const service = new Service({ baseUrl: 'http://localhost:5000' });

    async function fetchItems(): Promise<any> {
      try {
        await service.start();
        const response = await service.listItems();

        switch (response.status) {
          case 'success':
            setItems(response.payload);
            break;

          case 'fail':
            console.warn(response.payload);
            break;
        }
      } catch (err) {
        console.error(err);
      }
    }

    fetchItems();

    return function stopService() {
      service.stop();
    };
  }, []);

  return (
    <div>
      <h1>Shopping list</h1>
      <ul>
        {items.map(({ title }) => (
          <ListItem title={title} />
        ))}
      </ul>
    </div>
  );
};

export default ShoppingList;
