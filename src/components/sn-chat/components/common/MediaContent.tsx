import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import Media from "components/Media";
import Preview, { TitlePreview } from "components/Preview";
import { DataStatus } from "constant/enums";
import { ACCEPT_MEDIA, AN_ERROR_TRY_AGAIN, NS_COMMON } from "constant/index";
import PlayIcon from "icons/PlayIcon";
import { useTranslations } from "next-intl";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { useSnackbar } from "store/app/selectors";
import { MediaType, TypeMedia } from "store/chat/media/typeMedia";
import { useChat } from "store/chat/selectors";
import { copyImage, downloadImage, formatDate } from "utils/index";
export type MediaInfo = MediaType & {
  type: TypeMedia;
};
export type MediaPreview = Partial<MediaInfo> & {
  isPreview: boolean;
};
export const MediaClone = ({
  media,
  listMedia,
}: {
  media: MediaInfo;
  listMedia: MediaInfo[];
}) => {
  const commonT = useTranslations(NS_COMMON);
  const ref = useRef<HTMLVideoElement | HTMLImageElement | null>(null);
  const [isError, setError] = useState<boolean>(false);
  const [mediaPreview, setMediaPreview] = useState<MediaPreview>({
    isPreview: false,
    url: "",
    type: "image_url",
  });
  const { url, type } = media;
  const listMediaClone = useMemo(() => {
    return listMedia.map((item) => {
      return {
        link: item.url || "",
        name: item.name || "",
        object: item.path,
      } as { link: string; name: string; object: string };
    });
  }, [listMedia]);

  const handleChangeSlide = (url) => {
    const info = listMedia.find((item) => item.url === url);
    setMediaPreview((state) => ({ ...info, isPreview: true }));
  };

  const switchMedia = useMemo(() => {
    switch (type) {
      case "image_url": {
        return !isError ? (
          <Media
            size={92}
            src={url}
            loading="lazy"
            style={{
              display: isError ? "none" : "block",
              width: "100%",
              objectFit: "cover",
            }}
            onError={(e) => {
              setError(true);
            }}
            onClick={() =>
              setMediaPreview((state) => ({
                ...state,
                ...media,
                isPreview: true,
              }))
            }
          />
        ) : (
          <Skeleton
            variant="rounded"
            style={{
              width: "100%",
              height: "92px",
            }}
          />
        );
      }
      case "video_url": {
        return (
          <Box
            sx={{
              width: "100%",
              height: "92px",
              position: "relative",
            }}
          >
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
                setMediaPreview((state) => ({
                  ...state,
                  ...media,
                  isPreview: true,
                }))
              }
            />
            {!isError ? (
              <Box
                component="video"
                ref={ref}
                width="100%"
                height={92}
                style={{
                  objectFit: "cover",
                }}
              >
                <source src={url} onError={() => setError(true)} />
              </Box>
            ) : (
              <Skeleton
                variant="rounded"
                style={{
                  width: "92px",
                  height: "92px",
                }}
              />
            )}
          </Box>
        );
      }
      default:
        return (
          <Skeleton
            variant="rounded"
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        );
    }
  }, [type, isError, url, media]);

  const time = useMemo(() => {
    const date = new Date(mediaPreview.uploadedAt as string);
    return formatDate(date, "HH:mm dd/MM/yyyy");
  }, [mediaPreview.uploadedAt]);

  return (
    <>
      {switchMedia}
      {!!(
        mediaPreview?.isPreview &&
        mediaPreview?.url &&
        mediaPreview?.type
      ) ? (
        <Preview
          open={true}
          type={mediaPreview.type || ""}
          listAttachmentsDown={listMediaClone}
          src={mediaPreview.url as string}
          titleProps={{
            children: (
              <TitlePreview
                time={time}
                onClose={() =>
                  setMediaPreview((state) => ({ ...state, isPreview: false }))
                }
                onCopy={() => copyImage(mediaPreview.url || "")}
                onDownloadFile={() =>
                  downloadImage(mediaPreview.url || "", mediaPreview.name || "")
                }
              />
            ),
          }}
          onStartChangeSlide={handleChangeSlide}
        />
      ) : null}
    </>
  );
};

const MediaContent = () => {
  const { mediaList, mediaListStatus, onGetChatAttachments } = useChat();
  const { onAddSnackbar } = useSnackbar();
  const commonT = useTranslations(NS_COMMON);

  useEffect(() => {
    const handleGetAttachment = async () => {
      try {
        await onGetChatAttachments({ fileType: "media" });
      } catch (error) {
        onAddSnackbar(
          typeof error === "string" ? error : commonT(AN_ERROR_TRY_AGAIN),
          "error",
        );
      }
    };
    handleGetAttachment();
  }, [onAddSnackbar, onGetChatAttachments, commonT]);

  const mediaClone = useMemo<MediaInfo[]>(() => {
    const acceptType = ACCEPT_MEDIA.map((item) => item.split("/")?.[1]);
    return mediaList
      ?.filter((file) => {
        const typeByNameFile = file.name.split(".")?.[1];
        return file.url && acceptType.includes(typeByNameFile);
      })
      .map((item) => {
        if (item.url.indexOf("mp4") > -1) {
          return {
            ...item,
            type: "video_url" as TypeMedia,
          };
        } else {
          return {
            ...item,
            type: "image_url" as TypeMedia,
          };
        }
      });
  }, [mediaList]);

  if (
    mediaListStatus === DataStatus.LOADING ||
    mediaListStatus === DataStatus.FAILED
  ) {
    return <Typography textAlign="center">Loading...</Typography>;
  }

  return mediaClone?.length > 0 ? (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "4px",
        overflow: "auto",
        margin: "0 4px",
        paddingRight: "0.2rem",
        paddingBottom: ".5rem",
        maxHeight: "100%",
      }}
    >
      {mediaClone?.map((item, index) => (
        <MediaClone
          key={index}
          media={item}
          listMedia={mediaClone}
        />
      ))}
    </Box>
  ) : (
    <Typography textAlign="center">{commonT("noData")}</Typography>
  );
};

export default MediaContent;
