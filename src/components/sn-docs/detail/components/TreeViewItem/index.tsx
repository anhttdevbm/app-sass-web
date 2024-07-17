import { TreeItem } from "@mui/lab";
import { IChildDocDetail } from "../../DocDetail";
import TreeViewLabel from "../TreeViewLabel";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { Box, Typography } from "@mui/material";
import useLeftSlideDoc from "../../LeftSlide/hooks/useLeftSlideDoc";
import { useDocs } from "store/docs/selectors";

const renderLabelChildItem = ({ content }: { content: string }) => {
  return (
    <Box display="flex" alignItems="center" gap={1}>
      <FiberManualRecordIcon sx={{ height: 8, width: 8 }} />
      <Typography>{content}</Typography>
    </Box>
  );
};

export default function TreeViewItem({
  childDocItem,
  idDocParent,
  projectId,
}: {
  childDocItem: IChildDocDetail;
  idDocParent: string;
  projectId?: string;
}) {
  const { handleAddChild } = useLeftSlideDoc();
  const { redirectDetailDoc } = useDocs();

  const handleAddNewChildDoc = () => {
    handleAddChild(idDocParent, projectId);
  };
  if (childDocItem)
    return (
      <TreeItem
        nodeId={childDocItem?.id}
        label={
          <TreeViewLabel
            key={childDocItem.id}
            labelText={childDocItem.name}
            dataRename={{ idDoc: childDocItem.id, isParent: false }}
            handleClickTreeLabel={() => handleAddNewChildDoc()}
          />
        }
      >
        <TreeItem
          onClick={() => redirectDetailDoc(childDocItem.id)}
          nodeId={`expand-${childDocItem?.id}`}
          label={renderLabelChildItem({ content: childDocItem.name ?? "" })}
        ></TreeItem>
      </TreeItem>
    );
}
