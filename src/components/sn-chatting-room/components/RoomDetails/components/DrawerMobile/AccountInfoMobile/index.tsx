import { Box, Typography, Avatar } from "@mui/material";
import AccountInfoMobileHeader from "./AccountInfoMobileHeader";
import { IChatItemInfo } from "store/chat/type";
import { useChat } from "store/chat/selectors";
import React from "react";
import { UserInfo } from "store/app/reducer";
import { useTranslations } from "next-intl";
import { NS_AUTH } from "constant/index";
import AccountInfoMobileItem from "./AccountInfoMobileItem";

interface AccountInfoMobileProps {
  isOpen: boolean;
  onClose: () => void;
  currentConversation: IChatItemInfo;
}

const mapperDataToInfo = (partnerInfo: Partial<UserInfo>) => ({
  fullName: partnerInfo.fullname,
  position: partnerInfo.position?.name,
  phone: partnerInfo.phone,
  email: partnerInfo.email,
});

const AccountInfoMobile: React.FC<AccountInfoMobileProps> = (props) => {
  const { partnerInfo } = useChat();
  const t = useTranslations(NS_AUTH);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "32px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          gap: "12px",
        }}
      >
        <AccountInfoMobileHeader onClose={props.onClose} />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <Avatar
            src={props.currentConversation?.avatar}
            sx={{
              height: "80px",
              width: "80px",
              flexShrink: "0",
              borderRadius: "100px",
            }}
          />
          <Typography variant="h4" color="var(--Black, #212121)">
            {props.currentConversation?.name}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          alignSelf: "stretch",
          flexDirection: "column",
          padding: "0px 16px",
        }}
      >
        {partnerInfo &&
          Object.keys(mapperDataToInfo(partnerInfo))?.map((key) => (
            <AccountInfoMobileItem
              key={key}
              label={t(`signup.form.title.${key}`)}
              value={mapperDataToInfo(partnerInfo)[key]}
            />
          ))}
      </Box>
    </Box>
  );
};

export default AccountInfoMobile;
