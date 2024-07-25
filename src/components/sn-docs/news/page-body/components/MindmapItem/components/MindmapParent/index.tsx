import { Box, Input, Stack } from "@mui/material";
import { useState } from "react";
import { IMindmapItem } from "../..";
import MindmapChildren from "../MinmapChildren";

import HoverIconAdd from "../HoverIconAdd";
import HoverIconDelete from "../HoverIconDelete";
import useMindmap from "../../hooks/useMindmap";

export default function MindmapParent({
  mindmapParent,
  onChangeTitleParent,
  addChildNodeOne,
  deleteRootChildren,
  handleAddChildOfChild
}: {
  mindmapParent: IMindmapItem;
  onChangeTitleParent: (event: React.ChangeEvent<HTMLInputElement>) => void;
  addChildNodeOne: (newChild: IMindmapItem) => void;
  deleteRootChildren: () => void;
  handleAddChildOfChild: (newChild: IMindmapItem, id: string) => void;
}) {
  const [isShowAdd, setIsShowAdd] = useState<boolean>(false);
  const { getNewChild } = useMindmap();
  const handleAddChild = () => {
    const newChildren = getNewChild();
    addChildNodeOne(newChildren);
    setIsShowAdd(false);
  };
  const handleDeleteChild = () => {
    deleteRootChildren();
    setIsShowAdd(false);
  };

  const handleAddSession = (newChild: IMindmapItem) => {
    addChildNodeOne(newChild);
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={0.5}
      onMouseEnter={() => setIsShowAdd(true)}
      onMouseLeave={() => setIsShowAdd(false)}
    >
      <Box
        sx={{
          paddingX: 1,
          paddingY: 2,
          width: "301px",
          backgroundColor: "grey.50",
          borderRadius: "12px",
        }}
      >
        <Input
          value={mindmapParent.title}
          disableUnderline
          onChange={onChangeTitleParent}
        />
      </Box>
      {isShowAdd && !mindmapParent.children?.length ? (
        <HoverIconAdd onClickIcon={handleAddChild} />
      ) : null}
      {isShowAdd && mindmapParent.children && mindmapParent.children?.length ? (
        <HoverIconDelete onClickIcon={handleDeleteChild} />
      ) : null}
      {mindmapParent.children?.length ? (
        <MindmapChildren
          handleAddChildOfChild={handleAddChildOfChild}
          handleAddSession={handleAddSession}
          mindMapParent={mindmapParent}
        />
      ) : null}
    </Stack>
  );
}
