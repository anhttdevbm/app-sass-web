import { Stack, Typography } from "@mui/material";
import { INVOICES_PATH } from "constant/paths";
import { User } from "constant/types";
import { FormikProps, useFormik } from "formik";
import ChangeTemplateIcon from "icons/ChangeTemplateIcon";
import EditIcon from "icons/EditIcon";
import MarkAsSendIcon from "icons/MarkAsSendIcon";
import ShareInvoiceIcon from "icons/ShareInvoiceIcon";
import { useParams, usePathname, useRouter } from "next/navigation";
import { memo, useEffect, useState } from "react";
import { useSnackbar } from "store/app/selectors";
import { Bill, Billing, Budgets } from "store/billing/reducer";
import { Invoice } from "store/invoice/reducer";
import { useInvoices } from "store/invoice/selectors";
import MoreButton from "./MoreButton";
import PdfButton from "./PdfButton";
import TemplateOne from "./TemplateOne";

type TabProps = {
  title: string;
  editForm?: boolean;
  item?: Invoice;
  user?: User;
  arrBudgets?: Budgets[];
  form: FormikProps<Billing>;
  billToInfo: Bill;
  setBillToInfo: (value: Bill) => void;
  billFromInfo: Bill;
  setBillFromInfo: (value: Bill) => void;
};
const billingFormTranslatePrefix = "detail.form";

function createData(
  desc: string,
  unit: string,
  qty: number,
  rate: number,
  amount: number,
) {
  return { desc, unit, qty, rate, amount };
}
const TabInvoice = (props: TabProps) => {
  const { user } = props;
  const {
    item: itemInvoice,
    onGetInvoiceDetail,
    onDeleteInvoice,
  } = useInvoices();

  const { id } = useParams();
  const { push } = useRouter();
  const [isEdit, setIsEdit] = useState(false);
  const pathname = usePathname();
  const { onAddSnackbar } = useSnackbar();
  const formik = useFormik<Billing>({
    enableReinitialize: true,
    initialValues: {},
    onSubmit(values, formikHelpers) {
      // setDataUpdate

      return;
    },
  });

  useEffect(() => {
    if (typeof id === "string") {
      onGetInvoiceDetail(id);
    }
  }, [id]);

  const handleClickShare = async () => {
    const origin =
      typeof window !== "undefined" && window.location.origin
        ? window.location.origin
        : "";
    const URL = `${origin}${pathname}`;
    try {
      await navigator.clipboard.writeText(URL);
      onAddSnackbar("Copied!", "success");
    } catch (er) {
      onAddSnackbar("Failed to copy", "error");
    }
  };

  const handleDeleteInvoice = async () => {
    try {
      await onDeleteInvoice(id as string);
      push(INVOICES_PATH);
      onAddSnackbar("Deleted", "success");
    } catch (error) {
      onAddSnackbar("Failed to delete", "error");
    }
  };

  const listChoice = [
    {
      icon: (
        <EditIcon sx={{ width: "12px", height: "12px", margin: "auto 0" }} />
      ),
      title: "Edit",
      action: () => setIsEdit((prev) => !prev),
    },
    {
      icon: (
        <MarkAsSendIcon
          sx={{ width: "12px", height: "12px", margin: "auto 0" }}
        />
      ),
      title: "Mark As Send",
      action: () => onAddSnackbar("Mark as sent!", "success"),
    },
    {
      icon: (
        <ShareInvoiceIcon
          sx={{ width: "12px", height: "12px", margin: "auto 0" }}
        />
      ),
      title: "Share",
      action: () => handleClickShare(),
    },
  ];

  return (
    <Stack mt={2} sx={{ overflowY: "auto", height: "60vh" }}>
      <Stack
        gap={1}
        direction="row"
        sx={{ borderBottom: "1.5px solid #EBEAF2" }}
      >
        {listChoice.map((choice, index) => (
          <Stack
            key={index}
            direction="row"
            sx={{
              borderRight: "1.5px solid #EBEAF2",
              display: "flex",
              gap: "8px",
              padding: "12px 8px",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={choice.action}
          >
            {choice.icon}
            <Typography fontSize={14} fontWeight={400} color="#000000">
              {choice.title}
            </Typography>
          </Stack>
        ))}

        <Stack
          direction="row"
          sx={{
            borderRight: "1.5px solid #EBEAF2",
            display: "flex",
            gap: "8px",
            padding: "12px 8px",
            alignItems: "center",
          }}
        >
          <ChangeTemplateIcon
            sx={{ width: "12px", height: "12px", margin: "auto 0" }}
          />
          <Typography fontSize={14} fontWeight={400} color="#000000">
            Change Template
          </Typography>
        </Stack>

        <PdfButton />
        <MoreButton onDeleteInvoice={handleDeleteInvoice} />
      </Stack>

      {/* Main */}
      <TemplateOne itemInvoice={itemInvoice} user={user} isEdit={isEdit} />
    </Stack>
  );
};

const sxConfig = {
  input: {
    height: 46,
  },
};

export default memo(TabInvoice);
