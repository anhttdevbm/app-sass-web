import { SxProps } from "@mui/material";
import Box, { BoxProps } from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Typography, { TypographyProps } from "@mui/material/Typography";
import Avatar from "components/Avatar";
import ArrowDownIcon from "icons/ArrowDownIcon";
import ProfileAdd from "icons/ProfileAdd";
import SearchIcon from "icons/SearchIcon";
import SearchRoundIcon from "icons/SearchRoundIcon";
import VideoCallIcon from "icons/VideoCallIcon";
import { useCallback, useEffect, useState } from "react";

import { useChat } from "store/chat/selectors";
import { useTranslations } from "next-intl";
import { NS_COMMON } from "constant/index";
import { useAuth, useSnackbar } from "store/app/selectors";
import { STEP } from "store/chat/type";
import InfoUserIcon from "icons/InfoUserIcon";

import DialogLayout from "components/DialogLayout";
import { useMeeting } from "store/meeting/selectors";
import { usePathname, useRouter } from "next/navigation";
import { clientStorage } from "utils/storage";

interface ProfileHeaderProps {
  textSearch?: string;
  isSearch?: boolean;
  avatar?: { url: string | undefined; isShow: boolean };
  name: string;
  statusOnline?: string;
  containerProps?: BoxProps;
  nameProps?: TypographyProps;
  onPrevious: () => void;
  onShowProfile?: () => void;
  onSearch?: (text: string, isSearch: boolean) => void;
  onChangeText?: (text: string) => void;
}
const ProfileHeader = ({
  textSearch,
  isSearch,
  avatar,
  name,
  statusOnline,
  containerProps,
  nameProps,
  onPrevious,
  onShowProfile,
  onSearch,
  onChangeText,
}: ProfileHeaderProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [openSearch, setOpenSearch] = useState(false);
  const [avatarClone, setAvatarClone] = useState<string | undefined>(
    avatar?.url,
  );
  const { sx: containerSx, ...containerProp } = containerProps || {};
  const { sx: nameSx, ...nameProp } = nameProps || {};

  const {
    dataTransfer,
    onSetRoomId,
    onSetStep,
    onCreateDirectMessageGroup,
    onSetDataTransfer,
    onSetConversationInfo,
  } = useChat();
  const commonT = useTranslations(NS_COMMON);

  const { user } = useAuth();
  const { onStartMeeting } = useMeeting();
  const { onAddSnackbar } = useSnackbar();

  // const handleCreateGroup = async () => {
  //   const result = await onCreateDirectMessageGroup({
  //     groupName: (() => {
  //       return `${dataTransfer?.username?.slice(0, 8)}...-and-me...${Math.floor(
  //         Math.random() * (9999 - 1 + 1) + 1,
  //       )}`;
  //     })(),
  //     members: [dataTransfer?.username],
  //     type: "d",
  //   });
  //   onSetRoomId(result.payload.group._id);
  //   onSetDataTransfer(result.payload.group);
  //   onSetConversationInfo(result.payload.group);
  //   onAddSnackbar(commonT("success"), "success");
  //   onSetStep(STEP.CHAT_GROUP, result?.payload?.group);
  // };

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Enter") {
        onSearch?.(event.target.value, true);
      }
    },
    [onSearch],
  );

  const handleGoPrevious = () => {
    if (openSearch && onSearch) {
      setOpenSearch(false);
      onSearch("", false);
    } else {
      onPrevious();
    }
  };

  const startMeeting = async () => {
    await onStartMeeting(dataTransfer.id).then((res: any) => {
      if (pathname.includes("/meeting")) return;
      router.push(`meeting/${res?.payload?.meetInfo.room.id}`);
    });
  };

  useEffect(() => {
    setOpenSearch(isSearch || false);
    return () => {
      setOpenSearch(false);
    };
  }, [isSearch]);

  const groupButton = useCallback(() => {
    return (
      <>
        {/* {onSearch && (
          <IconButton onClick={() => setOpenSearch(true)}>
            <SearchIcon
              sx={{
                color: "#1BC5BD",
              }}
            />
          </IconButton>
        )} */}

        <Box display="flex" width="100px" justifyContent="space-around">
          {onSearch && (
            <IconButton onClick={() => setOpenSearch(true)}>
              <SearchIcon
                sx={{
                  color: "#FFFFFF",
                }}
              />
            </IconButton>
          )}
          <IconButton
            onClick={() => {
              onSetStep(STEP.ADD_GROUP, {
                isNew: true,
                currentSelects: dataTransfer,
              });
            }}
            sx={{
              color: "white",
              padding: "6px",
            }}
          >
            <ProfileAdd />
          </IconButton>
          <IconButton
            onClick={startMeeting}
            sx={{
              color: "white",
              padding: "6px",
            }}
            className="call-button"
          >
            <VideoCallIcon />
          </IconButton>

          {onShowProfile && (
            <IconButton
              onClick={onShowProfile}
              sx={{
                color: "white",
                padding: "6px",
              }}
            >
              <InfoUserIcon />
            </IconButton>
          )}
        </Box>
      </>
    );
  }, [onSearch]);

  const groupUserProfile = useCallback(() => {
    if (!openSearch) {
      return (
        <>
          {avatar?.isShow && (
            <Box
              position="relative"
              display="flex"
              sx={{
                "&::before": {
                  content: `''`,
                  position: "absolute",
                  right: "-2px",
                  bottom: "-2px",
                  width: "14px",
                  height: "14px",
                  border: "2px solid #ffffff",
                  backgroundColor: "#55C000",
                  borderRadius: "50%",
                  visibility: statusOnline === "online" ? "visible" : "hidden",
                },
              }}
            >
              <Avatar
                alt="Avatar"
                src={avatarClone}
                size={40}
                onError={() => setAvatarClone(undefined)}
              />
            </Box>
          )}

          <Box
            width="180px"
            height="40px"
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              marginLeft: "4px",
              maxHeight: "40px",
            }}
          >
            {onShowProfile ? (
              <Typography
                variant="inherit"
                fontWeight="bold"
                onClick={onShowProfile}
                sx={{
                  cursor: "pointer",
                  ...nameSx,
                }}
                {...nameProp}
              >
                {name}
              </Typography>
            ) : (
              <Typography
                variant="inherit"
                fontWeight="bold"
                sx={{
                  ...nameSx,
                  left: 0,
                  transform: "none",
                  WebkitLineClamp: 1,
                  position: "unset",
                }}
                {...nameProp}
              >
                {name}
              </Typography>
            )}
            {statusOnline && (
              <Typography
                variant="caption"
                color="#FFFFFF"
                fontSize="14px"
                lineHeight="22px"
              >
                {statusOnline}
              </Typography>
            )}
          </Box>

          <Box ml="auto">{groupButton()}</Box>
        </>
      );
    } else {
      return (
        <>
          <TextField
            autoFocus
            size="small"
            fullWidth
            sx={{
              "& .MuiInputBase-root": {
                pl: "10px",
                borderRadius: "8px",
                fontSize: "14px",
                backgroundColor: "#F7F7FD",
                "& fieldset": {
                  border: "unset",
                },
              },
            }}
            inputProps={{
              style: {
                paddingLeft: "5px",
              },
            }}
            InputProps={{
              startAdornment: (
                <SearchRoundIcon
                  sx={{
                    fill: "none",
                    filter: "opacity(0.8)",
                    height: "24px",
                    width: "24px",
                  }}
                />
              ),
            }}
            value={textSearch}
            placeholder="Search in conversation"
            onKeyDown={handleKeyDown}
            onChange={(e) => onChangeText?.(e.target.value)}
          />
          <Button
            onClick={() => {
              setOpenSearch(false);
              onSearch?.("", false);
            }}
            sx={{
              marginLeft: "0.3rem",
              color: "white",
            }}
          >
            Cancel
          </Button>
        </>
      );
    }
  }, [
    avatar,
    avatarClone,
    groupButton,
    handleKeyDown,
    name,
    nameProp,
    nameSx,
    onChangeText,
    onSearch,
    onShowProfile,
    openSearch,
    statusOnline,
    textSearch,
  ]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "16px 16px 16px 4px",
          borderBottom: "1px solid #ECECF3",
          backgroundColor: "#3699FF",
          color: "#FFFFFF",
          ...containerSx,
        }}
        {...containerProp}
      >
        <IconButton
          sx={{
            cursor: "pointer",
          }}
          onClick={handleGoPrevious}
        >
          <ArrowDownIcon
            sx={{
              fontSize: "24px",
              color: "#FFFFFF",
            }}
          />
        </IconButton>
        {groupUserProfile()}
      </Box>
    </>
  );
};

export default ProfileHeader;
