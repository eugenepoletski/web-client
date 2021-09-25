import React from 'react';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import faker from 'faker';
import { Item } from '../Item';

describe('<Item />', () => {
  it('renders w/o crashing', () => {
    render(<Item onTitleEdited={jest.fn()} />);
  });

  describe('title', () => {
    it('renders item title', () => {
      render(<Item title="cheese" onTitleEdited={jest.fn()} />);
      expect(screen.getAllByText(/cheese/i)).toHaveLength(1);
    });
  });

  describe('Update an item', () => {
    it('calls onTitleEdited when title editing finished', async () => {
      const dummyItemTitleInitial = faker.lorem.sentence();
      const dummyItemTitleChanged = faker.lorem.sentence();
      const mockedOnTitleEdited = jest.fn();
      render(
        <Item
          title={dummyItemTitleInitial}
          onTitleEdited={mockedOnTitleEdited}
        />,
      );

      act(() => {
        fireEvent.click(screen.getByText(dummyItemTitleInitial));
      });

      await waitFor(() => {
        expect(screen.getByDisplayValue(dummyItemTitleInitial)).toHaveValue(
          dummyItemTitleInitial,
        );
        expect(screen.getByDisplayValue(dummyItemTitleInitial)).toHaveFocus();
      });

      act(() => {
        fireEvent.change(screen.getByDisplayValue(dummyItemTitleInitial), {
          target: { value: dummyItemTitleChanged },
        });
      });

      act(() => {
        fireEvent.focusOut(screen.getByDisplayValue(dummyItemTitleChanged));
      });

      expect(mockedOnTitleEdited).toHaveBeenCalledTimes(1);
      expect(mockedOnTitleEdited).toHaveBeenCalledWith(
        expect.objectContaining({ value: dummyItemTitleChanged }),
      );
    });

    it('displays error text when an item is edited', () => {
      const dummyItemTitle = faker.lorem.sentence().slice(0, 50);
      const dummyErrorText = faker.lorem.sentence();

      render(
        <Item
          title={dummyItemTitle}
          onTitleEdited={jest.fn()}
          error
          helperText={dummyErrorText}
        />,
      );
      act(() => {
        fireEvent.click(screen.getByText(dummyItemTitle));
      });

      expect(screen.getAllByText(dummyErrorText)).toHaveLength(1);
    });
  });
});
