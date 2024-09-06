"use client";
import { Stack, Typography } from "@mui/material";
import { Button } from "components/shared";
import {
  ACCEPT_MEDIA,
  IMAGES_ACCEPT,
  NS_COMMON,
  NS_TICKET,
} from "constant/index";
import useToggle from "hooks/useToggle";
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
import useGetListAgent from "queries/ticket-agent/useGetAgent/useGetListAgent";
import { useSelector } from "react-redux";
import { selectListAgent } from "store/ticket-agent/selectors";

const tabComment = [
  {
    label: "tabComment1",
    value: true,
  },
  {
    label: "tabComment2",
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
  const t = useTranslations(NS_TICKET);
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
    const formData = new FormData();

    // Append the comment and other fields
    formData.append("comment", content);
    formData.append("isIternal", JSON.stringify(isIternal));
    formData.append("ticketId", params?.id as string);

    // Append each file with its name as the field name
    files.forEach((file) => {
      formData.append(file.name, file, file.name);
    });

    createComment.mutate(formData, {
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
    });
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
    setFiles([]);
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
            {/* {it.label} */}
            {t(`ticketDetail.commentActivity.${it.label}`)}
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
            {t("ticketDetail.commentActivity.save")}
          </Button>
          <Button onClick={handleCancel} variant="outlined" size="small">
            <Typography sx={{ color: "#333333" }}>
              {" "}
              {t("ticketDetail.commentActivity.cancel")}
            </Typography>
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
