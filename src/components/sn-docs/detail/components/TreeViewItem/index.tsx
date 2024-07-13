import { TreeItem } from "@mui/lab";
import { IChildDocDetail } from "../../DocDetail";
import TreeViewLabel from "../TreeViewLabel";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { Box, Typography } from "@mui/material";

const renderLabelChildItem = ({content}:{content: string}) => {
    return (
        <Box display="flex" alignItems="center" gap={1}>
              <FiberManualRecordIcon sx={{ height: 8, width: 8 }} />
              <Typography>{content}</Typography>
        </Box>
    )
}

export default function TreeViewItem({
  childDocItem,
}: {
  childDocItem: IChildDocDetail;
}) {
  const handleClickAdd = () => {
    console.log("add new child ?? =>>> ");
  };

  return (
    <TreeItem
      nodeId={childDocItem.id}
      label={
        <TreeViewLabel
          key={childDocItem.id}
          labelText={childDocItem.name}
          handleClickTreeLabel={handleClickAdd}
        />
      }
    >
      <TreeItem nodeId={`${childDocItem.id}-${childDocItem.name}`} label={renderLabelChildItem({content: childDocItem.name})}></TreeItem>
    </TreeItem>
  );
}
