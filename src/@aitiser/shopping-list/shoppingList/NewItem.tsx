import React, { SyntheticEvent } from 'react';
import { Button, Grid, TextField } from '@material-ui/core';

export interface Props {
  title: string;
  onTitleChange: (evt: SyntheticEvent) => void;
  onAddItem: (evt: SyntheticEvent) => void;
}

export const NewItem = ({
  title,
  onTitleChange,
  onAddItem,
}: Props): JSX.Element => (
  <Grid container spacing={1} alignItems="flex-end">
    <Grid item>
      <TextField
        label="new item"
        type="text"
        value={title}
        onChange={onTitleChange}
        inputProps={{ title: 'new item input' }}
      />
    </Grid>
    <Grid item>
      <Button title="add item" type="button" onClick={onAddItem}>
        Add
      </Button>
    </Grid>
  </Grid>
);
