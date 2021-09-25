/* eslint-disable max-classes-per-file */
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
import ShoppingList from '../ShoppingList';

type ValidationErrorReason = { [key: string]: string };

interface ValidationError extends Error {
  reason: ValidationErrorReason;
}

class ValidationError extends Error implements ValidationError {
  constructor(reason: ValidationErrorReason, ...params: any[]) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError);
    }

    this.name = 'ValidationError';
    this.reason = reason;
  }
}

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

  public updateItem() {
    return jest.fn(() => Promise.resolve());
  }

  public ValidationError = ValidationError;
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

  describe('Item list', () => {
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
  });

  describe('Add an item', () => {
    it('successfully adds a new item', async () => {
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
      const itemInput = screen.getByTitle(/item title/i);
      const addItemButton = screen.getByText(/add item/i);

      act(() => {
        fireEvent.focusIn(itemInput);
        fireEvent.change(itemInput, { target: { value: dummyItemInfo.title } });
        fireEvent.focusOut(itemInput);
        fireEvent.click(addItemButton);
      });

      await waitFor(() => {
        expect(itemInput).not.toHaveValue(dummyItemInfo.title);
        expect(screen.getAllByText(dummyItemInfo.title)).toHaveLength(1);
      });
    });

    it('rejects to add an invalid new item and displays errors', async () => {
      const dummyFailResult = {
        status: 'fail',
        payload: {
          title: '"title" is missing',
        },
      };
      jest
        .spyOn(mockedShoppingListService, 'createItem')
        .mockImplementationOnce(() => Promise.resolve(dummyFailResult));
      render(<ShoppingList service={mockedShoppingListService} />);
      const itemInput = screen.getByTitle(/item title/i);
      const addItemButton = screen.getByTitle(/add item/i);

      act(() => {
        fireEvent.focusIn(itemInput);
        fireEvent.change(itemInput, { target: { value: ' ' } });
        fireEvent.focusOut(itemInput);
        fireEvent.click(addItemButton);
      });

      await waitFor(() => {
        expect(screen.getAllByText(dummyFailResult.payload.title)).toHaveLength(
          1,
        );
      });
    });
  });

  describe('Edit item', () => {
    it('successfully edits an item', async () => {
      const dummyInitialItem = {
        id: faker.datatype.uuid(),
        title: faker.lorem.sentence().slice(0, 50),
        completed: faker.datatype.boolean(),
      };
      const dummyUpdatedItem = {
        ...dummyInitialItem,
        title: faker.lorem.sentence().slice(0, 50),
      };
      jest
        .spyOn(mockedShoppingListService, 'listItems')
        .mockImplementationOnce(() =>
          Promise.resolve({
            status: 'success',
            payload: [dummyInitialItem],
          }),
        );
      const updateItemSpy = jest
        .spyOn(mockedShoppingListService, 'updateItem')
        .mockImplementationOnce(() =>
          Promise.resolve({
            status: 'success',
            payload: dummyUpdatedItem,
          }),
        );
      expect.assertions(5);
      render(<ShoppingList service={mockedShoppingListService} />);
      await waitFor(() => {
        expect(screen.getAllByText(dummyInitialItem.title)).toHaveLength(1);
      });

      act(() => {
        fireEvent.click(screen.getByText(dummyInitialItem.title));
      });

      await waitFor(() => {
        expect(
          screen.getAllByDisplayValue(dummyInitialItem.title),
        ).toHaveLength(1);
        expect(screen.getByDisplayValue(dummyInitialItem.title)).toHaveValue(
          dummyInitialItem.title,
        );
      });

      act(() => {
        fireEvent.change(screen.getByDisplayValue(dummyInitialItem.title), {
          target: { value: dummyUpdatedItem.title },
        });
      });

      act(() => {
        fireEvent.focusOut(screen.getByDisplayValue(dummyUpdatedItem.title));
      });

      await waitFor(() => {
        expect(screen.getAllByText(dummyUpdatedItem.title)).toHaveLength(1);
      });

      expect(updateItemSpy).toHaveBeenCalledTimes(1);
    });

    it('rejects to apply invalid changes to an item', async () => {
      const dummyInitialItem = {
        id: faker.datatype.uuid(),
        title: faker.lorem.sentence().slice(0, 50),
        completed: faker.datatype.boolean(),
      };
      const dummyFailReason = { title: faker.lorem.sentence() };
      jest
        .spyOn(mockedShoppingListService, 'listItems')
        .mockImplementationOnce(() =>
          Promise.resolve({
            status: 'success',
            payload: [dummyInitialItem],
          }),
        );
      jest
        .spyOn(mockedShoppingListService, 'updateItem')
        .mockImplementationOnce(() =>
          Promise.reject(
            new mockedShoppingListService.ValidationError(dummyFailReason),
          ),
        );
      render(<ShoppingList service={mockedShoppingListService} />);
      expect.assertions(5);
      await waitFor(() => {
        expect(screen.getAllByText(dummyInitialItem.title)).toHaveLength(1);
      });

      act(() => {
        fireEvent.click(screen.getByText(dummyInitialItem.title));
      });

      await waitFor(() => {
        expect(
          screen.getAllByDisplayValue(dummyInitialItem.title),
        ).toHaveLength(1);
        expect(screen.getByDisplayValue(dummyInitialItem.title)).toHaveValue(
          dummyInitialItem.title,
        );
      });

      expect(screen.queryByText(dummyFailReason.title)).not.toBeInTheDocument();

      const itemTitleInput = screen.getByDisplayValue(dummyInitialItem.title);

      act(() => {
        fireEvent.change(itemTitleInput, { target: { value: '' } });
        fireEvent.focusOut(itemTitleInput);
      });

      expect(screen.getAllByText(dummyFailReason.title)).toHaveLength(1);
    });
  });
});
