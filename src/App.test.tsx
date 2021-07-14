import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

describe('<App />', () => {
  it('renders w/o crasjing', () => {
    render(<App />);
  });

  it('starts with Dashboard page', () => {
    render(<App />);
    expect(screen.getByText(/dashboard/i)).toBeTruthy();
  });

  it('changes to Shopping List', () => {
    render(<App />);
    fireEvent.click(screen.getByText(/shopping list/i));
    expect(screen.getAllByText(/shopping list/i)).toHaveLength(2);
  });
});
