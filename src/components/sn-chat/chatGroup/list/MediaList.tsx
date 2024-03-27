import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import Media from "components/Media";
import Preview from "components/Preview";
import { DataStatus } from "constant/enums";
import { ACCEPT_MEDIA, AN_ERROR_TRY_AGAIN, NS_COMMON } from "constant/index";
import PlayIcon from "icons/PlayIcon";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSnackbar } from "store/app/selectors";
import { MediaType, TypeMedia } from "store/chat/media/typeMedia";
import { useChat } from "store/chat/selectors";
export interface MediaPreview extends Partial<MediaType> {
  link: string;
  object: string;
}
export const MediaClone = ({
  src,
  type,
  listMedia,
}: {
  src: string;
  type: TypeMedia;
  listMedia: MediaPreview[];
}) => {
  const ref = useRef<HTMLVideoElement | HTMLImageElement | null>(null);
  const [isError, setError] = useState<boolean>(false);
  const [mediaPreview, setMediaPreview] = useState<{
    isPreview;
    src: string;
    type: TypeMedia;
  }>({ isPreview: false, src: "", type: "image_url" });
  const listMediaClone = useMemo(() => {
    return listMedia.map((item) => {
      return {
        link: item.url || "",
        name: item.name || "",
        object: item.object,
      } as { link: string; name: string; object: string };
    });
  }, [listMedia]);

  const switchMedia = useMemo(() => {
    switch (type) {
      case "image_url": {
        return !isError ? (
          <Media
            size={92}
            src={src}
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
                isPreview: true,
                src: src,
                type: type,
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
                  isPreview: true,
                  src: src,
                  type: "video_url",
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
                <source src={src} onError={() => setError(true)} />
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
  }, [isError, src, type]);

  return (
    <>
      {switchMedia}
      {Boolean(
        mediaPreview?.isPreview && mediaPreview?.src && mediaPreview?.type,
      ) && (
        <Preview
          open={true}
          type={mediaPreview.type || ""}
          listAttachmentsDown={listMediaClone}
          onClose={() =>
            setMediaPreview((state) => ({ ...state, isPreview: false }))
          }
          src={mediaPreview.src as string}
        />
      )}
    </>
  );
};

const MediaList = () => {
  const { mediaList, mediaListStatus, onGetChatAttachments, dataTransfer } = useChat();
  const { onAddSnackbar } = useSnackbar();
  const commonT = useTranslations(NS_COMMON);

  useEffect(() => {
    const handleGetAttachment = async () => {
      try {
        await onGetChatAttachments({ 
          fileType: "media" ,
          roomId: dataTransfer?._id,
      roomType: "p",
      });
      } catch (error) {
        onAddSnackbar(
          typeof error === "string" ? error : commonT(AN_ERROR_TRY_AGAIN),
          "error",
        );
      }
    };
    handleGetAttachment();
  }, [onAddSnackbar, onGetChatAttachments, commonT]);

  const mediaClone = useMemo(() => {
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
          src={item.url}
          type={item.type}
          listMedia={mediaClone as unknown as MediaPreview[]}
        />
      ))}
    </Box>
  ) : (
    <Typography textAlign="center">{commonT("noData")}</Typography>
  );
};

export default MediaList;

