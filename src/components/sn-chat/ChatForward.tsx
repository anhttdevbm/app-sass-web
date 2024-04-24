/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box } from "@mui/system";
import SelectItem from "./components/SelectItem";
import { Skeleton, Typography } from "@mui/material";
import { Button, Input } from "components/shared";
import { useChat } from "store/chat/selectors";
import { useTranslations } from "next-intl";
import { NS_COMMON } from "constant/index";
import { useEmployeesOfCompany } from "store/manager/selectors";
import { useAuth, useSnackbar } from "store/app/selectors";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { Employee } from "store/company/reducer";
import { STEP } from "store/chat/type";
import useTheme from "hooks/useTheme";
import AttachmentContent from "./components/conversation/AttachmentContent";

interface Props {
  callbackCancel?: () => void;
  conversations?: any[];
  loading?: boolean;
}

const ChatForward: FC<Props> = (props) => {
  const [employeeIdSelected, setEmployeeIdSelected] = useState<any>({});
  const commonT = useTranslations(NS_COMMON);
  const { onAddSnackbar } = useSnackbar();
  const {
    isFetching,
    error,
    onGetEmployees,
    onApproveOrReject: onApproveOrRejectAction,
  } = useEmployeesOfCompany();
  const { user } = useAuth();

  const { isDarkMode } = useTheme();
  const {
    convention,
    dataTransfer,
    onSetStep,
    onForwardMessage,
    isChatDesktop,
    onSetDataTransfer,
    onGetAllConvention,
    onSetConversationInfo,
  } = useChat();

  useEffect(() => {
    onGetEmployees(user?.company ?? "", { pageIndex: 0, pageSize: 30 });
  }, []);

  const handleClickConversation = (
    employee: any,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setEmployeeIdSelected({
      ...employeeIdSelected,
      [employee?._id ?? ""]: event.target.checked,
    });
  };

  const handleForwardMessage = () => {
    if (!Object.values(employeeIdSelected)?.filter((item) => item)?.length) {
      onAddSnackbar("Please select at least one member!", "error");
      return;
    }
    const fws = Object.keys(employeeIdSelected)
      .filter((item) => employeeIdSelected[item])
      .map(async (item) => {
        return await onForwardMessage({
          messageId: dataTransfer?.message?._id,
          roomId: item,
        });
      });
    Promise.all(fws).then((values) => {
      onAddSnackbar("Forward message successfully!", "success");
      if (isChatDesktop) {
        onSetDataTransfer(dataTransfer);
        /*onGetAllConvention({
          count: 10,
          offset: 0,
          text: "",
          type: "a",
        });*/
      } else {
        // console.log({ dataTransfer });
        const targetEmployeeId = Object.keys(employeeIdSelected)
          .filter((item) => employeeIdSelected[item])
          ?.at(-1);
        const target = (isChatDesktop ? props?.conversations : convention)
          ?.filter((i) => i?._id === targetEmployeeId)
          ?.at(-1);
        // console.log({ dataTransfer, targetEmployeeId, target });
        onSetDataTransfer(target);
        onSetConversationInfo(target);
        onSetStep(target.t === "d" ? STEP.CHAT_ONE : STEP.CHAT_GROUP, target);
      }
    });
  };

  return (
    <>
      <Box
        sx={{
          padding: isChatDesktop ? 0 : 3,
          paddingTop: isChatDesktop ? 3 : 0,
        }}
      >
        <Box
          sx={{
            marginBottom: "24px",
            ...(isChatDesktop
              ? { height: "fix-content", maxHeight: "200px" }
              : { height: "295px" }),
          }}
        >
          <Box
            overflow="auto"
            sx={{
              height: "100%",
              "&::-webkit-scrollbar": {
                width: "0.4em",
              },
              "&::-webkit-scrollbar-track": {
                background: "white",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#ECECF3",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                background: "#ECECF3",
              },
              marginBottom: "24px",
            }}
            style={{
              ...(isChatDesktop
                ? { height: "fix-content", maxHeight: "200px" }
                : { height: "295px" }),
            }}
          >
            {props?.loading || isFetching || error ? (
              Array.from({ length: 5 }, (_, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                  p={2}
                >
                  <Skeleton variant="rounded" width={40} height={40} />
                  <Box flex={1}>
                    <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                    <Skeleton
                      variant="text"
                      sx={{ fontSize: "1rem" }}
                      width="40%"
                    />
                  </Box>
                </Box>
              ))
            ) : (
              <>
                {(isChatDesktop ? props?.conversations : convention)
                  ?.filter((item) => item?._id !== dataTransfer?._id)
                  ?.filter((item) => item?.name)
                  ?.map((item, index) => (
                    <SelectItem
                      checked={
                        employeeIdSelected?.hasOwnProperty(item._id) &&
                        employeeIdSelected[item._id] === true
                      }
                      checkbox
                      onClick={(event) => handleClickConversation(item, event)}
                      employee={
                        {
                          avatar: { link: item?.avatar },
                          fullname: item?.name,
                          email: "",
                          _id: item?._id,
                        } as unknown as Employee
                      }
                      key={index}
                    />
                  ))}
              </>
            )}
          </Box>
        </Box>

        <Box>
          {isChatDesktop ? (
            <Typography
              sx={{
                borderTop: "1px solid #E0E0E0",
                color: !isDarkMode ? "#1e1e1e" : "white",
                fontSize: "0.85rem",
                fontWeight: 600,
                lineHeight: "1rem",
                padding: "1rem",
                background: isDarkMode ? "#1e1e1e" : "var(--gray-0, #F7F7FD)",
                width: "92%",
                paddingBottom: "5px",
                paddingTop: "3px",
                zIndex: "1",
              }}
            >
              Message
            </Typography>
          ) : null}
          <Box
            sx={{
              position: "relative",
            }}
          >
            {!isChatDesktop ? (
              <Typography
                sx={{
                  color: !isDarkMode ? "#1e1e1e" : "white",
                  fontSize: "0.75rem",
                  fontWeight: 400,
                  lineHeight: "1rem",
                  position: "absolute",
                  left: 12,
                  top: 0,
                  background: isDarkMode ? "#1e1e1e" : "var(--gray-0, #F7F7FD)",
                  width: "92%",
                  paddingBottom: "5px",
                  paddingTop: "5px",
                  zIndex: "1",
                }}
              >
                Message
              </Typography>
            ) : null}
            <Box
              style={{
                width: "100%",
                padding: isChatDesktop ? "14px" : "28px 14px 14px",
                borderRadius: "0.25rem",
                background: isDarkMode ? "#1e1e1e" : "var(--gray-0, #F7F7FD)",
                border: "none",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "1.375rem",
                paddingTop: "10px",
                ...(isChatDesktop
                  ? {
                      display: "flex",
                      justifyContent: "flex-start",
                      height: "120px",
                    }
                  : { height: "70px" }),
                overflowY: "auto",
                overflowX: "hidden",
                color: isDarkMode ? "white" : "var(--black, #212121)",
              }}
              sx={{
                height: "100%",
                "&::-webkit-scrollbar": {
                  width: "0.4em",
                },
                "&::-webkit-scrollbar-track": {
                  background: "white",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#ECECF3",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  background: "#ECECF3",
                },
                "& p": {
                  marginBottom: "0px",
                  fontSize: "14px",
                  lineBreak: "anywhere",
                },
              }}
            >
              {dataTransfer?.message?.attachments?.length > 0 ? (
                <AttachmentContent
                  mediaListPreview={[]}
                  showOnlyContent={true}
                  message={dataTransfer?.message}
                  isCurrentUser={true}
                  isRead={true}
                />
              ) : (
                <div
                  dangerouslySetInnerHTML={{
                    __html: dataTransfer?.message?.msg,
                  }}
                />
              )}
            </Box>
          </Box>
          {dataTransfer?.message?.attachments?.length === 0 ? (
            <Typography
              sx={{
                color: "var(--gray-3, #999)",
                textAlign: "right",
                fontSize: "16px",
                fontWeight: 400,
                lineHeight: "1rem",
              }}
            >
              {dataTransfer?.message?.msg?.length}/2000
            </Typography>
          ) : null}
        </Box>

        {/* <Box
          sx={{
            display: "block",
            width: "100%",
            backgroundColor: isDarkMode
              ? "var(--mui-palette-background-paper)"
              : "white",
          }}
        >
          <Input type="text" fullWidth={true} placeholder={"Message"} />
        </Box> */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: isDarkMode
              ? "var(--mui-palette-background-paper)"
              : "white",
            gap: isChatDesktop ? 0 : 1,
            padding: 2,
          }}
        >
          <Button
            type="button"
            variant="primaryOutlined"
            size="small"
            sx={defaultSx.button}
            onClick={() => {
              if (props?.callbackCancel) {
                props?.callbackCancel();
                return;
              }
              onSetStep(STEP.CHAT_GROUP, dataTransfer);
            }}
          >
            {commonT("form.cancel")}
          </Button>
          <Button
            variant="primary"
            sx={defaultSx.button}
            type="button"
            size="small"
            onClick={handleForwardMessage}
          >
            {commonT("form.forward")}
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default ChatForward;
const defaultSx = {
  button: {
    minWidth: 120,
    mx: 1,
  },
};
