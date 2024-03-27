import { Box } from "@mui/material";
import { FC } from "react";
import MediaContent from "components/sn-chat/components/common/MediaContent";
import FileContent from "components/sn-chat/components/common/FileContent";
import LinkContent from "components/sn-chat/components/common/LinkContent";
import AccountInfoMobileHeader from "../AccountInfoMobile/AccountInfoMobileHeader";

const TYPES = [
  {
    text: "Media file",
    type: "media",
  },
  {
    text: "Link",
    type: "link",
  },
  {
    text: "File",
    type: "file",
  },
];

const StorageInfoMobile: FC<any> = (props) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        gap: "12px",
        backgroundColor: "var(--Gray0, #F7F7FD)",
      }}
    >
      <AccountInfoMobileHeader onClose={props.onClose} title="Media & Files" />
      <Box
        sx={{
          display: "flex",
          gap: "12px",
        }}
      >
        {TYPES.map((type) => (
          <Box
            gap="10px"
            key={type.type}
            sx={{
              padding: "5px 10px",
              borderRadius: "30px",
              border: `1px solid ${
                type?.type === props.type ? "#3699FF" : "#999999"
              }`,
              color: type?.type === props.type ? "#3699FF" : "#999999",
              minWidth: "78px",
              textAlign: "center",
              fontSize: "14px",
              cursor: "pointer",
            }}
            onClick={() =>
              props?.onChangeTypeDrawer && props?.onChangeTypeDrawer(type?.type)
            }
          >
            {type.text}
          </Box>
        ))}
      </Box>
      <Box>
        {props?.type === "media" && <MediaContent />}
        {props?.type === "link" && <LinkContent />}
        {props?.type === "file" && <FileContent />}
      </Box>
    </Box>
  );
};

export default StorageInfoMobile;
