import React from 'react';

type Props = {
  title?: string;
};

const defaultProps: Props = {
  title: '',
};

const ListItem = ({ title }: Props): JSX.Element => <li>{title}</li>;

ListItem.defaultProps = defaultProps;

export default ListItem;
