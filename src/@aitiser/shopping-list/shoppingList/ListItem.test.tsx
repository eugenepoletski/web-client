import React from 'react';
import { render, screen } from '@testing-library/react';
import { ListItem } from './ListItem';

describe('<ListItem />', () => {
  it('renders w/o crashing', () => {
    render(<ListItem />);
  });

  describe('title', () => {
    it('renders item title', () => {
      render(<ListItem title="cheese" />);
      expect(screen.getAllByText(/cheese/i)).toHaveLength(1);
    });
  });
});
