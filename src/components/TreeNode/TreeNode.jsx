import React, {
  useContext,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import {
  AiFillCaretRight,
  AiFillCaretDown,
  AiOutlineFolder,
  AiOutlineFolderOpen,
  AiOutlineFile,
  AiOutlineClose,
  // AiOutlineDelete,
  // AiOutlineEdit,
  // AiOutlineFileAdd,
  // AiOutlineFolderAdd,
  AiOutlineCheck,
} from 'react-icons/ai';

import CheckBox from '../CheckBox/CheckBox';
import ConfigContext from '../FolderTree/context';
import EditableName from '../EditableName/EditableName';
import {
  iconContainerClassName,
  iconClassName,
  getDefaultIcon,
} from '../../utils/iconUtils';

const TreeNode = ({
  path,
  name,
  checked,
  isOpen,
  children,
  ...restData
}) => {
  const nodeData = {
    path, name, checked, isOpen, ...restData,
  };

  const {
    handleCheck,
    handleRename,
    // handleDelete,
    // handleAddNode,
    handleToggleOpen,

    iconComponents,
    indentPixels,
    onNameClick,
    showCheckbox,
    readOnly,
    onCheckbox
  } = useContext(ConfigContext);

  const isFolder = restData['type'] ? restData['type'] === 'directory' || restData['type'] === 'folder' : !!children;

  const treeNodeStyle = {
    marginLeft: path.length * indentPixels,
  };

  const [, setIsSelected] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const ref = useRef(null);

  const {
    FileIcon = getDefaultIcon(AiOutlineFile),
    FolderIcon = getDefaultIcon(AiOutlineFolder),
    FolderOpenIcon = getDefaultIcon(AiOutlineFolderOpen),
    // EditIcon = getDefaultIcon(AiOutlineEdit),
    // DeleteIcon = getDefaultIcon(AiOutlineDelete),
    CancelIcon = getDefaultIcon(AiOutlineClose),
    // AddFileIcon = getDefaultIcon(AiOutlineFileAdd),
    // AddFolderIcon = getDefaultIcon(AiOutlineFolderAdd),
    CaretRightIcon = getDefaultIcon(AiFillCaretRight),
    CaretDownIcon = getDefaultIcon(AiFillCaretDown),
    OKIcon = getDefaultIcon(AiOutlineCheck),
  } = iconComponents;

  let TypeIcon = FileIcon;
  let TypeIconType = 'FileIcon';
  if (isFolder) {
    TypeIcon = isOpen
      ? FolderOpenIcon
      : FolderIcon;

    TypeIconType = isOpen
      ? 'FolderOpenIcon'
      : 'FolderIcon';
  }

  const handleCheckBoxChange = e => {
    const newStatus = +e.target.checked;
    handleCheck(path, newStatus);
    onCheckbox && onCheckbox(path, newStatus);
  };

  const onNameChange = newName => handleRename(path, newName);

  const selectMe = () => (!isEditing && !readOnly && setIsSelected(true));
  // const unSelectMe = () => setIsSelected(false);

  const openMe = () => handleToggleOpen(path, true);
  const closeMe = () => handleToggleOpen(path, false);

  // const editMe = () => {
  //   setIsEditing(true);
  //   setIsSelected(false);
  // };

  // const deleteMe = () => handleDelete(path);

  // const addFile = () => handleAddNode(path, false);
  // const addFolder = () => handleAddNode(path, true);

  const handleNameClick = () => {
    const defaultOnClick = selectMe;
    if (onNameClick && typeof onNameClick === 'function') {
      !isEditing && onNameClick({ defaultOnClick, nodeData });
    } else {
      defaultOnClick();
    }
    if (isFolder) {
      isOpen ? closeMe() : openMe();
    }
  };

  // const TreeNodeToolBar = (
  //   <span className={ iconContainerClassName('TreeNodeToolBar') }>
  //     <EditIcon
  //       className={ iconClassName('EditIcon') }
  //       onClick={ editMe }
  //       nodeData={ nodeData }
  //     />
  //     <DeleteIcon
  //       className={ iconClassName('DeleteIcon') }
  //       onClick={ deleteMe }
  //       nodeData={ nodeData }
  //     />
  //     {
  //       isFolder && (
  //         <>
  //           <AddFileIcon
  //             className={ iconClassName('AddFileIcon') }
  //             onClick={ addFile }
  //             nodeData={ nodeData }
  //           />
  //           <AddFolderIcon
  //             className={ iconClassName('AddFolderIcon') }
  //             onClick={ addFolder }
  //             nodeData={ nodeData }
  //           />
  //         </>
  //       )
  //     }

  //     <CancelIcon
  //       className={ iconClassName('CancelIcon') }
  //       onClick={ unSelectMe }
  //       nodeData={ nodeData }
  //     />
  //   </span>
  // );

  const folderCaret = (
    <span
      className={ iconContainerClassName('caretContainer') }
      ref={ref}
    >
      {
        isOpen
          ? (
            <CaretDownIcon
              className={ iconClassName('CaretDownIcon') }
              onClick={ closeMe }
              nodeData={ nodeData }
            />
          )
          : (
            <CaretRightIcon
              className={ iconClassName('CaretRightIcon') }
              onClick={ openMe }
              nodeData={ nodeData }
            />
          )
      }
    </span>
  );

  return (
    <>
      <div
        className='TreeNode'
        style={ treeNodeStyle }
        data-folder-tree-is-directory={ typeof nodeData.isOpen === 'boolean' }
        data-folder-tree-path={ JSON.stringify(nodeData.path) }
        data-folder-tree-id={ nodeData._id }
      >
        { showCheckbox && (
          <CheckBox
            status={ checked }
            onChange={ handleCheckBoxChange }
          />
        )}

        { isFolder && folderCaret }

        <span className={ iconContainerClassName('typeIconContainer') }>
          <TypeIcon
            className={ iconClassName(TypeIconType) }
            onClick={ selectMe }
            nodeData={ nodeData }
          />
        </span>

        <span
          className={ iconContainerClassName('editableNameContainer') }
          onClick={ handleNameClick }
          data-folder-tree-is-directory={ typeof nodeData.isOpen === 'boolean' }
          data-folder-tree-path={ JSON.stringify(nodeData.path) }
          data-folder-tree-id={ nodeData._id }
        >
          <EditableName
            isEditing={ isEditing }
            setIsEditing={ setIsEditing }
            onNameChange={ onNameChange }
            OKIcon={ OKIcon }
            CancelIcon={ CancelIcon }
            nodeData={ nodeData }
          />
        </span>
        {/* { isSelected && TreeNodeToolBar } */}

      </div>

      {
        isFolder && isOpen && children.map((data, idx) => (
          <TreeNode
            key={ data._id }
            path={ [...path, idx] }
            { ...data }
          />
        ))
      }
    </>
  );
};

TreeNode.propTypes = {
  path: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
  checked: PropTypes.number.isRequired,
  isOpen: PropTypes.bool,

  children: PropTypes.array,
};

export default TreeNode;
