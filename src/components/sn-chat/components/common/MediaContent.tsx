import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import Media from "components/Media";
import Preview, { TitlePreview } from "components/Preview";
import { DataStatus } from "constant/enums";
import { NS_COMMON } from "constant/index";
import PlayIcon from "icons/PlayIcon";
import { useTranslations } from "next-intl";
import { useMemo, useRef, useState } from "react";
import { IChatFile } from "store/chat/media/typeMedia";
import { useChat } from "store/chat/selectors";
import { copyImage, downloadImage, formatDate } from "utils/index";
import { IMAGES_EXTENSION } from "store/chat/type";

export const MediaClone = ({
  media,
  listMedia,
}: {
  media: IChatFile;
  listMedia: IChatFile[];
}) => {
  const commonT = useTranslations(NS_COMMON);
  const ref = useRef<HTMLVideoElement | HTMLImageElement | null>(null);
  const [isError, setError] = useState<boolean>(false);
  const [mediaPreview, setMediaPreview] = useState<any>({
    isPreview: false,
    url: "",
    name: "",
    type: "",
  });
  const { url, type } = media;
  const listMediaClone = useMemo(() => {
    return listMedia.map((item) => {
      return {
        link: item.url || "",
        name: item.name || "",
        object: item.object,
      } as { link: string; name: string; object: string };
    });
  }, [listMedia]);

  const handleChangeSlide = (url) => {
    const info = listMedia.find((item) => item.url === url);
    setMediaPreview((state) => ({ ...info, isPreview: true }));
  };

  const switchMedia = useMemo(() => {
    const fileExtension = type?.split("/")[1];
    if (IMAGES_EXTENSION.includes(fileExtension)) {
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
  }, [type, isError, url, media]);

  const time = useMemo(() => {
    const date = new Date(media?.created_at as string);
    return formatDate(date, "HH:mm dd/MM/yyyy");
  }, [media?.created_at]);

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
        <MediaClone key={index} media={item} listMedia={chatMedias} />
      ))}
    </Box>
  ) : (
    <Typography textAlign="center">{commonT("noData")}</Typography>
  );
};

export default MediaContent;
