import Box, { BoxProps } from "@mui/material/Box";
import SvgIcon from "@mui/material/SvgIcon";
import Avatar from "components/Avatar";
import Link from "components/Link";
import Preview, { TitlePreview } from "components/Preview";
import { FILE_MAP } from "constant/enums";
import { mapType } from "constant/index";
import FileCsvIcon from "icons/FileCsvIcon";
import FileDocIcon from "icons/FileDocIcon";
import FileExcelIcon from "icons/FileExcelIcon";
import FilePdfIcon from "icons/FilePdfIcon";
import PlayIcon from "icons/PlayIcon";
import { useMemo, useRef, useState } from "react";
import { TypeMedia } from "store/chat/media/typeMedia";
import { MediaPreviewItem, MESSAGE_TYPE, MessageInfoV2 } from "store/chat/type";
import { TimeMessage } from "../messages/MessageContent";
import useTheme from "hooks/useTheme";
import { copyImage, downloadImage, formatDate } from "utils/index";

interface MediaPreview {
  isPreview;
  src: string;
  type: TypeMedia;
  ts: string;
  name: string;
}

const IconFile = {
  [FILE_MAP.DOC]: FileDocIcon,
  [FILE_MAP.EXCEL]: FileExcelIcon,
  [FILE_MAP.PDF]: FilePdfIcon,
  [FILE_MAP.CSV]: FileCsvIcon,
};

const AttachmentContent = ({
  message,
  mediaListPreview,
  isCurrentUser,
  isRead,
  attachmentProps,
  showOnlyContent,
}: {
  message: MessageInfoV2;
  mediaListPreview: MediaPreviewItem[];
  isCurrentUser: boolean;
  isRead: boolean;
  attachmentProps?: BoxProps;
  showOnlyContent?: boolean;
}) => {
  const { sx, ...props } = attachmentProps || {};

  const styleForFile = (title: string) => {
    const type = title?.split("/")[1];
    for (const [key, value] of Object.entries(mapType)) {
      if (value.includes(type)) return IconFile[key];
    }
  };
  const ref = useRef<HTMLVideoElement | HTMLImageElement | null>(null);
  const [mediaPreview, setMediaPreview] = useState<Partial<MediaPreview>>({
    isPreview: false,
  });

  const files = useMemo(() => {
    return message?.files.map((item) => {
      return {
        title: item.name,
        title_link: item.url,
        title_link_download: item.url,
      };
    });
  }, [message]);

  const { isDarkMode } = useTheme();

  const renderBackgroundColor = useMemo(() => {
    if (isCurrentUser) {
      if (isDarkMode) return "#333333";
      return "#EBF5FF";
    }
    return isDarkMode ? "#3a3b3c" : "#F7F7FD";
  }, [isCurrentUser, isDarkMode]);

  const forceUpdatePreview = (data: {
    isPreview: boolean;
    src: string;
    type: TypeMedia;
    ts: string;
    name: string;
  }) => {
    const date = new Date(data.ts as string);
    const time = formatDate(date, "HH:mm dd/MM/yyyy");
    setMediaPreview({ ...data, ts: time });
  };

  const handleChangeSlide = (url) => {
    const info = mediaListPreview.find((item) => item.link === url);
    forceUpdatePreview({
      src: info?.link as string,
      type: info?.type as TypeMedia,
      ts: info?.ts as string,
      name: info?.name as string,
      isPreview: true,
    });
  };

  const IMAGES_EXTENSION = ["png", "jpeg", "jpg", "ico", "gif"];

  return (
    <>
      {
        <Box
          sx={{
            marginTop: "17px",
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "flex-end",
            gap: "0.2rem",
            maxWidth: "232px",
            ...sx,
          }}
          {...props}
        >
          {message?.type === MESSAGE_TYPE.MEDIA && message?.files?.length && (
            <>
              {message?.files?.map((file, index) => {
                const fileExtension = file?.type?.split("/")[1];
                if (IMAGES_EXTENSION.includes(fileExtension)) {
                  return (
                    <Box position="relative" key={index} height={112}>
                      <Avatar
                        size={112}
                        src={file?.url}
                        style={{
                          borderRadius: "8px",
                          border: "1px solid #efefef",
                          objectFit: "cover",
                        }}
                        onClick={() =>
                          forceUpdatePreview({
                            ts: file?.created_at as string,
                            isPreview: true,
                            src: file?.url || "",
                            type: "image_url",
                            name: file?.name as string,
                          })
                        }
                      />
                      {showOnlyContent ? (
                        ""
                      ) : (
                        <TimeMessage
                          time={message.created_at}
                          isRead={isRead}
                          isCurrentUser={isCurrentUser}
                          timeMessageProps={{
                            sx: {
                              position: "absolute",
                              bottom: ".4rem",
                              right: ".3rem",
                              gap: "0.2rem",
                              padding: "0 6px",
                              borderRadius: "15px",
                              backgroundColor: "#00000080",
                            },
                          }}
                        />
                      )}
                    </Box>
                  );
                }
                return (
                  <Box position="relative" key={index} height={112}>
                    <>
                      <PlayIcon
                        sx={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          cursor: "pointer",
                          color: "common.white",
                          fontSize: 24,
                          zIndex: 1,
                          backgroundColor: "#FFFFFF4D",
                          borderRadius: "50px",
                          width: "30px",
                          height: "30px",
                        }}
                        onClick={() =>
                          forceUpdatePreview({
                            ts: file?.created_at as string,
                            isPreview: true,
                            src: file?.url || "",
                            type: "video_url",
                            name: file?.name as string,
                          })
                        }
                      />
                      <Box
                        component="video"
                        ref={ref}
                        width={112}
                        height={112}
                        sx={{ objectFit: "cover", borderRadius: "8px" }}
                      >
                        <source src={file?.url} />
                      </Box>
                    </>
                    {showOnlyContent ? (
                      ""
                    ) : (
                      <TimeMessage
                        time={message.created_at}
                        isRead={isRead}
                        isCurrentUser={isCurrentUser}
                        timeMessageProps={{
                          sx: {
                            position: "absolute",
                            bottom: ".4rem",
                            right: ".3rem",
                            gap: "0.2rem",
                            padding: "0 6px",
                            borderRadius: "15px",
                            backgroundColor: "#00000080",
                          },
                        }}
                      />
                    )}
                  </Box>
                );
              })}
            </>
          )}

          {message?.type === MESSAGE_TYPE.FILE && files?.length && (
            <Box
              display="flex"
              flexDirection="column"
              gap="0.5rem"
              alignItems={isCurrentUser ? "flex-end" : "flex-start"}
            >
              {files.map((file, index) => {
                const Icon = styleForFile(file?.title || "");
                return (
                  <Box
                    position="relative"
                    display="flex"
                    flexDirection="column"
                    alignItems="flex-end"
                    key={index}
                    sx={{
                      backgroundColor: renderBackgroundColor,
                      padding: "0.5rem 1rem",
                      borderRadius: "20px",
                    }}
                  >
                    <Box display="flex" alignItems="center">
                      <SvgIcon
                        component={Icon}
                        sx={{
                          fontSize: "35px",
                        }}
                      />
                      <Link
                        href={file?.title_link || ""}
                        target="_blank"
                        sx={{
                          color: isCurrentUser ? "#3699FF" : "black",
                          overflowWrap: "anywhere",
                          fontWeight: 600,
                          textDecoration: "auto",
                        }}
                      >
                        {file?.title}
                      </Link>
                    </Box>
                    {showOnlyContent ? (
                      ""
                    ) : (
                      <TimeMessage
                        time={message.created_at}
                        isRead={isRead}
                        isCurrentUser={isCurrentUser}
                      />
                    )}
                  </Box>
                );
              })}
            </Box>
          )}
        </Box>
      }

      {!!(
        mediaPreview?.isPreview &&
        mediaPreview?.src &&
        mediaPreview?.type
      ) ? (
        <Preview
          open={true}
          type={mediaPreview.type as string}
          src={mediaPreview.src as string}
          listAttachmentsDown={mediaListPreview}
          onClose={() =>
            setMediaPreview((state) => ({ ...state, isPreview: false }))
          }
          onStartChangeSlide={handleChangeSlide}
          titleProps={{
            children: (
              <TitlePreview
                time={mediaPreview.ts as string}
                onClose={() =>
                  setMediaPreview((state) => ({ ...state, isPreview: false }))
                }
                onCopy={() => copyImage(mediaPreview.src || "")}
                onDownloadFile={() =>
                  downloadImage(mediaPreview.src || "", mediaPreview.name || "")
                }
              />
            ),
          }}
        />
      ) : null}
    </>
  );
};

export default AttachmentContent;
