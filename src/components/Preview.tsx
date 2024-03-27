import React, { memo } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  DialogProps,
  DialogTitle,
  DialogTitleProps,
  backdropClasses,
  dialogClasses,
} from "@mui/material";
import { Text } from "./shared";
import { useTranslations } from "next-intl";
import { NS_COMMON } from "constant/index";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import CopyWhiteIcon from "icons/CopyWhiteIcon";
import RedoIcon from "icons/RedoIcon";
import DownloadIcon from "icons/DownloadIcon";

const IMAGES_EXTENSION = ["png", "jpeg", "jpg", "ico", "gif"];
const VIDEOS_EXTENSION = ["mp4", "mov", "wmv", "flv", "avi", "webm", "mkv"];
interface Attachment {
  link: string;
  name: string;
  object: string;
}

type PreviewProps = {
  type: string;
  src: string;
  listData?: Attachment[];
  listAttachmentsDown?: Attachment[];
  titleProps?: DialogTitleProps;
  onStartChangeSlide?: (id: string | undefined) => void;
} & Omit<DialogProps, "children">;

export const TitlePreview = ({
  time,
  onClose,
  onCopy,
  onDownloadFile,
}: {
  time: string;
  onCopy: () => void;
  onDownloadFile: () => void;
  onClose: () => void;
}) => {
  const commonT = useTranslations(NS_COMMON);
  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      width="100%"
      sx={{
        "& .MuiTypography-root": {
          color: "white",
        },
      }}
    >
      <Text variant="caption" fontSize="14px" lineHeight="22px">
        {time}
      </Text>
      <Box display="flex" gap="3rem">
        <Text
          display="inline-flex"
          gap="0.3rem"
          sx={{
            cursor: "pointer",
          }}
          onClick={onCopy}
        >
          <CopyWhiteIcon color="inherit" />
          Copy
        </Text>
        {/* <Text
          display="inline-flex"
          gap="0.3rem"
          sx={{
            cursor: "pointer",
          }}
        >
          <RedoIcon color="inherit" />
          Forward
        </Text> */}
        <Text
          display="inline-flex"
          gap="0.3rem"
          sx={{
            cursor: "pointer",
          }}
          onClick={onDownloadFile}
        >
          <DownloadIcon color="inherit" />
          Download
        </Text>
      </Box>
      <Text variant="h6" onClick={onClose} sx={{ cursor: "pointer" }}>
        {commonT("close")}
      </Text>
    </Box>
  );
};
const Preview = (props: PreviewProps) => {
  const {
    type,
    src,
    listData,
    listAttachmentsDown,
    titleProps,
    onStartChangeSlide,
    ...rest
  } = props;
  const {
    sx: titleSx,
    children: titleChildren,
    ...titleProp
  } = titleProps || {};
  const commonT = useTranslations(NS_COMMON);

  const onClose = () => {
    props?.onClose && props.onClose({}, "escapeKeyDown");
  };

  const getExtension = (name: String) => {
    if (!name) return;
    const arr = name.split(".");
    const extension = arr[arr.length - 1];
    if (IMAGES_EXTENSION.includes(extension)) return `image/${extension}`;
    if (VIDEOS_EXTENSION.includes(extension)) return `video/${extension}`;
  };

  const filterAttachment = (listData?: Attachment[]) => {
    if (!listData) return [];
    return listData.filter((data) => {
      const extension = getExtension(data?.name);
      return extension?.startsWith("image") || extension?.startsWith("video");
    });
  };

  const indexSlide = filterAttachment(listAttachmentsDown)?.findIndex(
    (el) => el.link == src,
  );

  const handleChangeSlide = (_, to) => {
    const idAsUrl = listAttachmentsDown?.[to].link;
    onStartChangeSlide?.(idAsUrl);
  };

  return (
    <Dialog
      sx={{
        [`& .${backdropClasses.root}`]: {},
        [`& .${dialogClasses.paper}`]: {
          backgroundColor: "rgba(153, 153, 153, 0.90)",
          width: "100vw",
          m: 0,
          height: "100%",
          maxWidth: "100vw",
          maxHeight: "calc(var(--vh, 1vh) * 100)",
        },
      }}
      {...rest}
    >
      <DialogTitle
        id="scroll-dialog-title"
        component="div"
        position="relative"
        sx={{
          backgroundColor: "#666666",
          height: 72,
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          ...titleSx,
        }}
        {...titleProp}
      >
        {titleChildren ?? (
          <Text
            variant="h6"
            onClick={onClose}
            color="common.white"
            sx={{ cursor: "pointer" }}
          >
            {commonT("close")}
          </Text>
        )}
      </DialogTitle>
      {listAttachmentsDown && listAttachmentsDown?.length > 0 ? (
        <Box
          className="slide-container slider-comment-attachment"
          sx={{
            "& .react-slideshow-container .react-slideshow-wrapper .images-wrap":
              {
                "& div": {
                  height: "calc(100vh - 72px)",
                },
              },
          }}
        >
          <Slide
            defaultIndex={indexSlide}
            onStartChange={handleChangeSlide}
            infinite={false}
            autoplay={false}
            duration={5000}
            transitionDuration={500}
            easing="ease"
          >
            {filterAttachment(listAttachmentsDown)?.map((data, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {getExtension(data?.name)?.startsWith("video") ? (
                  <Box component="video" height="100%" width="100%" controls>
                    <source src={data.link} />
                  </Box>
                ) : (
                  <Box
                    component="img"
                    src={data.link}
                    height="auto"
                    width="auto"
                    alt="Image"
                    sx={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                    }}
                  />
                )}
              </div>
            ))}
          </Slide>
        </Box>
      ) : (
        <DialogContent
          sx={{
            p: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {type.startsWith("video") ? (
            <Box component="video" height="100%" width="auto" controls>
              <source src={src} />
            </Box>
          ) : (
            <Box
              component="img"
              src={src}
              height="100%"
              width="auto"
              alt="Image"
            />
          )}
        </DialogContent>
      )}
    </Dialog>
  );
};

export default memo(Preview);
