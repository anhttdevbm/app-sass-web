import { Box, Stack } from "@mui/material";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { IMAGES_ACCEPT, NS_COMMON } from "constant/index";
import { IconButton, Text, Tooltip } from "components/shared";
import CircleCloseIcon from "icons/CircleCloseIcon";
import PlayIcon from "icons/PlayIcon";
import { useTranslations } from "next-intl";
import FileIcon from "icons/FileIcon";
import useToggle from "hooks/useToggle";
import Link from "components/Link";
import Preview from "components/Preview";
import FilePdfIcon from "icons/FilePdfIcon";
import FileDocIcon from "icons/FileDocIcon";
import FileExcelIcon from "icons/FileExcelIcon";
import FileCsvIcon from "icons/FileCsvIcon";

interface AttachmentList {
  link: string;
  name: string;
  object: string;
}

type AttachmentPreviewProps = {
  name: string;
  onRemove?: () => void;
  src: string;
  size?: number;
  showName?: boolean;
  listData?: AttachmentList[];
  listAttachmentsDown?: AttachmentList[];
};

const AttachmentPreview = (props: AttachmentPreviewProps) => {
  const {
    name,
    onRemove,
    size = 64,
    showName,
    listData,
    listAttachmentsDown,
    ...rest
  } = props;
  const ref = useRef<HTMLVideoElement | HTMLImageElement | null>(null);
  const commonT = useTranslations(NS_COMMON);

  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  const [isPreview, onPreviewTrue, onPreviewFalse] = useToggle(false);

  const extension = useMemo(() => {
    const arr = name.split(".");
    return arr[arr.length - 1].toLowerCase();
  }, [name]);

  const fileIcon = useMemo(() => {
    switch (extension) {
      case "pdf":
        return <FilePdfIcon sx={{ fontSize: 40 }} />;
      case "doc":
      case "docx":
        return <FileDocIcon sx={{ fontSize: 40 }} />;
      case "xls":
      case "xlsx":
        return <FileExcelIcon sx={{ fontSize: 40 }} />;
      case "csv":
        return <FileCsvIcon sx={{ fontSize: 40 }} />;
      default:
        return <FileIcon sx={{ fontSize: 40 }} />;
    }
  }, [extension]);

  const type = useMemo(() => {
    if (IMAGES_EXTENSION.includes(extension)) return `image/${extension}`;
    if (VIDEOS_EXTENSION.includes(extension)) return `video/${extension}`;
    return;
  }, [extension]);

  const previewProps = useMemo(
    () => ({
      width: onRemove ? size - 20 : size,
      height: onRemove ? size - 20 : size,
      sx: {
        objectFit: isFullScreen ? "contain" : "cover",
        borderRadius: 1,
        height: "60px",
        width: "60px",
      },
    }),
    [isFullScreen, onRemove, size],
  );

  return (
    // <Tooltip title={type && !isPreview ? commonT("clickToViewLarge") : ""}>
    <Stack direction="row" alignItems="center">
      <Stack
        alignItems="center"
        justifyContent="center"
        borderRadius={1}
        overflow="hidden"
        position="relative"
        p={onRemove ? 1.25 : 0}
        sx={{
          cursor: "pointer",
        }}
      >
        {VIDEOS_EXTENSION.includes(extension) && (
          <Box
            bgcolor="rgba(0, 0, 0, .2)"
            position="absolute"
            width={size}
            height={size}
            top={onRemove ? 10 : 0}
            left={onRemove ? 10 : 0}
            borderRadius={1}
            zIndex={1}
          />
        )}
        {!!onRemove && (
          <IconButton
            noPadding
            onClick={onRemove}
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              bgcolor: "background.paper",
              "&:hover": {
                bgcolor: "background.paper",
              },
              zIndex: 20,
            }}
          >
            <CircleCloseIcon sx={{ color: "grey.400", fontSize: 20 }} />
          </IconButton>
        )}

        {IMAGES_EXTENSION.includes(extension) ? (
          <Box
            component="img"
            {...previewProps}
            alt={name ?? "Image"}
            ref={ref}
            onClick={onPreviewTrue}
            {...rest}
          />
        ) : VIDEOS_EXTENSION.includes(extension) ? (
          <>
            <PlayIcon
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                color: "common.white",
                fontSize: 24,
                zIndex: 1,
              }}
              onClick={onPreviewTrue}
            />
            <Box component="video" ref={ref} {...previewProps}>
              <source {...rest} type={type} height={60} width={60} />
            </Box>
          </>
        ) : (
          <Link
            href={props.src}
            download
            target="_blank"
            underline="none"
            color="inherit"
          >
            <Stack
              direction="column"
              justifyContent="center"
              alignContent="center"
              sx={{
                maxWidth: "60px",
                overflow: "hidden",
              }}
            >
              {fileIcon}
              <Text
                sx={{
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  wordWrap: "break-word",
                  whiteSpace: "nowrap",
                }}
                variant="caption"
              >
                {name}
              </Text>
            </Stack>
          </Link>
        )}
      </Stack>
      {!!showName && (
        <Text variant="caption" maxWidth={69} noWrap>
          {name}
        </Text>
      )}
      {Boolean(isPreview && props?.src && type) && (
        <Preview
          open={isPreview}
          onClose={onPreviewFalse}
          type={type as string}
          src={props.src as string}
          listData={listData}
          listAttachmentsDown={listAttachmentsDown}
        />
      )}
    </Stack>
    // </Tooltip>
  );
};

export default memo(AttachmentPreview);

const IMAGES_EXTENSION = ["png", "jpeg", "jpg", "ico", "gif"];
const VIDEOS_EXTENSION = ["mp4", "mov", "wmv", "flv", "avi", "webm", "mkv"];
