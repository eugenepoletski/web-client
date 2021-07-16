import React, { useEffect, useState } from 'react';
import ListItem from './shoppingList/ListItem';

type Items = {
  title: string;
}[];

const ShoppingList = (): JSX.Element => {
  const [items, setItems] = useState<Items>([]);

  useEffect(() => {
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
        {items.map(({ title }) => <ListItem title={title} />)}
      </ul>
    </div>
  );
};

export default ShoppingList;
