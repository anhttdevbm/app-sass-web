/* eslint-disable @typescript-eslint/no-explicit-any */
import { ImageList, InputAdornment, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Avatar from "components/Avatar";
import { NS_CHAT_BOX, NS_COMMON } from "constant/index";
import ArrowDownIcon from "icons/ArrowDownIcon";
import ArrowRightIcon from "icons/ArrowRightIcon";
import CloseIcon from "icons/CloseIcon";
import InfoUserIcon from "icons/InfoUserIcon";
import PointOnline from "icons/pointOnline";
import ProfileAdd from "icons/ProfileAdd";
import SearchIcon from "icons/SearchIcon";
import VideoCallIcon from "icons/VideoCallIcon";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useState } from "react";
import { useChat } from "store/chat/selectors";
import { IChatItemInfo, STEP } from "store/chat/type";
import { useMeeting } from "store/meeting/selectors";

interface AccountInfoHeaderProp {
  accountInfo: IChatItemInfo;
  onPrevious: () => void;
  viewStep?: STEP;
}
const AccountInfoHeader = ({
  accountInfo,
  onPrevious,
  viewStep,
}: AccountInfoHeaderProp) => {
  const pathname = usePathname();
  const router = useRouter();
  const { dataTransfer, onSetStep, prevStep, currStep } = useChat();
  const { usersCount, t, name } = accountInfo;
  const isGroup = useMemo(() => t !== "d", [t]);

  const [textSearch, setTextSearch] = useState("");
  const commonChatBox = useTranslations(NS_CHAT_BOX);
  const [avatar, setAvatar] = useState<string | undefined>(
    dataTransfer?.avatar,
  );

  const startGroupMeet = async () => {
    if (pathname.includes("/meeting")) return;
    window.open(
      `/meeting/${dataTransfer.id}`,
      "_blank",
      "width=800,height=600",
    );
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      setTextSearch(event.target.value);
    }
  };

  useEffect(() => {
    setAvatar(dataTransfer?.avatar);
  }, [dataTransfer?.avatar]);

  const _renderChatGroup = () => {
    if (isGroup) {
      return (
        <>
          <div
            onClick={() => {
              onSetStep(STEP.CHAT_DETAIL_GROUP);
            }}
            style={{ position: "relative", cursor: "pointer" }}
          >
            {avatar ? (
              <>
                <Avatar
                  alt="Avatar"
                  size={40}
                  src={avatar || undefined}
                  onError={() => setAvatar(undefined)}
                />
                <IconButton
                  style={{
                    width: 5,
                    height: 5,
                    position: "absolute",
                    right: 2,
                    bottom: 0,
                    cursor: "unset",
                  }}
                >
                  <PointOnline />
                </IconButton>
              </>
            ) : (
              <>
                <ImageList
                  sx={{
                    width: 50,
                    height: 50,
                    margin: 0,
                    position: "relative",
                  }}
                >
                  {[...dataTransfer?.members]
                    ?.sort((a, b) => a?.avatar?.localeCompare(b?.avatar))
                    ?.slice(0, 3)
                    ?.map((mem, idx) => (
                      <Avatar
                        key={mem?.id}
                        alt="Avatar"
                        size={36}
                        style={{
                          border: "4px solid ",
                          borderColor: "background.default",
                          borderRadius: "50%",
                          position: "absolute",
                          bottom: `${idx * 7}px`,
                          left: `${idx * 7}px`,
                        }}
                        src={mem?.avatar || undefined}
                      />
                    ))}

                  {/* Show how many members in group
                
                  {usersCount - 3 > 0 ? (
                  <Box
                    sx={{
                      textAlign: "center",
                      borderRadius: "5px",
                      backgroundColor: "#3078F1",
                      color: "white",
                    }}
                  >
                    <Typography variant="caption">
                      + {usersCount - 3}
                    </Typography>
                  </Box>
                ) : null} */}
                </ImageList>
                <IconButton
                  style={{
                    width: 5,
                    height: 5,
                    position: "absolute",
                    right: 12,
                    bottom: -6,
                    cursor: "unset",
                  }}
                >
                  <PointOnline />
                </IconButton>
              </>
            )}
          </div>
          <Box
            onClick={() => {
              onSetStep(STEP.CHAT_DETAIL_GROUP);
            }}
            sx={{
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              color: "white",
            }}
          >
            <Typography
              variant="inherit"
              fontWeight="bold"
              style={{ cursor: "pointer", WebkitLineClamp: 1 }}
            >
              {dataTransfer?.fname
                ? dataTransfer?.fname?.replaceAll("_", " ")
                : dataTransfer?.name
                ? dataTransfer?.name?.replaceAll("_", " ")
                : name}
            </Typography>
            <Typography variant="caption">
              {commonChatBox("chatBox.active")}
            </Typography>
          </Box>
        </>
      );
    }
  };

  const _renderItemHeader = (viewStep) => {
    switch (viewStep) {
      case STEP.CHAT_GROUP:
        return <>{_renderChatGroup()}</>;
      case STEP.CHAT_DETAIL_GROUP:
        return (
          <>
            <Box
              sx={{
                maxWidth: "180px",
                fontSize: "16px",
                fontWeight: 600,
                color: "white",
                textAlign: "left",
                flex: 1,
              }}
            >
              {dataTransfer?.name?.replaceAll("_", " ")}
            </Box>
          </>
        );
      case STEP.LIST:
        return (
          <>
            <Box
              sx={{
                fontSize: "16px",
                fontWeight: 600,
                color: "white",
                textAlign: "center",
                flex: 1,
              }}
            >
              {dataTransfer?.name}
            </Box>
          </>
        );
      default:
        break;
    }
  };

  const _renderHeaderForward = () => {
    return (
      <>
        <Box sx={{ padding: 3, borderBottom: "1px solid #ECECF3" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography
              sx={{
                color: "var(--black, #212121)",
                fontSize: "1rem",
                fontWeight: 600,
                paddingBottom: 2,
              }}
            >
              Forward message
            </Typography>
            <IconButton
              onClick={() => {
                onSetStep(STEP.CHAT_GROUP, dataTransfer);
              }}
              sx={{
                width: "26px",
                height: "26px",
              }}
            >
              <CloseIcon sx={{ width: "20px", height: "20px" }} />
            </IconButton>
          </Box>
          <TextField
            size="small"
            sx={{
              backgroundColor: "var(--gray-0, #F7F7FD)",
              borderRadius: "10px",
              "& .MuiInputBase-root": {
                color: "black",
                borderRadius: "10px",
              },
              "& fieldset": { border: "none" },
            }}
            placeholder="Search"
            fullWidth
            onKeyDown={handleKeyDown}
            InputProps={{
              disableUnderline: true, // <== added this
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    sx={{
                      color: "#999999",
                      fontSize: "24px",
                    }}
                  />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </>
    );
  };

  const _renderHeader = (viewStep) => {
    switch (viewStep) {
      case STEP.CHAT_FORWARD:
        return <>{_renderHeaderForward()}</>;
      default:
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "3px",
              padding: 1,
              borderBottom: "1px solid #ECECF3",
              backgroundColor: "#3699FF",
              height: "72px",
            }}
          >
            <IconButton
              sx={{
                cursor: "pointer",
                color: "#FFFFFF",
                padding: "0px!important",
              }}
              onClick={onPrevious}
            >
              <ArrowDownIcon />
            </IconButton>
            {_renderItemHeader(viewStep)}

            <Box ml="auto" display="flex">
              {viewStep == STEP.CHAT_DETAIL_GROUP && (
                <IconButton>
                  <SearchIcon
                    sx={{
                      color: "#FFFFFF",
                    }}
                    onClick={() => {
                      onSetStep(STEP.SEARCH_CHAT_TEXT);
                    }}
                  />
                </IconButton>
              )}
              <IconButton
                sx={{
                  color: "white",
                  padding: "6px",
                }}
                onClick={() => {
                  onSetStep(STEP.ADD_MEMBER, {
                    ...dataTransfer,
                    openFrom: currStep,
                  });
                }}
              >
                <ProfileAdd />
              </IconButton>
              <IconButton
                sx={{
                  color: "white",
                  padding: "6px",
                }}
                onClick={startGroupMeet}
              >
                <VideoCallIcon />
              </IconButton>

              {viewStep != STEP.CHAT_DETAIL_GROUP && viewStep != STEP.LIST && (
                <IconButton
                  onClick={() => {
                    onSetStep(STEP.CHAT_DETAIL_GROUP);
                  }}
                  sx={{
                    color: "white",
                    padding: "6px",
                  }}
                >
                  <InfoUserIcon />
                </IconButton>
              )}
            </Box>
          </Box>
        );
    }
  };

  return <>{_renderHeader(viewStep)}</>;
};

export default AccountInfoHeader;
