import { memo, useState, useEffect, useMemo } from "react";
import { Stack, Box } from "@mui/material";
import Avatar from "components/Avatar";
import { Text } from "components/shared";
import { Comment } from "store/project/reducer";
import Image from "next/image";
import { formatDate } from "utils/index";
import { useTranslations } from "next-intl";
import { NS_BILLING, NS_COMMON, NS_PROJECT, NS_SALES } from "constant/index";
import { Attachment } from "constant/types";
import { useFormContext, useWatch } from "react-hook-form";
import useGetEmployeeOptions from "components/sn-sales/hooks/useGetEmployeeOptions";
import { SalesComment } from "store/sales/reducer";
import { useSaleDetail } from "store/sales/selectors";
import Loading from "components/Loading";
import { Dropdown } from "components/Filters";
import AttachmentPreview from "./AttachmentPreview";
import { useBillings } from "store/billing/selectors";
import {
  Billing,
  BillingComment,
  BillingCommentData,
} from "store/billing/reducer";

type CommentsProps = {
  comments?: BillingCommentData[];
  billing?: Billing;
};

type CommentItemProps = { type: string } & BillingCommentData;

const Comments = (props: CommentsProps) => {
  const { comments, billing } = props;
  const billingT = useTranslations(NS_BILLING);
  const commonT = useTranslations(NS_COMMON);
  const { isFetching } = useBillings();
  const [comentType, setCommentType] = useState("all");
  // const { control, getValues } = useFormContext();
  const { onGetCommentBilling } = useBillings();
  const [listAttachmentsDown, setListAttachmentsDown] = useState<string[]>([
    "",
  ]);

  // const comments = useWatch({ control, name: "comments" });
  // const comments = null;

  const filteredComments = useMemo(() => {
    if (!comments) return [];
    if (!comentType) return comments;
    if (comentType === "comments")
      return comments?.filter((comment) => !comment?.file?.length);
    return comments?.filter(
      (comment) => comment?.file && comment?.file?.length > 0,
    );
  }, [comments, comentType]);

  useEffect(() => {
    onGetCommentBilling(billing?.id ?? "", comentType);
  }, [billing?.id, comentType, onGetCommentBilling]);

  return isFetching ? (
    <Loading open={false} />
  ) : (
    <Stack spacing={2}>
      <Stack
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
        sx={{ position: "sticky", zIndex: 1, top: 241, background: "#fff" }}
      >
        <Text>{billingT("detail.form.feed.title.show")}:</Text>
        <Dropdown
          onChange={(name, value) => {
            setCommentType(value);
          }}
          placeholder={commonT("all")}
          value={comentType}
          options={[
            {
              label: billingT("detail.form.feed.button.option.comments"),
              value: "comments",
            },
            {
              label: billingT("detail.form.feed.button.option.attachments"),
              value: "attachments",
            },
            // {
            //   label: billingT("detail.form.feed.button.option.changes"),
            //   value: "changes",
            // },
          ]}
          name="type"
        />
      </Stack>
      {comments?.map((comment: BillingCommentData) => (
        <CommentItem
          key={comment.bill_id}
          type={comentType || "comments"}
          {...comment}
          file={comment.file ?? []}
        />
      ))}
    </Stack>
  );
};

export default memo(Comments);

const CommentItem = (props: CommentItemProps) => {
  const { type, comment, user_id, status, created_at, file } = props;

  return (
    <Stack flex={1} spacing={1} bgcolor="grey.50" p={2} borderRadius={1}>
      <Stack direction="row" justifyContent="space-between" spacing={1}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Avatar size={32} src={user_id?.avatar?.link} />
          <Stack>
            <Text variant="body2">{user_id?.name ?? "--"}</Text>
            <Text variant="caption" color="grey.400">
              {user_id?.email ?? "--"}
            </Text>
          </Stack>
        </Stack>
        <Text variant="body2" color="grey.400">
          {formatDate(created_at, "HH:mm - dd/MM/yyyy")}
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
            "& img": {
              maxWidth: "100%",
              height: "auto",
              objectFit: "contain",
            },
          }}
          className="html"
          dangerouslySetInnerHTML={{ __html: comment }}
        />
      )}

      <Stack direction="row" gap={1.5} flex={1} flexWrap="wrap">
        {file &&
          file?.map((attachment) => (
            <AttachmentPreview
              key={""}
              src={attachment}
              name={""}
              listData={[]}
              listAttachmentsDown={[]}
            />
          ))}
      </Stack>
    </Stack>
  );
};
