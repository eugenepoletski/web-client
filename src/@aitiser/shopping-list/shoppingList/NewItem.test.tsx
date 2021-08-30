import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { NewItem } from './NewItem';

describe('<NewItem />', () => {
  const dummyTitle = '';
  const mockedOnTitleChange = jest.fn();
  const mockedAddItem = jest.fn();

  beforeAll(() => {
    jest.clearAllMocks();
  });

  it('renders w/o crashing', () => {
    render(
      <NewItem
        title={dummyTitle}
        onTitleChange={mockedOnTitleChange}
        onAddItem={mockedAddItem}
      />,
    );
  });

  describe('title', () => {
    it('renders title', () => {
      render(
        <NewItem
          title="Carrots"
          onTitleChange={mockedOnTitleChange}
          onAddItem={mockedAddItem}
        />,
      );
      const input = screen.getByTitle(/item title/i);

      expect(input).toHaveValue('Carrots');
    });
  });

  describe('onTitleChange', () => {
    it('is called when input changes', () => {
      render(
        <NewItem
          title=""
          onTitleChange={mockedOnTitleChange}
          onAddItem={mockedAddItem}
        />,
      );
      const input = screen.getByTitle(/item title/i);

      act(() => {
        fireEvent.change(input, { target: { value: 'a' } });
      });

      expect(mockedOnTitleChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('onAddItem', () => {
    it('is called on clicking "Add" button', () => {
      render(
        <NewItem
          title="Potato"
          onTitleChange={mockedOnTitleChange}
          onAddItem={mockedAddItem}
        />,
      );
      const addButton = screen.getByText(/add item/i);

      act(() => {
        fireEvent.click(addButton);
      });

      expect(mockedAddItem).toHaveBeenCalledTimes(1);
    });
  });

  describe('helperText', () => {
    it('renders helper text', () => {
      render(
        <NewItem
          title="Banana"
          onTitleChange={mockedOnTitleChange}
          onAddItem={mockedAddItem}
          helperText="wrong banana!"
        />,
      );

      expect(screen.getAllByText(/wrong banana!/i)).toHaveLength(1);
    });
  });
});
