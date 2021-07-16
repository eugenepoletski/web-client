import React from 'react';
import { render, screen } from '@testing-library/react';
import ShoppingList from './ShoppingList';

describe('<ShoppingList />', () => {
  it('renders w/o crashing', () => {
    render(<ShoppingList />);
    expect(screen.getAllByText(/shopping list/i)).toHaveLength(1);
  });
});
