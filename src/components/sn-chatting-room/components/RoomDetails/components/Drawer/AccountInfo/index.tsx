import { Avatar, Box, CircularProgress } from "@mui/material";
import AccountInfoHeader from "./InfoHeader";
import AccountInfoItem from "./AccountInfoItem";
import { UserInfo } from "store/app/reducer";
import { useTranslations } from "next-intl";
import { NS_AUTH } from "constant/index";
import { useChat } from "store/chat/selectors";
import useGetScreenMode from "hooks/useGetScreenMode";
import useTheme from "hooks/useTheme";
import { useCallback, useEffect } from "react";

const mapperDataToInfo = (partnerInfo: Partial<UserInfo>) => ({
  fullName: partnerInfo.fullname,
  email: partnerInfo.email,
  position: partnerInfo.position?.name,
  phone: partnerInfo.phone,
});

const AccountInfo = () => {
  const { extraDesktopMode } = useGetScreenMode();
  const { partnerInfo, isFetchingDetail } = useChat();
  const t = useTranslations(NS_AUTH);
  const { isDarkMode } = useTheme();

  const {
    dataTransfer: currentConversation,
    onSetDrawerType,
    onGetUserInfo,
  } = useChat();

  const callbackOpenAccount = useCallback(() => {
    if (!currentConversation.username) return;
    onGetUserInfo(currentConversation?.username);
  }, [currentConversation?.username, onGetUserInfo]);

  useEffect(() => {
    callbackOpenAccount();
  }, [callbackOpenAccount]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        width: extraDesktopMode ? "424px" : "272px",
        // height: extraDesktopMode ? "948px" : "730px",
        gap: "12px",
        backgroundColor: isDarkMode ? "#313130" : "var(--Gray0, #F7F7FD)",
        overflow: "auto",
        height: "100%",
      }}
    >
      {isFetchingDetail ? (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="60vh"
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <AccountInfoHeader onClose={() => onSetDrawerType("info")} />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <Avatar
              src={currentConversation?.avatar}
              sx={{
                height: "80px",
                width: "80px",
                flexShrink: "0",
                borderRadius: "10px",
              }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              alignSelf: "stretch",
              flexDirection: "column",
              padding: "0px 12px",
            }}
          >
            {partnerInfo &&
              Object.keys(mapperDataToInfo(partnerInfo))?.map((key) => (
                <AccountInfoItem
                  key={key}
                  label={t(`signup.form.title.${key}`)}
                  value={mapperDataToInfo(partnerInfo)[key]}
                />
              ))}
          </Box>
        </>
      )}
    </Box>
  );
};

export default AccountInfo;
