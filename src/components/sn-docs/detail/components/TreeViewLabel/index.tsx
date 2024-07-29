import { Box, Typography } from "@mui/material";
import MorePoper from "../../LeftSlide/MorePoper";
import IconAdd from "icons/IconAdd";

export default function TreeViewLabel({
  labelText,
  handleClickTreeLabel,
  dataRename,
}: {
  labelText: string;
  handleClickTreeLabel: () => void;
  dataRename?: {
    idDoc?: string;
    isParent?: boolean;
  }
  
}) {
  return (
    <Box
      sx={{
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        zIndex: 2,
        padding: 1,
        ":hover": {
          " .btn-more": {
            visibility: "visible",
          },
        },
      }}
    >
      <Typography>{labelText}</Typography>
      <Box
        className="btn-more"
        sx={{
          visibility: "hidden",
          display: "flex",
          alignItems: "center",
          gap: 1.4,
        }}
      >
        <MorePoper id={dataRename?.idDoc} isParentDoc={dataRename?.isParent}></MorePoper>
        <Box
          onClick={() => handleClickTreeLabel()}
          sx={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          }}
        >
          <IconAdd></IconAdd>
        </Box>
      </Box>
    </Box>
  );
}
