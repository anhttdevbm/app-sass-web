import { Box, Stack } from "@mui/material";
import Avatar from "components/Avatar";
import { Dropdown } from "components/Filters";
import Loading from "components/Loading";
import { Text } from "components/shared";
import { NS_BILLING, NS_COMMON } from "constant/index";
import { useTranslations } from "next-intl";
import { memo, useEffect, useMemo, useState } from "react";
import { Billing, BillingCommentData } from "store/billing/reducer";
import { useBillings } from "store/billing/selectors";
import { Invoice } from "store/invoice/reducer";
import { fetchUser, formatDate } from "utils/index";
import { Attachment } from "constant/types";
import AttachmentPreview from "components/sn-sales-detail/components/Comment/AttachmentPreview";

type CommentsProps = {
  comments?: BillingCommentData[];
  billing?: Billing;
  invoiceDetail?: Invoice;
};

type CommentItemProps = { type: string; content?: string } & BillingCommentData;

const Comments = (props: CommentsProps) => {
  const { comments, billing, invoiceDetail } = props;
  const billingT = useTranslations(NS_BILLING);
  const commonT = useTranslations(NS_COMMON);
  const { isFetching } = useBillings();
  const [comentType, setCommentType] = useState("Comment");
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
    if (comentType === "Comment")
      return comments?.filter((comment) => !comment?.attachments?.length);
    return comments?.filter(
      (comment) => comment?.attachments && comment?.attachments?.length > 0,
    );
  }, [comments, comentType]);

  useEffect(() => {
    onGetCommentBilling(
      invoiceDetail?.invoice_number ?? "",
      "filter=" + comentType,
    );
  }, [comentType, onGetCommentBilling, invoiceDetail?.invoice_number]);

  return isFetching ? (
    <Loading open={false} />
  ) : (
    <Stack spacing={2}>
      <Stack
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
        sx={{ zIndex: 1, background: "#fff" }}
      >
        <Text>{billingT("detail.form.feed.title.show")}:</Text>
        <Dropdown
          onChange={(name, value) => {
            setCommentType(value);
          }}
          value={comentType}
          options={[
            {
              label: billingT("detail.form.feed.button.option.comments"),
              value: "Comment",
            },
            {
              label: billingT("detail.form.feed.button.option.attachments"),
              value: "Attachment",
            },
          ]}
          name="type"
        />
      </Stack>
      {(filteredComments ?? []).map((comment: BillingCommentData) => (
        <CommentItem
          key={comment.invoice_id}
          type={comentType || "Comment"}
          {...comment}
          file={comment.attachments ?? []}
        />
      ))}
    </Stack>
  );
};

export default memo(Comments);

function CommentItem(props: CommentItemProps) {
  const { type, content, status, created_at, creator, file } = props;
  const [name, setName] = useState();
  const [email, setEmail] = useState();

  const callData = async () => {
    if (creator) {
      const data = await fetchUser(creator);
      setName(data?.fullname);
      setEmail(data?.email);
    }
  };

  useEffect(() => {
    callData();
  }, [creator]);

  const [attachments_down, setAttachment] = useState<Attachment[]>([]);

  useEffect(() => {
    const newList = (file ?? []).map((e) => ({
      link: e,
      name: "image.png",
      object: "e4a2d270-7c18-11ef-b62f-4b6fa1ded3d8-540a7dbc74402284",
    }));

    setAttachment(newList);
  }, [file]);
  return (
    <Stack flex={1} spacing={1} bgcolor="grey.50" p={2} borderRadius={1}>
      <Stack direction="row" justifyContent="space-between" spacing={1}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Avatar size={32} src={""} />
          <Stack>
            <Text variant="body2">{name ?? "--"}</Text>
            <Text variant="caption" color="grey.400">
              {email ?? "--"}
            </Text>
          </Stack>
        </Stack>
        <Text variant="body2" color="grey.400">
          {formatDate(created_at, "HH:mm - dd/MM/yyyy")}
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
            "& img": {
              maxWidth: "100%",
              height: "auto",
              objectFit: "contain",
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
            listAttachmentsDown={attachments_down}
          />
        ))}
      </Stack>
    </Stack>
  );
}
