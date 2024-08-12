import { TreeItem, TreeView, treeItemClasses } from "@mui/lab";
import {
  Collapse,
  styled,
  SvgIcon,
  alpha,
  Box,
  TextField,
  Typography,
} from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { useState } from "react";
import MinusSquareBoard from "icons/MinusSquareBoard";
import PlusSquareBoard from "icons/PlusSquareBoard";
import { NS_DOCS } from "constant/index";
import { useTranslations } from "next-intl";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DialogEditBoardBoxEditorItem, {
  INewItemBoardBoxEditor,
} from "../DialogEditBoardBoxEditorItem";
import React from "react";

export interface IDataTreeBoard {
  id: string;
  name: string;
  children?: IDataTreeBoard[];
}

interface IBoardBoxEditorItemProps extends IDataTreeBoard {
  onChangeName: (id: string, newName: string) => void;
  selectedId: string;
  deleteTree: (id: string) => void;
  addNewItemChild?: (id: string, name: string) => void;
}

interface BoardBoxEditorProps {
  boardBoxItem: IDataTreeBoard;
  addNewTreeChildren: (idTreeItem: string, name?: string) => void;
  handleChangeName: (id: string, newName: string) => void;
  deleteTree: (idTree: string) => void;
  sx?: object;
}

const EditableLabel = ({ name, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(name);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (value !== name) {
      onChange(value);
    }
  };

  return isEditing ? (
    <TextField
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={handleBlur}
      autoFocus
    />
  ) : (
    <Typography onDoubleClick={handleDoubleClick}>{name}</Typography>
  );
};

const StyledTreeItem = styled(TreeItem)(({ theme }) => ({
  [`& .${treeItemClasses.iconContainer}`]: {
    "& .close": {
      opacity: 0.3,
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1.25px solid #EAEAEA`,
  },
}));

const ButtonRightSide = ({
  props,
  setOpenDialog,
}: {
  props: IBoardBoxEditorItemProps;
  setOpenDialog: (val: boolean) => void;
}) => {
  const { selectedId, deleteTree } = props;

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  return (
    <Box sx={{ mariginLeft: "auto", display: "flex", gap: 0.5 }}>
      <EditIcon
        onClick={handleClickOpenDialog}
        sx={{
          height: "18px",
          width: "18px",
          color: "blue.normal",
          cursor: "pointer",
        }}
      />
      <DeleteIcon
        onClick={() => deleteTree(selectedId)}
        sx={{
          height: "18px",
          width: "18px",
          color: "error.dark",
          cursor: "pointer",
        }}
      />
    </Box>
  );
};

const BoardBoxEditorItem: React.FC<IBoardBoxEditorItemProps> = (props) => {
  const {
    id,
    name,
    children,
    selectedId,
    onChangeName,
    addNewItemChild,
    deleteTree,
    ...other
  } = props;

  const [isShowRightButton, setIsShowRightButton] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const handleClickOutside = () => {
    setIsShowRightButton(false);
  };

  const useOutsideClick = (callback: () => void) => {
    const ref = React.useRef();

    React.useEffect(() => {
      const handleClick = () => {
        callback();
      };

      document.addEventListener("click", handleClick);

      return () => {
        document.removeEventListener("click", handleClick);
      };
    }, [callback]);

    return ref;
  };

  const ref = useOutsideClick(handleClickOutside);

  const handleAddChildrenDialog = (val: INewItemBoardBoxEditor) => {
    if (val.newName) {
      onChangeName(id, val.newName);
    }

    if (val.newNameChild && addNewItemChild) {
      console.log("abc123");
      addNewItemChild(id, val.newNameChild);
    }
  };

  return (
    <Box display="flex" ref={ref} onClick={() => setIsShowRightButton(true)}>
      <StyledTreeItem
        nodeId={id}
        label={
          <EditableLabel
            name={name}
            onChange={(newName) => onChangeName(id, newName)}
          />
        }
        {...other}
        onClick={() => setIsShowRightButton(true)}
      >
        {children?.map((child) => (
          <BoardBoxEditorItem
            key={child.id}
            {...child}
            selectedId={selectedId}
            addNewItemChild={addNewItemChild}
            onChangeName={onChangeName}
            deleteTree={deleteTree}
          />
        ))}
      </StyledTreeItem>
      {selectedId === id && isShowRightButton && selectedId && (
        <ButtonRightSide props={props} setOpenDialog={setOpenDialog} />
      )}
      <DialogEditBoardBoxEditorItem
        addConfirmAddDialog={handleAddChildrenDialog}
        name={name}
        open={openDialog}
        setOpen={setOpenDialog}
      />
    </Box>
  );
};

export default function BoardBoxEditor({
  boardBoxItem,
  addNewTreeChildren,
  handleChangeName,
  deleteTree,
}: BoardBoxEditorProps) {
  const docsT = useTranslations(NS_DOCS);

  const [selectedId, setSelectedId] = useState<string>("");

  const handleSelect = (event: React.SyntheticEvent, nodeId: string) => {
    setSelectedId(nodeId);
  };

  return (
    <TreeView
      aria-label="customized"
      defaultCollapseIcon={
        <MinusSquareBoard style={{ width: 14, height: 14 }} />
      }
      defaultEndIcon={
        <FiberManualRecordIcon
          sx={{ width: 14, height: 14, color: "#EAEAEA" }}
        />
      }
      defaultExpandIcon={<PlusSquareBoard style={{ width: 14, height: 14 }} />}
      sx={{
        height: 378,
        minWidth: 456,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#F2FAFF",
        borderRadius: "24px",
        padding: 3,
      }}
      selected={selectedId}
      onNodeSelect={handleSelect}
    >
      <BoardBoxEditorItem
        {...boardBoxItem}
        onChangeName={handleChangeName}
        addNewItemChild={addNewTreeChildren}
        selectedId={selectedId}
        deleteTree={deleteTree}
      />

      <Box
        sx={{
          marginTop: "auto",
          textAlign: "center",
          color: "#14B9E5",
          cursor: "pointer",
          fontSize: "16px",
          fontWeight: 600,
        }}
        onClick={() => addNewTreeChildren(boardBoxItem.id)}
      >
        + {docsT("button.add")}
      </Box>
    </TreeView>
  );
}
