import { memo, useState, useEffect, useMemo } from "react";
import { Stack, Box, Typography } from "@mui/material";
import Avatar from "components/Avatar";
import { Button, Text } from "components/shared";
import { Comment } from "store/project/reducer";
import Image from "next/image";
import { formatDate } from "utils/index";
import AttachmentPreview from "components/AttachmentPreview";
import { useTranslations } from "next-intl";
import { NS_PROJECT } from "constant/index";
import { Attachment } from "constant/types";
import { useAuth } from "store/app/selectors";
import EditorCustom from "./editor/EditorCustom";
import { UnprivilegedEditor } from "react-quill";

const VALUE_AS_EMPTY = "<p><br></p>";
const CommentItem = (props) => {
  const {
    creatorUser,
    comment,
    attachments_down = [],
    createTime,
    listAttachmentsDown,
    id,
    handleDeleteComment,
    handleUpdateComment,
  } = props;
  const { user } = useAuth();
  const [isEdit, setIsEdit] = useState(false);
  const [valueContent, setValueContent] = useState("");
  const [files, setFiles] = useState([]);

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
    >
      <Stack direction="row" justifyContent="space-between" spacing={1}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Avatar size={32} src={creatorUser?.avatar?.link} />
          <Stack>
            <Text variant="body2">{creatorUser?.fullname ?? "--"}</Text>
            {/* <Text variant="caption" color="grey.400">
              {creatorUser?.email ?? "--"}
            </Text> */}
          </Stack>
        </Stack>
        <Text variant="body2" color="grey.400">
          {formatDate(createTime, "HH:mm - dd/MM/yyyy")}
        </Text>
      </Stack>
      {isEdit ? (
        <EditorCustom value={valueContent} files={files} onChange={onChange}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-start"
            mt={2}
            gap={"10px"}
          >
            <Button
              onClick={() => handleUpdateComment(id)}
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
      )}

      {/* <Stack direction="row" gap={1.5} flex={1} flexWrap="wrap">
          {attachments_down.map((attachment) => (
            <AttachmentPreview
              key={attachment.link}
              src={attachment.link}
              name={attachment.name}
              listData={attachments_down}
              listAttachmentsDown={listAttachmentsDown}
            />
          ))}
        </Stack> */}
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
