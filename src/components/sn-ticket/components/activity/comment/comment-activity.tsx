"use client";
import { Stack, Typography } from "@mui/material";
import { Button } from "components/shared";
import { NS_COMMON } from "constant/index";
import { useTranslations } from "next-intl";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { UnprivilegedEditor } from "react-quill";
import { useSnackbar } from "store/app/selectors";
import { getMessageErrorByAPI } from "utils/index";
import EditorCustom from "./editor/EditorCustom";
import { useGetListComment } from "queries/ticket/useGetTicket/useGetListComment";
import CommentItem from "./comment-item";
import useTicketAction from "queries/ticket/useTicketAction/useTicketAction";
import { useParams } from "next/navigation";
import { useQueryClient } from "react-query";
import { QUERY_TICKET_KEY } from "queries/ticket/keys";
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
  const queryClient = useQueryClient();
  const { data: listComment } = useGetListComment();
  const { createComment, deleteComment, editComment } = useTicketAction();
  const commonT = useTranslations(NS_COMMON);
  const { onAddSnackbar } = useSnackbar();
  const [isIternal, setIsIternal] = useState(true);
  const [isLoadingFile, setIsLoadingFile] = useState<boolean>(false);
  const editorRef = useRef<UnprivilegedEditor | undefined>();

  const [content, setContent] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);

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
      { comment: content, isIternal, ticketId: params?.id as string, ...files },
      {
        onSuccess: (data) => {
          onAddSnackbar("Create comment success", "success");
          queryClient.invalidateQueries({
            queryKey: [QUERY_TICKET_KEY.LIST_COMMENT, params?.id],
          });
          setContent("");
          setFiles([]);
        },
        onError: (error) => {
          onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
        },
      },
    );
  };

  const handleDeleteComment = useCallback(
    (id) => {
      deleteComment.mutate(
        { ticketId: params?.id, commentId: id },
        {
          onSuccess: (data) => {
            onAddSnackbar("Delete comment success", "success");
            queryClient.invalidateQueries({
              queryKey: [QUERY_TICKET_KEY.LIST_COMMENT, params?.id],
            });
            setContent("");
            setFiles([]);
          },
          onError: (error) => {
            onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
          },
        },
      );
    },
    [commonT, deleteComment, onAddSnackbar, params?.id, queryClient],
  );

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
            type="button"
          >
            Save
          </Button>
          <Button onClick={handleCancel} variant="outlined" size="small">
            <Typography sx={{ color: "#333333" }}>Cancel</Typography>
          </Button>
        </Stack>
      </EditorCustom>
      {listComment?.data.map((comment, idx) => (
        <CommentItem
          key={`${comment.id}-${idx}`}
          handleDeleteComment={handleDeleteComment}
          {...comment}
          // listAttachmentsDown={listAttachmentsDown}
        />
      ))}
    </>
  );
};
export default CommentActivity;
