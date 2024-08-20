import { ContentCopyRounded } from "@mui/icons-material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Box,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { IconButton, Text } from "components/shared";
import { NS_BILLING, NS_COMMON } from "constant/index";
import { User } from "constant/types";
import { FormikProps, useFormik } from "formik";
import ChangeTemplateIcon from "icons/ChangeTemplateIcon";
import EditIcon from "icons/EditIcon";
import FilePdfIcon from "icons/FilePdfIcon";
import MarkAsSendIcon from "icons/MarkAsSendIcon";
import PdfIcon from "icons/PdfIcon";
import ShareInvoiceIcon from "icons/ShareInvoiceIcon";
import TrashIcon from "icons/TrashIcon";
import { useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";
import { useParams } from "next/navigation";
import { memo, useEffect, useState } from "react";
import { Bill, Billing, Budgets } from "store/billing/reducer";
import { useBillings } from "store/billing/selectors";
import { Invoice } from "store/invoice/reducer";
import { useInvoices } from "store/invoice/selectors";
import { formatDate } from "utils/index";
import TemplateOne from "./TemplateOne";
const ITEM_HEIGHT = 48;

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
  const { item: itemInvoice, onGetInvoiceDetail } = useInvoices();
  const { id } = useParams();
  const commonT = useTranslations(NS_COMMON);
  const billingT = useTranslations(NS_BILLING);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [isEdit, setIsEdit] = useState(false);

  const options = [
    billingT("detail.form.top.button.option.deleteInvoice"),
    billingT("detail.form.top.button.option.duplicateInvoice"),
  ];
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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
      action: () => {},
    },
    {
      icon: (
        <ShareInvoiceIcon
          sx={{ width: "12px", height: "12px", margin: "auto 0" }}
        />
      ),
      title: "Share",
      action: () => {},
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
          <PdfIcon sx={{ width: "12px", height: "12px", margin: "auto 0" }} />
          <Typography fontSize={14} fontWeight={400} color="#000000">
            PDF/Print
          </Typography>
        </Stack>

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
          <IconButton
            aria-label="more"
            id="long-button"
            aria-controls={open ? "long-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
            aria-haspopup="true"
            onClick={handleClick}
          >
            <MoreVertIcon sx={{ height: "24px" }} />
          </IconButton>
          <Menu
            id="long-menu"
            MenuListProps={{
              "aria-labelledby": "long-button",
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              style: {
                maxHeight: ITEM_HEIGHT * 4.5,
                width: "25ch",
              },
            }}
          >
            {options.map((option) => (
              <MenuItem
                key={option}
                selected={option === "Pyxis"}
                onClick={handleClose}
              >
                {option ===
                billingT("detail.form.top.button.option.duplicateInvoice") ? (
                  <Stack gap={2} direction={"row"} alignItems={"center"}>
                    <ContentCopyRounded />
                    <Text variant={"body2"}>
                      {billingT(
                        "detail.form.top.button.option.duplicateInvoice",
                      )}
                    </Text>
                  </Stack>
                ) : (
                  <Stack
                    gap={2}
                    direction={"row"}
                    alignItems={"center"}
                    color={"red"}
                  >
                    <TrashIcon />
                    <Text variant={"body2"} color={"red"}>
                      {billingT("detail.form.top.button.option.deleteInvoice")}
                    </Text>
                  </Stack>
                )}
              </MenuItem>
            ))}
          </Menu>
        </Stack>
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
