import { useChat } from "store/chat/selectors";
import ProfileHeader from "../common/ProfileHeader";
import Box from "@mui/material/Box";
import Avatar from "components/Avatar";
import { SxProps, Typography } from "@mui/material";
import { STEP_INFO } from "store/chat/type";
import { useEffect } from "react";
import { DataStatus } from "constant/enums";
import { useSnackbar } from "store/app/selectors";
import { AN_ERROR_TRY_AGAIN, NS_COMMON } from "constant/index";
import { useTranslations } from "next-intl";

interface UserInfoProps {
  onPrevious: (step) => void;
}
const UserInfo = ({ onPrevious }: UserInfoProps) => {
  const { conversationInfo, partnerInfo, partnerInfoStatus, onGetUserInfo } =
    useChat();
  const { onAddSnackbar } = useSnackbar();
  const { avatar, name, username } = conversationInfo || {};
  const t = useTranslations(NS_COMMON);

  useEffect(() => {
    const handleGetUserInfo = async () => {
      try {
        if (username) {
          await onGetUserInfo(username);
        }
      } catch (error) {
        onAddSnackbar(
          typeof error === "string" ? error : t(AN_ERROR_TRY_AGAIN),
          "error",
        );
      }
    };
    handleGetUserInfo();
  }, [onAddSnackbar, onGetUserInfo, username, t]);

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
              src={avatar || undefined}
              size={120}
              style={{
                borderRadius: "50%",
                // borderRadius: "10px",
                objectFit: "cover",
              }}
            />
            <Box display="flex" flexDirection="column" gap={2} mt={5} p="1rem">
              <Box sx={styleFormItem}>
                <Typography color="#666666">Họ tên</Typography>
                <Typography>{partnerInfo?.fullname}</Typography>
              </Box>
              <Box sx={styleFormItem}>
                <Typography color="#666666">Chức vụ</Typography>
                <Typography>{partnerInfo?.position?.name}</Typography>
              </Box>
              <Box sx={styleFormItem}>
                <Typography color="#666666">Số điện thoại</Typography>
                <Typography>{partnerInfo?.phone}</Typography>
              </Box>
              <Box sx={styleFormItem}>
                <Typography color="#666666">Email</Typography>
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
