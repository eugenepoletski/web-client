import React from 'react';
import { render, screen } from '@testing-library/react';
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
});
