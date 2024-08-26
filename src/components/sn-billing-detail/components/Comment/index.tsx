import { Stack } from "@mui/material";
import React, { useEffect } from "react";
import CommentEditor from "./CommentEditor";
import Comments from "./Comments";
import { Text } from "components/shared";
import { NS_BILLING, NS_SALES } from "constant/index";
import { useTranslations } from "next-intl";
import { Billing } from "store/billing/reducer";
import { User } from "constant/types";
import { useBillings } from "store/billing/selectors";
import FixedLayout from "components/FixedLayout";
import DialogLayout from "components/DialogLayout";
import { useParams } from "next/navigation";
import { useInvoices } from "store/invoice/selectors";

type IProps = {
  billing: Billing;
  user: User;
  handleDisplayComment: (value: boolean) => void;
  openComment: boolean;
};
const CommentSection = (props: IProps) => {
  const { billing, user, handleDisplayComment, openComment } = props;
  const billingT = useTranslations(NS_BILLING);
  const { onGetCommentBilling, dataComment } = useBillings();
  const { item: invoiceDetail, onGetInvoiceDetail } = useInvoices();
  const { id } = useParams();
  useEffect(() => {
    if (typeof id === "string") {
      onGetInvoiceDetail(id);
    }
  }, [id]);
  const callGetComment = () => {
    onGetCommentBilling(invoiceDetail?.invoice_number ?? "", "filter=Comment");
  };
  useEffect(() => {
    callGetComment();
  }, [onGetCommentBilling]);

  return (
    <DialogLayout
      open={openComment}
      onClose={() => handleDisplayComment(false)}
      sx={{ width: "70%" }}
    >
      <FixedLayout px={2} pb={0} sx={{ paddingBottom: 0, overflowY: "auto" }}>
        <Stack
          sx={{
            zIndex: 1,
            background: "#fff",
          }}
        >
          <Text color="text.main" mb={3} variant="h5" textTransform="uppercase">
            {billingT("detail.form.feed.title.writeYourComment")}
          </Text>
          <CommentEditor
            invoiceDetail={invoiceDetail}
            billing={billing}
            user={user}
            callGetComment={callGetComment}
          />
        </Stack>
        <Comments
          invoiceDetail={invoiceDetail}
          comments={dataComment}
          billing={billing}
        />
      </FixedLayout>
    </DialogLayout>
  );
};

export default CommentSection;
