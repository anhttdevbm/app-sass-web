import { Box, Grid, Menu, MenuItem, Stack, TableRow } from "@mui/material";
import { BodyCell, CellProps, TableLayout } from "components/Table";
import { IconButton, Text } from "components/shared";
import { NS_BILLING, NS_COMMON } from "constant/index";
import useBreakpoint from "hooks/useBreakpoint";
import { useTranslations } from "next-intl";
import { memo, useEffect, useMemo, useState } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PencilUnderlineIcon from "icons/PencilUnderlineIcon";
import TrashIcon from "icons/TrashIcon";
import PaymentModal from "../components/PaymentModal";
import PaymentTableHome from "./PaymentTableHome";
import PaymentTable from "./PaymentTable";
import { useBillings } from "store/billing/selectors";
import { useParams } from "next/navigation";
import { PaymentData } from "store/billing/actions";

type TabProps = {
  title: string;
};

const options = ["Edit", "Delete"];

const ITEM_HEIGHT = 48;

const TabPayment = (props: TabProps) => {
  const { title } = props;

  const {
    item,
    dataPayment,
    isAddPayment,
    isUpdatePayment,
    isDeletedPayment,
    onGetPayments,
    onAddPayment,
    onDeletePayment,
    onUpdatePayment,
  } = useBillings();

  const { id } = useParams() as { id: string };
  const { isMdSmaller } = useBreakpoint();
  const commonT = useTranslations(NS_COMMON);
  const billingT = useTranslations(NS_BILLING);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [rowSelected, setRowSelected] = useState<PaymentData>({});

  const handleOpen = (data: PaymentData) => {
    setRowSelected(data);
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    onGetPayments(id);
  }, []);

  useEffect(() => {
    if (isAddPayment || isUpdatePayment || isDeletedPayment) {
      onGetPayments(id);
    }
  }, [isAddPayment, isUpdatePayment, isDeletedPayment]);

  return (
    <Stack mt={6}>
      <Stack gap={2} pb={2} pl={2}>
        <Grid container spacing={2}>
          <Grid md={8} sx={{ borderRadius: "5px 0px 0px 5px" }}>
            <PaymentTableHome item={item} />
          </Grid>
          <Grid
            container
            md={4}
            sx={{
              background: "#1BC5BD",
              textAlign: "center",
              alignItems: "center",
              borderRadius: "0px 5px 5px 0px",
              height: 40,
              zIndex: 2,
              position: "relative",
              right: "2px",
            }}
          >
            <Grid md={6}>
              <Text variant={"body2"} color={"#fff"}>
                {billingT("detail.form.payment.table.paid")}
              </Text>
            </Grid>
            <Grid md={6}>
              <Text variant={"body2"} color={"#fff"}>
                {billingT("detail.form.payment.table.leftToPay")}
              </Text>
            </Grid>
          </Grid>
        </Grid>
        <Grid container spacing={2.1}>
          <Grid md={8}></Grid>
          <Grid md={4} borderBottom={"1px solid #ECECF3"}></Grid>
        </Grid>
      </Stack>
      <Stack gap={2} pb={2}>
        <PaymentTable
          handleOpen={handleOpen}
          dataPayment={dataPayment}
          onDeletePayment={onDeletePayment}
        />
      </Stack>
      <PaymentModal
        open={isOpen}
        handleClose={handleClose}
        title={billingT("detail.form.payment.title.editPayment")}
        action="update"
        dataUpdate={rowSelected}
      />
    </Stack>
  );
};
export default memo(TabPayment);
