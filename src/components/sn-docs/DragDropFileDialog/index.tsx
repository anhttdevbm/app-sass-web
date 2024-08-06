import { Add } from "@mui/icons-material";
import { Box, CircularProgress, Paper, Stack, SxProps } from "@mui/material";
import { client } from "api";
import Loading from "components/Loading";
import { Button, Text } from "components/shared";
import {
  AI_DOCS_API_URL,
  AN_ERROR_TRY_AGAIN,
  NS_COMMON,
  NS_DOCS,
} from "constant/index";
import { ContentBlock } from "draft-js";
import useTheme from "hooks/useTheme";
import { UploadFileFillIcon } from "icons/UploadFileFillIcon";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { useDocs } from "store/docs/selectors";
import { uuid } from "utils/index";
import Dialog from "../Dialog";
import { FileType, ITypeFileInfo } from "../ImportForm";

interface IDocumentFile {
  name: string;
  type: string;
  content: string | object[];
}

interface IDragDropFileDialogProps {
  open: boolean;
  typFileInfo: ITypeFileInfo;
  onClose: () => void;
}

export default function DragDropFileDialog(props: IDragDropFileDialogProps) {
  const commonT = useTranslations(NS_COMMON);
  const docsT = useTranslations(NS_DOCS);
  const { open, typFileInfo, onClose } = props;
  const theme = useTheme();
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<IDocumentFile | null>(null);
  const [pending, setPending] = useState<boolean>(false);
  const { onCreateDoc, loading } = useDocs();

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    handleUploadFile(e.dataTransfer.files[0]);
  };

  const handleClose = () => {
    onClose();
    setPending(false);
    setFile(null);
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUploadFile(e.target.files[0]);
    }
  };

  const handleUploadFile = async (file: File) => {
    try {
      setPending(true);
      const fileExt = file.name.split(".").pop();
      if (typFileInfo.extList.every((item: string) => "." + fileExt != item)) {
        throw new Error("Invalid file extension");
      }

      const formData = new FormData();
      formData.append("file", file);
      typFileInfo.additionalData &&
        Object.entries(typFileInfo.additionalData).forEach(([key, value]) => {
          formData.append(key, value);
        });

      const response = await client.post(typFileInfo.endpointURL, formData, {
        baseURL: AI_DOCS_API_URL,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        const fileData: IDocumentFile = {
          name: file.name,
          type: file.type,
          content:
            typFileInfo.typ == FileType.Docs
              ? response.data.sumary
              : response.data.converted,
        };
        setFile(fileData);
        setPending(false);
      } else {
        throw AN_ERROR_TRY_AGAIN;
      }
    } catch (error) {
      setPending(false);
      throw error;
    }
  };

  const handleCreateDocument = () => {
    const blocks: ContentBlock[] = [];
    if (typFileInfo.typ === FileType.Docs) {
      blocks.push(
        new ContentBlock({
          key: uuid(),
          type: "unstyled",
          text: file?.content || "",
        }),
      );
    } else {
      (file?.content as object[]).forEach((row, idx) => {
        blocks.push(
          new ContentBlock({
            key: uuid(),
            type: "header-five",
            text: `Row ${idx + 1}`,
          }),
        );
        Object.entries(row).forEach(([key, value]) =>
          blocks.push(
            new ContentBlock({
              key: uuid(),
              type: "normaltext",
              text: `\t${key}: ${value}`,
            }),
          ),
        );
      });
    }

    onCreateDoc(undefined, JSON.stringify(blocks), file?.name);
  };

  return (
    <Dialog
      title={typFileInfo.title}
      open={open}
      onClose={handleClose}
      renderBottom={
        !!file && (
          <Stack alignItems="flex-start" sx={{ width: "100%" }} gap={1}>
            <Text
              variant="caption"
              sx={{ color: "#999999", textTransform: "uppercase" }}
            >
              {commonT("actions")}
            </Text>
            <Button
              variant="primary"
              fullWidth
              sx={{
                background: "linear-gradient(-90deg, #2AF598 0%, #009EFD 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(-90deg, #2AF598 0%, #009EFD 100%)",
                },
              }}
              type="button"
              size="small"
              onClick={handleCreateDocument}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                <>
                  <Add />
                  {docsT("import.createDoc")}
                </>
              )}
            </Button>
          </Stack>
        )
      }
      bottomSx={defaultSX.bottomSX}
    >
      {!file ? (
        <Stack
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
          sx={{ ...defaultSX.uploadFileSX(dragging, theme) }}
          alignItems="center"
          justifyContent="center"
        >
          {pending ? (
            <Loading open={pending} />
          ) : (
            <>
              <UploadFileFillIcon />
              <Text variant="body2" color={theme.palette.primary.main}>
                {`${docsT(
                  "import.dialog.dragdrop.caption",
                )} (${typFileInfo.extList.join(", ")})`}
              </Text>
            </>
          )}
        </Stack>
      ) : (
        <Paper variant="outlined" sx={{ ...defaultSX.readFileSX }}>
          <Stack gap={1}>
            <Text variant="h5" gap={1} sx={{ fontSize: 17, fontWeight: 700 }}>
              {file.name}
            </Text>
            {typeof file.content === "string" ? (
              <Text variant="body1">{file.content}</Text>
            ) : (
              <>
                {(file?.content as object[]).map((row, idx) => (
                  <Box key={`document-import-convert-row-${idx}`}>
                    <Text variant="h6" fontWeight={700}>{`Row ${
                      idx + 1
                    }`}</Text>
                    {Object.entries(row).map(([key, value]) => (
                      <Text
                        key={`document-import-convert-row-${idx}-col-${key}`}
                        variant="body2"
                        ml={2}
                      >{`\t${key}: ${value}`}</Text>
                    ))}
                  </Box>
                ))}
              </>
            )}
          </Stack>
        </Paper>
      )}
      <input
        type="file"
        accept={typFileInfo.extList.join(",")}
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </Dialog>
  );
}

const defaultSX: {
  uploadFileSX: (dragging: boolean, theme: any) => SxProps;
  readFileSX: SxProps;
  bottomSX: SxProps;
} = {
  uploadFileSX: (dragging, theme) => ({
    width: "100%",
    minHeight: "192px",
    borderRadius: 1,
    border: "1px dashed",
    bgcolor: dragging
      ? theme.palette.grey[100]
      : theme.palette.background.default,
    borderColor: theme.palette.primary.main,
    cursor: "pointer",
    "&:hover": {
      bgcolor: theme.palette.grey[100],
    },
  }),
  readFileSX: {
    p: 3,
    width: { md: 592, sx: "100%" },
    maxHeight: 450,
    overflowX: "hidden",
    overflowY: "auto",
  },
  bottomSX: {
    px: 3,
    py: 2,
    borderTop: "1px solid",
    borderColor: "grey.100",
  },
};
