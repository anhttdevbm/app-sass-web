import { memo, useState, useEffect, useMemo, useCallback } from "react";
import { Stack, Box, Typography } from "@mui/material";
import Avatar from "components/Avatar";
import { Button, Text } from "components/shared";
import { formatDate, getMessageErrorByAPI } from "utils/index";
import AttachmentPreview from "components/AttachmentPreview";
import { useTranslations } from "next-intl";
import { NS_COMMON, NS_PROJECT } from "constant/index";
import { Attachment } from "constant/types";
import { useAuth, useSnackbar } from "store/app/selectors";
import EditorCustom from "./editor/EditorCustom";
import { UnprivilegedEditor } from "react-quill";
import LockCommentIcon from "public/images/ticket/lock-comment.svg";
import useTicketAction from "queries/ticket/useTicketAction/useTicketAction";
import { useQueryClient } from "react-query";
import { useParams } from "next/navigation";
import { QUERY_TICKET_KEY } from "queries/ticket/keys";

const VALUE_AS_EMPTY = "<p><br></p>";
const CommentItem = (props) => {
  const {
    creatorUser,
    comment,
    lstFile,
    createTime,
    id,
    handleDeleteComment,
    isIternal,
  } = props;
  const { user } = useAuth();
  const [isEdit, setIsEdit] = useState(false);
  const [valueContent, setValueContent] = useState("");
  const { editComment } = useTicketAction();
  const commonT = useTranslations(NS_COMMON);
  const params = useParams();
  const { onAddSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const handleUpdateComment = useCallback(
    (data) => {
      editComment.mutate(
        {
          comment: data?.comment,
          isIternal,
          ticketId: params?.id as string,
          commentId: data?.id,
        },
        {
          onSuccess: (data) => {
            onAddSnackbar("Update comment success", "success");
            queryClient.invalidateQueries({
              queryKey: [QUERY_TICKET_KEY.LIST_COMMENT, params?.id],
            });
            setIsEdit(false);
          },
          onError: (error) => {
            onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
          },
        },
      );
    },
    [commonT, editComment, isIternal, onAddSnackbar, params?.id, queryClient],
  );

  const canEdit = useMemo(() => {
    if (!creatorUser || !user) return false;
    return creatorUser?.id === user?.id;
  }, [creatorUser, user]);

  const onChange = (value: string, delta, _, editor: UnprivilegedEditor) => {
    const isEmpty = value === VALUE_AS_EMPTY;
    setValueContent(isEmpty ? "" : value);
  };

  return (
    <Stack
      flex={1}
      spacing={1}
      bgcolor="grey.50"
      p={2}
      borderRadius={1}
      width={"100%"}
      sx={{
        borderRadius: "12px",
        "&:hover": {
          background: "#FFF7D6",
        },
      }}
    >
      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems={"center"}
        spacing={1}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Avatar size={32} src={creatorUser?.avatar?.link} />
          <Stack>
            <Text variant="body2" style={{ fontSize: "13px", fontWeight: 600 }}>
              {creatorUser?.fullname ?? "--"}
            </Text>
            {/* <Text variant="caption" color="grey.400">
              {creatorUser?.email ?? "--"}
            </Text> */}
          </Stack>
        </Stack>
        <Text variant="body2" color="grey.400" style={{ fontSize: "10px" }}>
          {formatDate(createTime, "HH:mm - dd/MM/yyyy")}
        </Text>
        {isIternal && (
          <Stack
            direction="row"
            justifyContent="flex-start"
            alignItems={"center"}
            gap={"5px"}
          >
            <LockCommentIcon />{" "}
            <Typography style={{ color: "#626F86", fontSize: "10px" }}>
              Internal Note
            </Typography>
          </Stack>
        )}
      </Stack>
      {isEdit ? (
        <EditorCustom
          value={valueContent}
          files={[]}
          onChange={onChange}
          disabledImage={true}
          newFile={lstFile ?? []}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-start"
            mt={2}
            gap={"10px"}
          >
            <Button
              onClick={() => handleUpdateComment({ id, comment: valueContent })}
              variant="primary"
              size="small"
              type="button"
            >
              Save
            </Button>
            <Button
              onClick={() => setIsEdit(false)}
              variant="outlined"
              size="small"
            >
              <Typography sx={{ color: "#333333" }}>Cancel</Typography>
            </Button>
          </Stack>
        </EditorCustom>
      ) : (
        <>
          <Box
            sx={{
              fontSize: 14,
              "& *": {
                marginBlockStart: 0,
                marginBlockEnd: 0,
                wordBreak: "break-all",
              },
            }}
            className="html"
            dangerouslySetInnerHTML={{ __html: comment }}
          />
          <Stack direction="row" gap={1.5} flex={1} flexWrap="wrap">
            {lstFile?.map((attachment) => (
              <AttachmentPreview
                key={attachment.link}
                src={attachment.link}
                name={attachment.nameFile}
                listData={lstFile}
                listAttachmentsDown={lstFile}
              />
            ))}
          </Stack>
        </>
      )}

      {canEdit && !isEdit && (
        <Stack
          flexDirection={"row"}
          justifyContent={"flex-start"}
          alignItems={"center"}
          gap={"10px"}
        >
          <Typography
            style={{
              color: "#999999",
              font: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
            onClick={() => {
              setIsEdit((prev) => !prev);
              setValueContent(comment);
            }}
          >
            Edit
          </Typography>
          <Typography
            style={{
              width: 4,
              height: 4,
              borderRadius: "100%",
              background: "#999999",
            }}
          ></Typography>
          <Typography
            style={{
              color: "#999999",
              font: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
            onClick={() => handleDeleteComment(id)}
          >
            Delete
          </Typography>
        </Stack>
      )}
    </Stack>
  );
};

export default memo(CommentItem);
