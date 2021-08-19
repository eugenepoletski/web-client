import React, { useEffect, useState } from 'react';
import ListItem from './shoppingList/ListItem';

export interface Item {
  id: string;
  title: string;
  completed: boolean;
}

export interface Props {
  service: any;
}

const ShoppingList = ({ service }: Props): JSX.Element => {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
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
  }, [service]);

  return (
    <div>
      <h1>Shopping list</h1>
      <ul>
        {items.map(({ id, title }) => (
          <ListItem key={id} title={title} />
        ))}
      </ul>
    </div>
  );
};

export default ShoppingList;
