import React, { useEffect, useState, useCallback } from 'react';

import ListItem from './shoppingList/ListItem';
import { NewItem } from './shoppingList';

export interface ItemInfo {
  title: string;
  completed?: boolean;
}

export interface Item {
  id: string;
  title: string;
  completed: boolean;
}

export interface Service {
  start(): Promise<void>;
  stop(): Promise<void>;
  listItems(): Promise<any>;
  createItem(itemInfo: ItemInfo): Promise<any>;
}

export interface Props {
  service: Service;
}

const ShoppingList = ({ service }: Props): JSX.Element => {
  const [items, setItems] = useState<Item[]>([]);
  const [itemTitle, setItemTitle] = useState('');

  useEffect(() => {
    async function listItems(): Promise<any> {
      try {
        await service.start();
        const result = await service.listItems();

        switch (result.status) {
          case 'success':
            setItems(result.payload);
            break;

          case 'fail':
            console.warn(result.payload);
            break;
        }
      } catch (err) {
        console.error(err);
      }
    }

    listItems();

    return function stopService() {
      service.stop();
    };
  }, [service]);

  const handleItemTitleChange = useCallback((evt) => {
    setItemTitle(evt.target.value);
  }, []);

  const handleAddItem = useCallback(() => {
    async function createItem(): Promise<any> {
      try {
        const result = await service.createItem({
          title: itemTitle,
          completed: false,
        });

        switch (result.status) {
          case 'success':
            setItemTitle('');
            // ToDo! refactor to listen for itemCreated ?
            setItems([result.payload].concat(items.slice()));
            break;
          case 'fail':
            console.warn(result);
            break;
        }
      } catch (err) {
        console.error(err.message);
      }
    }

    createItem();
  }, [itemTitle, items, service]);

  return (
    <div>
      <h1>Shopping list</h1>
      <NewItem
        title={itemTitle}
        onTitleChange={handleItemTitleChange}
        onAddItem={handleAddItem}
      />
      <ul>
        {items.map(({ id, title }) => (
          <ListItem key={id} title={title} />
        ))}
      </ul>
    </div>
  );
};

export default ShoppingList;
