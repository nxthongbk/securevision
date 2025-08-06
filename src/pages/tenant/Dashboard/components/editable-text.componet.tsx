import classNames from 'classnames';
import React, { useState } from 'react';

interface EditableDivProps {
  defaultValue: string;
  active?: boolean;
}

const EditableDiv: React.FC<EditableDivProps> = ({ defaultValue, active }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(defaultValue);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
    }
  };
  const className = classNames({
    'px-4': true,
    'bg-white': active,
    'rounded-md': true,
    'py-1': true,
    'cursor-pointer': true,
    'shadow-lg': active
  });
  return (
    <div className={className}>
      {isEditing ? (
        <input
          type='text'
          value={text}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        <div onDoubleClick={handleDoubleClick}>{text}</div>
      )}
    </div>
  );
};

export default EditableDiv;
