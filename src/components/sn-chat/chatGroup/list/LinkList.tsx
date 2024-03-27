import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "components/Link";
import Media from "components/Media";
import { DataStatus } from "constant/enums";
import { AN_ERROR_TRY_AGAIN, NS_COMMON } from "constant/index";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo } from "react";
import { useSnackbar } from "store/app/selectors";
import { useChat } from "store/chat/selectors";

const LinkList = () => {
  const {
    chatLinks,
    chatLinksStatus,
    conversationInfo,
    roomId,
    onGetChatUrls,
  } = useChat();
  const { onAddSnackbar } = useSnackbar();
  const commonT = useTranslations(NS_COMMON);

  const handleGetUrl = useCallback(async () => {
    try {
      await onGetChatUrls({ type: conversationInfo?.t, roomId });
    } catch (error) {
      onAddSnackbar(
        typeof error === "string" ? error : commonT(AN_ERROR_TRY_AGAIN),
        "error",
      );
    }
  }, [commonT, conversationInfo?.t, onAddSnackbar, onGetChatUrls, roomId]);

  useEffect(() => {
    handleGetUrl();
  }, [handleGetUrl]);

  const chatLinkClone = useMemo(() => {
    return chatLinks?.reduce((result, current) => {
      const { urls, ...rest } = current;
      const url = current.urls.map((item) => ({ ...rest, ...item }));
      return [...result, ...url];
    }, [] as unknown as { url: string; meta: {}; messageId: string; ts: string }[]);
  }, [chatLinks]);

  if (
    chatLinksStatus === DataStatus.LOADING ||
    chatLinksStatus === DataStatus.FAILED
  ) {
    return <Typography textAlign="center">Loading...</Typography>;
  }

  return (
    <Box
      sx={{
        overflow: "auto",
        maxHeight: "100%",
        height: "100%",
        paddingLeft: "1rem",
        paddingRight: "0.3rem",
      }}
    >
      {chatLinkClone?.length > 0 ? (
        chatLinkClone.map((item, index) => {
          return (
            <Box
              key={index}
              display="flex"
              flexDirection="row"
              alignItems="center"
              py=".5rem"
              gap="1rem"
              borderBottom="1px solid #ECECF3"
            >
              <Media
                size={64}
                style={{
                  minWidth: "64px",
                  borderRadius: "10px",
                }}
              />
              <Link
                href={item.url}
                target="_blank"
                sx={{
                  overflowWrap: "anywhere",
                }}
              >
                {item.url}
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

export default LinkList;
