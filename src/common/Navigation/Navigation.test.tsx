import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Navigation from './Navigation';

const schema = {
  items: [
    {
      name: 'home',
      title: 'Dashboard',
    },
    {
      name: 'shoppingList',
      title: 'Shopping List',
    },
  ],
};

describe('<Navigation />', () => {
  it('renders w/o crashing', () => {
    render(<Navigation schema={schema} />);
  });

  it('builds navigation from a schema', () => {
    render(<Navigation schema={schema} />);
    expect(screen.getAllByText(/dashboard/i)).toHaveLength(1);
    expect(screen.getAllByText(/shopping list/i)).toHaveLength(1);
  });

  it('calls onClick on nav item click with the item name', () => {
    const onClickStub = jest.fn();
    render(<Navigation schema={schema} onClick={onClickStub} />);
    fireEvent.click(screen.getByText(/dashboard/i));
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
