import React, { useEffect, useState, useCallback } from 'react';

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
  const [itemTitle, setItemTitle] = useState('');

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

  const handleInputChange = useCallback((evt) => {
    setItemTitle(evt.target.value);
  }, []);

  const handleAddItemClick = useCallback(() => {
    async function createItem(): Promise<any> {
      try {
        const response = await service.createItem({
          title: itemTitle,
          completed: false,
        });

        switch (response.status) {
          case 'success':
            setItemTitle('');
            // ToDo! refactor to listen for itemCreated ?
            setItems([response.payload].concat(items.slice()));
            break;
          case 'fail':
            console.warn(response);
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
      <input
        title="new item input"
        value={itemTitle}
        onChange={handleInputChange}
      />
      <button title="add item" type="button" onClick={handleAddItemClick}>
        Add
      </button>
      <ul>
        {items.map(({ id, title }) => (
          <ListItem key={id} title={title} />
        ))}
      </ul>
    </div>
  );
};

export default ShoppingList;
