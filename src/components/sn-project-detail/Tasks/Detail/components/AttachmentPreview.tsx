import { Box, Stack, StackProps } from "@mui/material";
import { Fragment, memo, useEffect, useMemo, useRef, useState } from "react";
import { IMAGES_ACCEPT, NS_COMMON } from "constant/index";
import { IconButton, Text, Tooltip } from "components/shared";
import CircleCloseIcon from "icons/CircleCloseIcon";
import PlayIcon from "icons/PlayIcon";
import { useTranslations } from "next-intl";
import FileIcon from "icons/FileIcon";
import Link from "components/Link";
import FilePdfIcon from "icons/FilePdfIcon";
import FileDocIcon from "icons/FileDocIcon";
import FileExcelIcon from "icons/FileExcelIcon";
import FileCsvIcon from "icons/FileCsvIcon";
import Preview from "components/Preview";
import useToggle from "hooks/useToggle";

type AttachmentPreviewProps = {
  name: string;
  onRemove?: () => void;
  src: string;
  size?: number;
  showName?: boolean;
  containerProps?: StackProps;
};

const AttachmentPreview = (props: AttachmentPreviewProps) => {
  const {
    name,
    onRemove,
    size = 64,
    showName,
    containerProps,
    ...rest
  } = props;
  const ref = useRef<HTMLVideoElement | HTMLImageElement | null>(null);
  const commonT = useTranslations(NS_COMMON);

  const [isPreview, onPreviewTrue, onPreviewFalse] = useToggle(false);

  const extension = useMemo(() => {
    const arr = name.split(".");
    return arr[arr.length - 1];
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
      width: size,
      height: size,
    }),
    [size],
  );

  return (
    // <Tooltip title={type && !isPreview ? commonT("clickToViewLarge") : ""}>
    <Fragment>
      <Stack
        direction="row"
        alignItems="center"
        borderRadius={1}
        position="relative"
        spacing={1}
        width={190}
        mx={0.75}
        sx={{ cursor: "pointer" }}
        onClick={() => {
          if (
            IMAGES_EXTENSION.includes(extension) ||
            VIDEOS_EXTENSION.includes(extension)
          ) {
            onPreviewTrue();
          }
        }}
        {...containerProps}
      >
        {VIDEOS_EXTENSION.includes(extension) && (
          <Box
            bgcolor="rgba(0, 0, 0, .2)"
            width={size}
            height={size}
            position="absolute"
            top={onRemove ? 10 : 0}
            left={onRemove ? 18 : 8}
            borderRadius={1}
            zIndex={1}
          />
        )}
        <Stack
          alignItems="center"
          justifyContent="center"
          width={size}
          height={size}
          borderRadius={1}
          overflow="hidden"
          p={onRemove ? 1.25 : 0}
          sx={{
            cursor: "pointer",
          }}
        >
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
                  left: 28,
                  transform: "translateY(-50%)",
                  color: "common.white",
                  fontSize: 24,
                  zIndex: 1,
                }}
                onClick={onPreviewTrue}
              />
              <Box component="video" ref={ref} {...previewProps}>
                <source {...rest} type={type} />
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
              {fileIcon}
            </Link>
          )}
        </Stack>
        {!!showName && (
          <Text variant="caption" maxWidth={100}>
            {shortName(name)}
          </Text>
        )}
        {!!onRemove && (
          <IconButton
            noPadding
            onClick={onRemove}
            sx={{
              position: "absolute",
              top: -10,
              right: -10,
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
      </Stack>
      {Boolean(isPreview && props?.src && type) && (
        <Preview
          open={isPreview}
          onClose={onPreviewFalse}
          type={type as string}
          src={props.src as string}
        />
      )}
    </Fragment>
    // </Tooltip>
  );
};

export default memo(AttachmentPreview);

const IMAGES_EXTENSION = ["png", "jpeg", "jpg", "ico", "gif"];
const VIDEOS_EXTENSION = ["mp4", "mov", "wmv", "flv", "avi", "webm", "mkv"];

const shortName = (value: string) => {
  if (value.length <= 16) {
    return value;
  }
  return value.slice(0, 5) + "..." + value.slice(-8);
};
