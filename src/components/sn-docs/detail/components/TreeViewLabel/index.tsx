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
  };
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
          justifyContent: "end",
          flex: 1,
        }}
      >
        <MorePoper id={dataRename?.idDoc} isParentDoc={dataRename?.isParent} />
        <Box
          onClick={() => handleClickTreeLabel()}
          sx={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          }}
        >
          <IconAdd />
        </Box>
      </Box>
    </Box>
  );
}
