import React from 'react';
import { ListItem, ListItemText } from '@material-ui/core';

type Props = {
  title?: string;
};

const defaultProps = {
  title: '',
};

export const Item = ({ title }: Props): JSX.Element => (
  <ListItem>
    <ListItemText>{title}</ListItemText>
  </ListItem>
);

Item.defaultProps = defaultProps;
