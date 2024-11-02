import { useChat } from "store/chat/selectors";
import ProfileHeader from "../common/ProfileHeader";
import Box from "@mui/material/Box";
import Avatar from "components/Avatar";
import { SxProps, Typography } from "@mui/material";
import { STEP_INFO } from "store/chat/type";
import { DataStatus } from "constant/enums";
import { useTranslations } from "next-intl";
import { NS_AUTH } from "constant/index";
import { useAuth } from "store/app/selectors";

interface UserInfoProps {
  onPrevious: (step) => void;
}

const UserInfo = ({ onPrevious }: UserInfoProps) => {
  const { user } = useAuth();
  const { conversationInfo, partnerInfoStatus, onGetUserInfo } = useChat();
  const { name, members } = conversationInfo || {};
  const partnerInfo = members?.find((item) => item?.id != user?.id);
  const t = useTranslations(NS_AUTH);

  const styleFormItem: SxProps = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    "& :first-of-type": {
      whiteSpace: "nowrap",
    },
    "& :last-of-type": {
      textAlign: "end",
    },
  };

  return (
    <>
      <ProfileHeader
        name={name || ""}
        onPrevious={() => {
          onPrevious(STEP_INFO.IDLE);
        }}
        containerProps={{
          sx: {
            position: "relative",
          },
        }}
        nameProps={{
          sx: {
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            maxWidth: "100%",
            width: "200px",
            display: "-webkit-box",
            WebkitLineClamp: "2",
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textAlign: "center",
          },
        }}
      />
      <Box textAlign="center" pt={2} pb={4} overflow="auto">
        {partnerInfoStatus === DataStatus.LOADING ||
        partnerInfoStatus === DataStatus.FAILED ? (
          <>Loading...</>
        ) : (
          <>
            <Avatar
              alt="Avatar"
              src={partnerInfo?.avatar || undefined}
              size={120}
              style={{
                borderRadius: "50%",
                // borderRadius: "10px",
                objectFit: "cover",
              }}
            />
            <Box display="flex" flexDirection="column" gap={2} mt={5} p="1rem">
              <Box sx={styleFormItem}>
                <Typography color="#666666">
                  {t("signup.form.title.fullName")}
                </Typography>
                <Typography>{partnerInfo?.fullname}</Typography>
              </Box>
              <Box sx={styleFormItem}>
                <Typography color="#666666">
                  {t("signup.form.title.position")}
                </Typography>
                <Typography>{partnerInfo?.position}</Typography>
              </Box>
              <Box sx={styleFormItem}>
                <Typography color="#666666">
                  {t("signup.form.title.phone")}
                </Typography>
                <Typography>{partnerInfo?.phone}</Typography>
              </Box>
              <Box sx={styleFormItem}>
                <Typography color="#666666">
                  {t("signup.form.title.email")}
                </Typography>
                <Typography>{partnerInfo?.email}</Typography>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </>
  );
};

export default UserInfo;
