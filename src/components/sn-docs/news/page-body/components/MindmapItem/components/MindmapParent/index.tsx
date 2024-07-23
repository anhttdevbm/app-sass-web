import { Box, Input, Stack } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import { IMindmapItem } from "../..";
import MindmapChildren from "../MinmapChildren";
import { uuid } from "utils/index";

import HoverIconAdd from "../HoverIconAdd";
import HoverIconDelete from "../HoverIconDelete";
import useMindmap from "../../hooks/useMindmap";

export default function MindmapParent({
  mindmapParent,
  onChangeTitleParent,
}: {
  mindmapParent: IMindmapItem;
  onChangeTitleParent: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const [isShowAdd, setIsShowAdd] = useState<boolean>(false);
  const { handleAddChildren, handleDeleteChildren } = useMindmap();
  const handleAddChild = () => {
    setIsShowAdd(false);
    handleAddChildren()
  };
  const handleDeleteChild = () => {
    setIsShowAdd(false);
    handleDeleteChildren()
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
      {isShowAdd && !mindmapParent?.children?.length && (
        <HoverIconAdd onClickIcon={handleAddChild} />
      )}
      {isShowAdd && mindmapParent?.children?.length && (
        <HoverIconDelete onClickIcon={handleDeleteChild} />
      )}
      <MindmapChildren
        childrenMindmap={mindmapParent.children ?? []}
      />
    </Stack>
  );
}
