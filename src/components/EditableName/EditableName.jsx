import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
  iconContainerClassName,
  iconClassName,
} from '../../utils/iconUtils';

const EditableName = ({
  isEditing,
  setIsEditing,
  onNameChange,
  OKIcon,
  CancelIcon,
  nodeData,
}) => {
  const { name } = nodeData;
  const [inputVal, setInputVal] = useState(name);

  const onInputChange = e => setInputVal(e.target.value);

  const cancelEditing = () => {
    setInputVal(name);
    setIsEditing(false);
  };

  const handleNameChange = () => {
    onNameChange(inputVal);
    setIsEditing(false);
  };

  const editingName = (
    <span className='editingName'>
      <input
        type='text'
        value={ inputVal }
        onChange={ onInputChange }
      />
      <span className={ iconContainerClassName('editableNameToolbar') }>
        <OKIcon
          className={ iconClassName('OKIcon') }
          onClick={ handleNameChange }
          nodeData={ nodeData }
        />
        <CancelIcon
          className={ iconClassName('CancelIcon') }
          onClick={ cancelEditing }
          nodeData={ nodeData }
        />
      </span>
    </span>
  );

  const displayName = (
    <span
      className='displayName'
      data-folder-tree-is-directory={ typeof nodeData.isOpen === 'boolean' }
      data-folder-tree-path={ JSON.stringify(nodeData.path) }
      data-folder-tree-id={ nodeData._id }
    >
      {name}
    </span>
  );

  return (
    <span className='EditableName'>
      { isEditing ? editingName : displayName }
    </span>
  );
};

EditableName.propTypes = {
  isEditing: PropTypes.bool.isRequired,
  setIsEditing: PropTypes.func.isRequired,
  onNameChange: PropTypes.func.isRequired,
  OKIcon: PropTypes.func.isRequired,
  CancelIcon: PropTypes.func.isRequired,
  nodeData: PropTypes.object.isRequired,
};

export default EditableName;
