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

export interface IDataTreeBoard {
  id: string;
  name: string;
  children?: IDataTreeBoard[];
}

interface IBoardBoxEditorItemProps extends IDataTreeBoard {
  onChangeName: (id: string, newName: string) => void;
}

interface BoardBoxEditorProps {
  boardBoxItem: IDataTreeBoard;
  addNewTreeChildren: (idTreeItem: string) => void;
  handleChangeName: (id: string, newName: string) => void;
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

const BoardBoxEditorItem: React.FC<IBoardBoxEditorItemProps> = (props) => {
  const { id, name, children, onChangeName, ...other } = props;
  return (
    <StyledTreeItem
      nodeId={id}
      label={
        <EditableLabel
          name={name}
          onChange={(newName) => onChangeName(id, newName)}
        />
      }
      {...other}
    >
      {children?.map((child) => (
        <BoardBoxEditorItem
          key={child.id}
          {...child}
          onChangeName={onChangeName}
        />
      ))}
    </StyledTreeItem>
  );
};

export default function BoardBoxEditor({
  boardBoxItem,
  addNewTreeChildren,
  handleChangeName,
}: BoardBoxEditorProps) {
    const docsT = useTranslations(NS_DOCS);

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
    >
      <BoardBoxEditorItem {...boardBoxItem} onChangeName={handleChangeName} />

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