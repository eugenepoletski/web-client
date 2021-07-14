import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Navigation from './Navigation';

describe('<Navigation />', () => {
  it('renders w/o crashing', () => {
    render(<Navigation />);
  });

  it('calls onClick on nav item click with the item name', () => {
    const onClickStub = jest.fn();
    render(<Navigation onClick={onClickStub} />);
    fireEvent.click(screen.getByText(/home/i));
    expect(onClickStub).toHaveBeenCalledTimes(1);
    expect(onClickStub)
      .toHaveBeenLastCalledWith(
        expect.any(Object),
        expect.objectContaining({ name: 'home' }),
      );
    fireEvent.click(screen.getByText(/shopping list/i));
    expect(onClickStub).toHaveBeenCalledTimes(2);
    expect(onClickStub)
      .toHaveBeenLastCalledWith(
        expect.any(Object),
        expect.objectContaining({ name: 'shoppingList' }),
      );
  });
});
