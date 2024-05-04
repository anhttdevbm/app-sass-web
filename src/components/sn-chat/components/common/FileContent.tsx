import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "components/Link";
import { DataStatus } from "constant/enums";
import { NS_COMMON } from "constant/index";
import useTheme from "hooks/useTheme";
import FileBasicIcon from "icons/FileBasicIcon";
import { useTranslations } from "next-intl";
import { useChat } from "store/chat/selectors";

const FileContent = () => {
  const { chatFiles, chatFilesStatus } = useChat();
  const commonT = useTranslations(NS_COMMON);
  const { isDarkMode } = useTheme();

  if (chatFilesStatus !== DataStatus.SUCCEEDED) {
    return <Typography textAlign="center">Loading...</Typography>;
  }

  return (
    <Box
      sx={{
        overflow: "auto",
        maxHeight: "calc(600px - 77px - 59px - 16px)",
        height: "100%",
        paddingLeft: "1rem",
        paddingRight: "0.3rem",
      }}
    >
      {chatFiles.length > 0 ? (
        chatFiles?.map((item, index) => {
          return (
            <Box
              key={index}
              display="flex"
              flexDirection="row"
              alignItems="center"
              py=".5rem"
              gap="1rem"
            >
              <FileBasicIcon
                sx={{
                  fill: "transparent",
                  color: "#666666",
                }}
              />
              <Link
                href={item?.url}
                target="_blank"
                sx={{
                  color: isDarkMode ? "white" : "#212121",
                  overflowWrap: "anywhere",
                  fontWeight: 600,
                  textDecoration: "auto",
                }}
              >
                {item?.name}
              </Link>
            </Box>
          );
        })
      ) : (
        <Typography textAlign="center">{commonT("noData")}</Typography>
      )}
    </Box>
  );
};

export default FileContent;
