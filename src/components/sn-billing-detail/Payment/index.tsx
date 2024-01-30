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
import ProgressBar from "@ramonak/react-progress-bar";
import "../Payment/PaymentTableHome/style.css";
import zIndex from "@mui/material/styles/zIndex";

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
          <Grid xs={12} md={8} sx={{ borderRadius: "5px 0px 0px 5px" }}>
            <PaymentTableHome item={item} />
          </Grid>
          <Grid
            container
            xs={12}
            md={4}
            sx={{
              // background: "#1BC5BD",
              textAlign: "center",
              alignItems: "center",
              // borderRadius: "0px 5px 5px 0px",
              height: 40,
              zIndex: 2,
              position: "relative",
              right: "2px",
              width: "100%",
            }}
          >
            <ProgressBar
              completed={50}
              width="100%"
              height="40px"
              borderRadius="0px 5px 5px 0px"
              baseBgColor="#e95d5d"
              bgColor="#1BC5BD"
              labelAlignment="left"
              className="wrapper"
              customLabel={billingT("detail.form.payment.table.paid")}
              // barContainerClassName=""
              // completedClassName=""
              customLabelStyles={{ fontWeight: 400, fontSize: "16px" }}
            />
            <Text
              sx={{
                zIndex: 1,
                position: "absolute",
                color: "#fff",
                right: "2px",
              }}
            >
              {billingT("detail.form.payment.table.leftToPay")}
            </Text>
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              p={"2px 5px"}
              borderBottom={"1px solid #ECECF3"}
              alignItems={"center"}
              height={49}
              width={"100%"}
              color={"#666666"}
            >
              <Text
                sx={{
                  fontSize: "14px",
                  color: "#666",
                }}
              >
                50%
              </Text>
              <Text
                sx={{
                  fontSize: "14px",
                  color: "#666",
                }}
              >
                50%
              </Text>
            </Stack>
          </Grid>
        </Grid>
        {/* <Grid container spacing={2.1}>
          <Grid xs={12} md={8}></Grid>
          <Grid xs={12} md={4}></Grid>
        </Grid> */}
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
