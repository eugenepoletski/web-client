import React from 'react';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import faker from 'faker';
import { Item } from './Item';

describe('<Item />', () => {
  it('renders w/o crashing', () => {
    render(<Item />);
  });

  describe('title', () => {
    it('renders item title', () => {
      render(<Item title="cheese" />);
      expect(screen.getAllByText(/cheese/i)).toHaveLength(1);
    });
  });

  describe('Edit item', () => {
    it('calls onTitleEdit when the title editing finished', async () => {
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
  });
});
