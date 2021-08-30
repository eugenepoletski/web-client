import React, { SyntheticEvent } from 'react';
import { Button, Grid, TextField } from '@material-ui/core';

export interface Props {
  title: string;
  onTitleChange: (evt: SyntheticEvent) => void;
  onAddItem: (evt: SyntheticEvent) => void;
  error?: boolean;
  helperText?: string;
}

export const NewItem = ({
  title,
  onTitleChange,
  onAddItem,
  error,
  helperText,
}: Props): JSX.Element => (
  <Grid container spacing={1} alignItems="flex-end">
    <Grid item>
      <TextField
        label="title"
        type="text"
        value={title}
        onChange={onTitleChange}
        inputProps={{ title: 'item title' }}
        error={error}
        helperText={helperText}
      />
    </Grid>
    <Grid item>
      <Button title="add item" type="button" onClick={onAddItem}>
        ADD ITEM
      </Button>
    </Grid>
  </Grid>
);
