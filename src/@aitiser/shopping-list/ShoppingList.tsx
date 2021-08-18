import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import ListItem from './shoppingList/ListItem';

type Items = {
  title: string;
}[];

const ShoppingList = (): JSX.Element => {
  const [items, setItems] = useState<Items>([]);

  useEffect(() => {
    const socket = io('http://localhost:5000');

    socket.on('connect', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      socket.emit(
        'shoppingListItem:create',
        { title: 'Chicken', completed: false },
        (res: any) => {
          console.log(res);
        },
      );
    });

    const response = new Promise<Items>((res, rej) => {
      setTimeout(() => {
        res([{ title: 'cheese' }, { title: 'eggs' }, { title: 'apples' }]);
      }, 1000);
    });

    response.then((_items) => setItems(_items));
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
