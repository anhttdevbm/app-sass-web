import styled from "@emotion/styled";
import { Stack, Typography } from "@mui/material";
import { client, Endpoint } from "api";
import { Button } from "components/shared";
import { ACCEPT_MEDIA, IMAGES_ACCEPT, NS_COMMON } from "constant/index";
import useToggle from "hooks/useToggle";
import { useTranslations } from "next-intl";
import React, {
  ChangeEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import ReactQuill, { ReactQuillProps, UnprivilegedEditor } from "react-quill";
import { useSnackbar } from "store/app/selectors";
import { getMessageErrorByAPI } from "utils/index";
import EditorCustom from "./editor/EditorCustom";
import { useGetListComment } from "queries/ticket/useGetTicket/useGetListComment";
import CommentItem from "./comment-item";
import { FileUploader } from "react-drag-drop-files";
import useTicketAction from "queries/ticket/useTicketAction/useTicketAction";
import { useParams } from "next/navigation";
const tabComment = [
  {
    label: "Add internal note",
    value: true,
  },
  {
    label: "Reply to customer",
    value: false,
  },
];
const VALUE_AS_EMPTY = "<p><br></p>";
const CommentActivity = () => {
  const params = useParams();
  const { data: listComment } = useGetListComment();
  const { createComment } = useTicketAction();
  const commonT = useTranslations(NS_COMMON);
  const { onAddSnackbar } = useSnackbar();
  const [isIternal, setIsIternal] = useState(true);
  const [isProcessing, onProcessingTrue, onProcessingFalse] = useToggle();
  const [isLoadingFile, setIsLoadingFile] = useState<boolean>(false);
  const editorRef = useRef<UnprivilegedEditor | undefined>();
  const [newFiles, setNewFiles] = useState<File[]>([]);

  const [content, setContent] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [fileLoaded, setFileLoaded] = useState<string[]>([]);

  const onChange = (value: string, delta, _, editor: UnprivilegedEditor) => {
    const isEmpty = value === VALUE_AS_EMPTY;
    setContent(isEmpty ? "" : value);
    editorRef.current = editor;
  };

  const onChangeFiles = (files: File[]) => {
    setFiles(files);
    // setFileLoaded((files) => files.concat(data));
  };

  const disabled = useMemo(
    () =>
      isLoadingFile ||
      ((!content?.trim()?.length ||
        !editorRef.current?.getText()?.trim()?.length) &&
        !files.length),
    [content, files.length, isLoadingFile],
  );

  const onSubmit = async () => {
    createComment.mutate(
      { comment: content, isIternal, ticketId: params?.id as string },
      {
        onSuccess: (data) => {
          onAddSnackbar("Create comment success", "success");
        },
        onError: (error) => {
          onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
        },
      },
    );
  };

  const handleCancel = () => {
    setContent("");
  };

  return (
    <>
      <Stack
        flexDirection={"row"}
        justifyContent={"flex-start"}
        alignItems={"center"}
        gap={"23px"}
      >
        {tabComment.map((it, idx) => (
          <Typography
            key={idx}
            sx={{
              paddingBottom: "6px",
              borderBottom: isIternal === it.value ? "solid 2px #14B9E5" : "",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "13px",
            }}
            onClick={() => setIsIternal(it.value)}
          >
            {it.label}
          </Typography>
        ))}
      </Stack>
      <EditorCustom
        hasAttachment
        placeholder={""}
        onChange={onChange}
        onChangeFiles={onChangeFiles}
        value={content}
        files={files}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-start"
          mt={2}
          gap={"10px"}
        >
          <Button
            disabled={disabled}
            onClick={onSubmit}
            variant="primary"
            size="small"
          >
            Save
          </Button>
          <Button onClick={handleCancel} variant="outlined" size="small">
            <Typography sx={{ color: "#333333" }}>Cancel</Typography>
          </Button>
        </Stack>
      </EditorCustom>
      {listComment?.data.map((comment) => (
        <CommentItem
          key={comment.id}
          {...comment}
          // listAttachmentsDown={listAttachmentsDown}
        />
      ))}
    </>
  );
};
export default CommentActivity;
