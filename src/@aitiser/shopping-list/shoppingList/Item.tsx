import React, { useCallback, useState } from 'react';
import { ListItem, ListItemText, TextField } from '@material-ui/core';

type Props = {
  title?: string;
  error?: boolean;
  helperText?: string;
  onTitleEdited: (obj: any) => void;
};

const defaultProps = {
  title: '',
  error: false,
  helperText: '',
};

export const Item = ({
  title,
  error,
  helperText,
  onTitleEdited,
}: Props): JSX.Element => {
  const [mode, setMode] = useState('DEFAULT');
  const [_title, setTitle] = useState(title);

  const switchToDefaultMode = (): void => {
    setMode('DEFAULT');
  };
  const switchToEditMode = (): void => {
    setMode('EDITING');
  };
  const focusOnItemTitleInput = (elem: any): void => {
    if (elem) {
      elem.focus();
    }
  };

  const handleTitleChange = useCallback((evt) => {
    setTitle(evt.target.value);
  }, []);

  const handleTitleInputBlur = (): void => {
    switchToDefaultMode();
    if (title !== _title) {
      onTitleEdited({ value: _title });
    }
  };

  if (mode === 'EDITING') {
    return (
      <ListItem>
        <TextField
          type="text"
          value={_title}
          onChange={handleTitleChange}
          inputProps={{
            ref: focusOnItemTitleInput,
            title: 'item title',
            onBlur: handleTitleInputBlur,
          }}
          error={error}
          helperText={helperText}
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
