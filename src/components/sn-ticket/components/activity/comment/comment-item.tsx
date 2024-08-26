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

const CommentItem = (props) => {
  const {
    creatorUser,
    comment,
    attachments_down = [],
    createTime,
    listAttachmentsDown,
  } = props;

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
      {!!comment && (
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
    </Stack>
  );
};

export default CommentItem;
