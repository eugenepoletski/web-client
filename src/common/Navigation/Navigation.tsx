import React, { SyntheticEvent } from 'react';

type SchemaProp = {
  items: { name: string, title: string }[]
};

type Props = {
  onClick?: (evt: SyntheticEvent, obj: { name: string; }) => void,
  schema: SchemaProp
};

const Navigation: React.FC<Props> = ({
  onClick = () => undefined,
  schema,
}) => (
  <nav>
    <ul>
      {schema.items.map(({ name, title }) => (
        <li key={name}>
          <button
            name={name}
            onClick={(evt) => onClick(evt, { name })}
            type="button"
          >
            {title}
          </button>
        </li>
      ))}
    </ul>
  </nav>
);

export default Navigation;
