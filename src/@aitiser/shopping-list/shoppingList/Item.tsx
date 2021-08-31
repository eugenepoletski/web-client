import React, { useCallback, useState } from 'react';
import { ListItem, ListItemText, TextField } from '@material-ui/core';

type Props = {
  title?: string;
};

const defaultProps = {
  title: '',
};

export const Item = ({ title }: Props): JSX.Element => {
  const [mode, setMode] = useState('DEFAULT');

  const switchToEditMode = useCallback(() => {
    setMode('EDITING');
  }, []);

  if (mode === 'EDITING') {
    return (
      <ListItem>
        <TextField
          type="text"
          value={title}
          // onChange={onTitleChange}
          inputProps={{ title: 'item title' }}
          // error={error}
          // helperText={helperText}
        />
      </ListItem>
    );
  }

  return (
    <ListItem>
      <ListItemText onClick={switchToEditMode}>{title}</ListItemText>
    </ListItem>
  );
};

Item.defaultProps = defaultProps;
