import classNames from 'classnames';
import React, { useState } from 'react';

interface EditableDivProps {
  defaultValue: string;
  active?: boolean;
  updateValue?: any;
  isEdit: boolean;
}

const EditableDiv: React.FC<EditableDivProps> = ({ defaultValue, active, updateValue, isEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(defaultValue);

  const handleDoubleClick = () => {
    isEdit && setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      updateValue(text);
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
