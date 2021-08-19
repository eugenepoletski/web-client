/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import faker from 'faker';
import ShoppingList from './ShoppingList';

class MockedShoppingListService {
  public start() {
    return jest.fn(() => Promise.resolve());
  }

  public stop() {
    return jest.fn(() => Promise.resolve());
  }

  public listItems() {
    return jest.fn(() => Promise.resolve());
  }

  public createItem() {
    return jest.fn(() => Promise.resolve());
  }
}

describe('<ShoppingList />', () => {
  let mockedShoppingListService: any;

  beforeEach(() => {
    mockedShoppingListService = new MockedShoppingListService();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('renders w/o crashing', async () => {
    render(<ShoppingList service={mockedShoppingListService} />);

    expect(screen.getAllByText(/shopping list/i)).toHaveLength(1);
  });

  describe('Item management', () => {
    it('renders list of items', async () => {
      const dummyItem1 = {
        id: faker.datatype.uuid(),
        title: faker.lorem.sentence(),
        completed: faker.datatype.boolean(),
      };
      const dummyItem2 = {
        id: faker.datatype.uuid(),
        title: faker.lorem.sentence(),
        completed: faker.datatype.boolean(),
      };
      const listItemsSpy = jest
        .spyOn(mockedShoppingListService, 'listItems')
        .mockImplementationOnce(() =>
          Promise.resolve({
            status: 'success',
            payload: [dummyItem1, dummyItem2],
          }),
        );

      render(<ShoppingList service={mockedShoppingListService} />);
      await waitFor(() => expect(listItemsSpy).toHaveBeenCalledTimes(1));

      expect(screen.getAllByText(dummyItem1.title)).toHaveLength(1);
      expect(screen.getAllByText(dummyItem2.title)).toHaveLength(1);
    });

    it('creates new item', async () => {
      const dummyItemInfo = {
        title: faker.lorem.sentence(),
      };
      jest
        .spyOn(mockedShoppingListService, 'listItems')
        .mockImplementationOnce(() =>
          Promise.resolve({
            status: 'success',
            payload: [
              {
                id: faker.datatype.uuid(),
                title: 'The component is ready for testing!',
                completed: faker.datatype.boolean(),
              },
            ],
          }),
        );
      jest
        .spyOn(mockedShoppingListService, 'createItem')
        .mockImplementationOnce(() =>
          Promise.resolve({
            status: 'success',
            payload: {
              id: faker.datatype.uuid(),
              title: dummyItemInfo.title,
              completed: faker.datatype.boolean(),
            },
          }),
        );
      render(<ShoppingList service={mockedShoppingListService} />);
      await waitFor(() =>
        expect(
          screen.getByText('The component is ready for testing!'),
        ).toBeInTheDocument(),
      );
      const itemInput = screen.getByTitle(/new item input/i);
      const addItemButton = screen.getByText(/add/i);

      act(() => {
        fireEvent.focusIn(itemInput);
        fireEvent.change(itemInput, { target: { value: dummyItemInfo.title } });
        fireEvent.focusOut(itemInput);
        fireEvent.click(addItemButton);
      });

      await waitFor(() => {
        expect(itemInput).not.toContain(dummyItemInfo.title);
        expect(screen.getAllByText(dummyItemInfo.title)).toHaveLength(1);
      });
    });
  });
});
