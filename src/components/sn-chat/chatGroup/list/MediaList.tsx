import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import Media from "components/Media";
import Preview from "components/Preview";
import { DataStatus } from "constant/enums";
import { NS_COMMON } from "constant/index";
import PlayIcon from "icons/PlayIcon";
import { useTranslations } from "next-intl";
import { useMemo, useRef, useState } from "react";
import { IChatFile, TypeMedia } from "store/chat/media/typeMedia";
import { useChat } from "store/chat/selectors";
import { IMAGES_EXTENSION } from "store/chat/type";

export const MediaClone = ({
  src,
  attachment,
  listMedia,
}: {
  src: string;
  attachment: IChatFile;
  listMedia: IChatFile[];
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
    const fileExtension = attachment?.type?.split("/")[1];
    if (IMAGES_EXTENSION.includes(fileExtension)) {
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
              type: "image_url",
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
  }, [isError, src]);

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
  const { chatMedias, chatMediasStatus } = useChat();
  const commonT = useTranslations(NS_COMMON);

  if (chatMediasStatus !== DataStatus.SUCCEEDED) {
    return <Typography textAlign="center">Loading...</Typography>;
  }

  return chatMedias?.length > 0 ? (
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
      {chatMedias?.map((item, index) => (
        <MediaClone
          key={index}
          src={item.url}
          attachment={item}
          listMedia={chatMedias}
        />
      ))}
    </Box>
  ) : (
    <Typography textAlign="center">{commonT("noData")}</Typography>
  );
};

export default MediaList;
