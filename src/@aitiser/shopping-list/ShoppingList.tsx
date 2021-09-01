import React, { useEffect, useState, useCallback } from 'react';
import { List, Typography } from '@material-ui/core';
import { Item, NewItem } from './shoppingList';

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
  updateItem(itemId: string, itemUpdate: ItemInfo): Promise<any>;
}

export interface Props {
  service: Service;
}

const ShoppingList = ({ service }: Props): JSX.Element => {
  const [items, setItems] = useState<Item[]>([]);
  const [itemTitle, setItemTitle] = useState('');
  const [hasCreateItemError, setHasCreateItemError] = useState(false);
  const [createItemHelperText, setCreateItemHelperText] = useState(' ');

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
            setItems([result.payload].concat(items.slice()));
            break;
          case 'fail':
            setHasCreateItemError(true);
            setCreateItemHelperText(result.payload.title);
            break;
        }
      } catch (err) {
        console.error(err.message);
      }
    }

    createItem();
  }, [itemTitle, items, service]);

  const makeItemTitleEditedHandler =
    (id: string) =>
    ({ value: title }: { value: string }) => {
      async function updateItem(): Promise<any> {
        try {
          const result = await service.updateItem(id, { title });

          switch (result.status) {
            case 'success':
              setItems(
                items.map((item) => {
                  if (item.id !== id) {
                    return item;
                  }
                  return result.payload;
                }),
              );
              break;
            case 'fail':
              console.warn(result.payload);
              break;
            case 'error':
              throw new Error(result.message);
            default:
              throw new Error(
                `Unhandled service response status=${result.status}`,
              );
          }
        } catch (err) {
          console.error(err);
        }
      }

      updateItem();
    };

  return (
    <div>
      <Typography variant="h4" variantMapping={{ h4: 'h1' }}>
        Shopping List
      </Typography>
      <NewItem
        title={itemTitle}
        onTitleChange={handleItemTitleChange}
        onAddItem={handleAddItem}
        error={hasCreateItemError}
        helperText={createItemHelperText}
      />
      <List>
        {items.map(({ id, title }) => (
          <React.Fragment key={id}>
            <Item
              title={title}
              onTitleEdited={makeItemTitleEditedHandler(id)}
            />
          </React.Fragment>
        ))}
      </List>
    </div>
  );
};

export default ShoppingList;
