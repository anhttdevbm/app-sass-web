import { memo, useState, useEffect } from "react";
import { Stack, Box } from "@mui/material";
import Avatar from "components/Avatar";
import { Text } from "components/shared";
import { Comment } from "store/project/reducer";
import Image from "next/image";
import { formatDate } from "utils/index";
import AttachmentPreview from "components/AttachmentPreview";
import { useTranslations } from "next-intl";
import { NS_PROJECT } from "constant/index";
import { Attachment } from "constant/types";

type CommentsProps = {
  comments?: Comment[];
};

type CommentItemProps = {} & Comment;

const Comments = (props: CommentsProps) => {
  const { comments = [] } = props;
  const projectT = useTranslations(NS_PROJECT);
  const [listAttachmentsDown, setListAttachmentsDown] = useState<Attachment[]>(
    [],
  );
  useEffect(() => {
    comments.map((comment) => {
      if (comment.attachments_down) {
        comment.attachments_down.map((item) => {
          setListAttachmentsDown((current) => [...current, item]);
        });
      }
    });
  }, [comments]);

  return (
    <Stack spacing={2}>
      <Text color="grey.400" variant="h6" textTransform="uppercase">
        {projectT("taskDetail.commentList")}
      </Text>
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          {...comment}
          listAttachmentsDown={listAttachmentsDown}
        />
      ))}
    </Stack>
  );
};

export default memo(Comments);

const CommentItem = (props: CommentItemProps) => {
  const {
    creator,
    content,
    attachments_down = [],
    created_time,
    listAttachmentsDown,
  } = props;

  return (
    <Stack flex={1} spacing={1} bgcolor="grey.50" p={2} borderRadius={1}>
      <Stack direction="row" justifyContent="space-between" spacing={1}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Avatar size={32} src={creator?.avatar?.link} />
          <Stack>
            <Text variant="body2">{creator?.fullname ?? "--"}</Text>
            <Text variant="caption" color="grey.400">
              {creator?.email ?? "--"}
            </Text>
          </Stack>
        </Stack>
        <Text variant="body2" color="grey.400">
          {formatDate(created_time, "HH:mm - dd/MM/yyyy")}
        </Text>
      </Stack>

      {!!content && (
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
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
      <Stack direction="row" gap={1.5} flex={1} flexWrap="wrap">
        {attachments_down.map((attachment) => (
          <AttachmentPreview
            key={attachment.link}
            src={attachment.link}
            name={attachment.name}
            listData={attachments_down}
            listAttachmentsDown={listAttachmentsDown}
          />
        ))}
      </Stack>
    </Stack>
  );
};
