import React, { SyntheticEvent } from 'react';

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
  <>
    <input
      title="new item input"
      type="text"
      value={title}
      onChange={onTitleChange}
    />
    <button title="add item" type="button" onClick={onAddItem}>
      Add
    </button>
  </>
);
