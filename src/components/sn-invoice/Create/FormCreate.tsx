"use client";
import {
  Box,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableContainer,
  TextField,
  Typography,
} from "@mui/material";
import { Endpoint } from "api";
import { Button, DatePicker } from "components/shared";
import { DEFAULT_PAGING } from "constant/index";
import { INVOICES_PATH } from "constant/paths";
import { useFormik } from "formik";
import useQueryParams from "hooks/useQueryParams";
import PlusIcon from "icons/PlusIcon";
import { memo, useEffect, useState } from "react";
import { useAuth, useHeaderConfig, useSnackbar } from "store/app/selectors";
import { useBudgets, useServiceBudgets } from "store/billing/selectors";
import { useClientCompanies, useMyCompany } from "store/company/selectors";
import { useInvoices } from "store/invoice/selectors";
// import useExportDeal from "../hooks/useExportDeal";
import { ArrowDropDownIcon } from "@mui/x-date-pickers";
import NewPaymentMethodIcon from "icons/NewPaymentMethodIcon";
import Image from "next/image";
import { useRouter } from "next/navigation";
import NewInvoiceIcon from "public/images/new-invoice.svg";
import { uuid } from "utils/index";
import * as Yup from "yup";
import BodyTable from "./BodyTable";
import NewPaymentModal from "./NewPaymentModal";
import TopTable from "./TopTable";
import InvoiceInfor from "./InvoiceInfor";

const ITEM_HEIGHT = 48;

const initRow = {
  service_name: null,
  quantity: null,
  rate: null,
  discount: null,
  amount: 0,
  _id: uuid(),
  description: null,
  typeRowTwo: false,
};

const initPaymentItem = [
  {
    payment_method: "Stripe",
    payment_link: "https://stripe.com/",
    icon: "/images/stripe-icon.png",
  },
  {
    payment_method: "Paypal",
    payment_link: "https://paypal.com",
    icon: "/images/paypal-icon.png",
  },
  {
    payment_method: "Payoneer",
    payment_link: "https://payoneer.com/",
    icon: "/images/payoneer-icon.png",
  },
];

const FormCreate = () => {
  const { push } = useRouter();
  const { items, onGetClientCompanies } = useClientCompanies();
  const { onGetCompany, item: itemCompany } = useMyCompany();
  const { initQuery, isReady, query } = useQueryParams();
  const { onGetBudgets, budgets } = useBudgets();
  const { arrService, sumAmount, onGetServiceBudgets } = useServiceBudgets();
  const { onCreateNewInvoice } = useInvoices();
  const { onAddSnackbar } = useSnackbar();
  const { user } = useAuth();
  const [total, setTotal] = useState(0);
  const [paymentSelected, setPaymentSelected] = useState(0);
  const [open, setOpen] = useState(false);
  const [rowTwo, setRowTwo] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openNewRow = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const formik = useFormik({
    initialValues: {
      customer_name: "",
      budget_name: "",
      subject: "",
      invoice_date: "",
      service_items: [initRow],
      total: 0,
      note: "",
      payment_items: initPaymentItem,
      tags: "CREDIT",
      due_date: "",
      invoice_number: "",
    },
    validationSchema: Yup.object().shape({
      customer_name: Yup.string().trim().required("Required"),
      budget_name: Yup.string().required("Required"),
      invoice_date: Yup.string().required("Required"),
      invoice_number: Yup.string().required("Required"),
    }),
    onSubmit: async (formData) => {
      try {
        await onCreateNewInvoice(formData);

        push(INVOICES_PATH);
      } catch (er) {
        console.log(er);
      }
    },
  });

  useEffect(() => {
    if (!formik.dirty) {
      formik.setErrors({});
    }
  }, [formik]);

  useEffect(() => {
    onGetCompany();
    onGetClientCompanies({ ...DEFAULT_PAGING, pageSize: 50 });
    onGetBudgets({ ...initQuery });
  }, []);

  useEffect(() => {
    onGetServiceBudgets(formik.values.budget_name ?? "");
  }, [onGetServiceBudgets, formik.values.budget_name]);

  console.log("test", budgets);

  useEffect(() => {
    let prev = 0;
    formik.values.service_items.forEach((service, index) => {
      const amount =
        ((Number(service.rate) ?? 0) + (Number(service.quantity) ?? 0)) *
        (Number(service.discount) ?? 0);
      prev += amount;
      if (amount != Number(formik.values.service_items[index].amount)) {
        handleChange(`service_items[${index}].amount`, amount);
      }
    });
    handleChange("total", prev);
  }, [formik.values]);

  const handleChange = (name, value) => {
    if (name.includes("discount")) {
      if (Number(value) > 100) value = 100;
      if (Number(value) < 0) value = 0;
    }

    formik.setFieldValue(name, value);
  };

  const handleShowTotal = () => {
    setShowSummary((prev) => !prev);
  };

  useEffect(() => {
    setTotal(formik.values.total);
  }, [formik.values.total]);

  const { onUpdateHeaderConfig } = useHeaderConfig();

  useEffect(() => {
    onUpdateHeaderConfig({
      title: "New Invoice",
      endpoint: Endpoint.NEW_INVOICE,
      prevPath: Endpoint.INVOICE,
      imageUrl: NewInvoiceIcon.src,
    });
    return () => {
      onUpdateHeaderConfig({
        title: undefined,
        searchPlaceholder: undefined,
        prevPath: undefined,
        endpoint: undefined,
        key: undefined,
      });
    };
  }, [onUpdateHeaderConfig]);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.droppableId !== destination.droppableId) {
      return;
    } else {
      const copiedItems = formik.values.service_items;
      const [removed] = copiedItems.splice(source.index, 1);

      copiedItems.splice(destination.index, 0, removed);
      handleChange("service_items", copiedItems);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#F7F7FD",
        padding: "30px 20px",
        display: "flex",
        flexDirection: "column",
        gap: "32px",
        overflowY: "auto",
        height: "95vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography
          color="#FF2C56"
          fontSize={14}
          fontWeight={700}
          sx={{ minWidth: "154px", paddingLeft: "24px" }}
        >
          Client*
        </Typography>
        <TextField
          select
          required
          error={Boolean(formik.errors?.customer_name)}
          sx={{
            "& .MuiInputBase-root.MuiOutlinedInput-root ": {
              borderRadius: "100px",
              background: "#ffffff",
            },
            "& .MuiSelect-select.MuiInputBase-input.MuiOutlinedInput-input ": {
              padding: "6px 30px",
            },
            boxShadow: "none",
            ".MuiOutlinedInput-notchedOutline": {
              border: "1px solid #EFEFEF !important",
            },
            "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
              border: "1px solid #EFEFEF !important",
            },
            "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                border: "1px solid #EFEFEF !important",
              },
            width: "600px",
          }}
          SelectProps={{
            IconComponent: () => (
              <Image
                src="/images/dropdown-select-icon.svg"
                alt=""
                width={18}
                height={18}
                style={{ marginRight: "30px", cursor: "pointer" }}
              />
            ),
          }}
        >
          {items.map((client) => (
            <MenuItem
              key={client?.id}
              value={client?.id}
              onClick={() => handleChange("customer_name", client?.id)}
            >
              {client.name}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography
          color="#FF2C56"
          fontSize={14}
          fontWeight={700}
          sx={{ minWidth: "154px", paddingLeft: "24px" }}
        >
          Budget*
        </Typography>
        <TextField
          select
          required
          error={Boolean(formik.errors?.budget_name)}
          sx={{
            "& .MuiInputBase-root.MuiOutlinedInput-root ": {
              borderRadius: "100px",
              background: "#ffffff",
            },
            "& .MuiSelect-select.MuiInputBase-input.MuiOutlinedInput-input ": {
              padding: "6px 30px",
            },
            width: "600px",
            boxShadow: "none",
            ".MuiOutlinedInput-notchedOutline": {
              border: "1px solid #EFEFEF !important",
            },
            "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
              border: "1px solid #EFEFEF !important",
            },
            "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                border: "1px solid #EFEFEF !important",
              },
          }}
          SelectProps={{
            IconComponent: () => (
              <Image
                src="/images/dropdown-select-icon.svg"
                alt=""
                width={18}
                height={18}
                style={{ marginRight: "30px", cursor: "pointer" }}
              />
            ),
          }}
        >
          {(budgets ?? []).map((budget) => (
            <MenuItem
              key={budget.id}
              value={budget.id}
              onClick={() => handleChange("budget_name", budget?.id)}
            >
              {budget.name}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography
          color="#FF2C56"
          fontSize={14}
          fontWeight={700}
          sx={{ minWidth: "154px", paddingLeft: "24px" }}
        >
          Bill from*
        </Typography>
        <TextField
          disabled
          multiline
          minRows={4}
          sx={{
            "& .MuiInputBase-root.MuiOutlinedInput-root ": {
              borderRadius: "12px",
              background: "rgba(249, 241, 241, 0.41)",
              padding: "8px",
            },
            "& .MuiInputBase-input.MuiOutlinedInput-input ": {
              "-webkit-text-fill-color": "#21263C !important",
              fontWeight: 700,
              fontSize: "14px",
            },
            width: "600px",
            color: "rgba(33, 38, 60, 1)",
          }}
          value={`Company ${itemCompany?.name}\n\nTax ID: ${itemCompany?.tax_code}`}
        ></TextField>
        {/* <EditBillFromIcon
          sx={{
            position: "absolute",
            bottom: 12,
            right: 32,
            height: "15px",
            cursor: "pointer",
          }}
        /> */}
      </Box>

      <InvoiceInfor
        formik={formik}
        handleChange={handleChange}
        paymentSelected={paymentSelected}
        setPaymentSelected={setPaymentSelected}
        setOpen={setOpen}
        open={open}
      />

      {/* table */}
      <Box>
        <Box
          sx={{
            padding: "12px",
            display: "flex",
            justifyContent: "space-between",
            background: "#D9F0FD",
            borderTopLeftRadius: "10px",
            borderTopRightRadius: "10px",
            width: "calc(100% - 70px)",
            alignItems: "center",
          }}
        >
          <Typography fontSize={20} fontWeight={600} color="#0575E6">
            Item Table
          </Typography>
        </Box>
        <TableContainer
          component={Paper}
          sx={{ boxShadow: "none", width: "100%", marginLeft: "-20px" }}
        >
          <Table
            sx={{ minWidth: 650, border: "none" }}
            aria-label="simple table"
          >
            <TopTable />

            <BodyTable
              onDragEnd={onDragEnd}
              formik={formik}
              handleChange={handleChange}
              arrService={arrService}
            />
          </Table>
        </TableContainer>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "calc(100% - 70px)",
        }}
      >
        <Button
          variant="contained"
          sx={{
            textDecoration: "none",
            display: "flex",
            background: "#D9F0FD",
            boxShadow: "none",
            padding: "6px 12px !important",
          }}
          onClick={() =>
            handleChange("service_items", [
              ...formik.values.service_items,
              { ...initRow, _id: uuid() },
            ])
          }
        >
          <PlusIcon
            sx={{
              color: "white",
              mr: 1,
              background: "#188DFA",
              borderRadius: "16px",
            }}
          />
          <Typography fontWeight={700} fontSize={14} color={"#333333"}>
            Add new row
          </Typography>
        </Button>
        <Box
          onClick={handleClick}
          sx={{
            backgroundColor: "#D9F0FD",
            borderLeft: "1px solid #BDE4FB",
            width: "fit-content",
            marginRight: "auto",
            display: "flex",
            alignItems: "center",
            padding: "0 4px",
            cursor: "pointer",
          }}
          id="long-button"
          aria-controls={openNewRow ? "long-menu" : undefined}
          aria-expanded={openNewRow ? "true" : undefined}
          aria-haspopup="true"
        >
          <ArrowDropDownIcon sx={{ color: "#212529" }} />
        </Box>
        <Menu
          id="long-menu"
          MenuListProps={{
            "aria-labelledby": "long-button",
          }}
          anchorEl={anchorEl}
          open={openNewRow}
          onClose={handleClose}
          PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
            },
          }}
        >
          <MenuItem
            onClick={() => {
              if (formik.values.budget_name) {
                handleChange("service_items", [
                  ...formik.values.service_items,
                  { ...initRow, _id: uuid(), typeRowTwo: true },
                ]);
              } else {
                onAddSnackbar("Select budget to select services", "error");
              }
            }}
          >
            Add a select service row
          </MenuItem>
        </Menu>
        <Box
          sx={{
            background: "#ffffff",
            padding: "12px 24px",
            width: "35%",
            display: "flex",
            justifyContent: "space-between",
            borderRadius: "100px",
            border: "1px solid #EFEFEF",
            alignItems: "center",
            height: "35px",
          }}
        >
          <Typography
            color="#666666"
            fontSize={16}
            fontWeight={400}
          >{`Total ( VND )`}</Typography>
          <Typography color="#666666" fontSize={16} fontWeight={400}>
            {Number((total * 110) / 100).toFixed(2)}
          </Typography>
        </Box>
      </Box>
      {showSummary && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row-reverse",
            width: "calc(100% - 70px)",
            marginTop: "-32px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              alignItems: "flex-end",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                borderRadius: "100px",
                alignItems: "center",
                width: "150px",
              }}
            >
              <Typography
                color="#666666"
                fontSize={16}
                fontWeight={400}
              >{`Sub total: `}</Typography>
              <Typography color="#666666" fontSize={16} fontWeight={700}>
                {total}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                borderRadius: "100px",
                alignItems: "center",
                width: "150px",
              }}
            >
              <Typography
                color="#666666"
                fontSize={16}
                fontWeight={400}
              >{`VAT`}</Typography>
              <Typography color="#666666" fontSize={16} fontWeight={700}>
                {Number((total * 10) / 100).toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      <Box
        sx={{
          display: "flex",
          flexDirection: "row-reverse",
          width: "calc(100% - 70px)",
          marginTop: "-32px",
        }}
      >
        <Typography
          color="#0575E6"
          sx={{ cursor: "pointer" }}
          onClick={handleShowTotal}
          fontSize={14}
        >
          Show Total Summary
        </Typography>
      </Box>

      <Box>
        <Typography fontSize={20} fontWeight={700}>
          Customer Notes
        </Typography>
        <TextField
          name={`note`}
          value={formik.values.note}
          fullWidth
          onChange={(e) => handleChange("note", e.target.value)}
          variant="outlined"
          multiline
          minRows={3}
          sx={{
            "& .MuiInputBase-root.MuiOutlinedInput-root ": {
              borderRadius: "12px",
              background: "#ffffff",
              color: "#999999",
              fontWeight: "700",
            },
            width: "70%",
            marginTop: "16px",
          }}
          placeholder="The message displayed on the invoice"
        />
      </Box>

      <Box sx={{ display: "flex", gap: "16px" }}>
        <Box
          borderRadius="9999px"
          sx={{
            background: "#D9F0FD",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "12px 24px",
            width: "fit-content",
            cursor:
              formik.dirty && Object.keys(formik.errors).length === 0
                ? "pointer"
                : "auto",
            color: "#0575E6",
            fontWeight: "700",
            fontSize: "14px",
            opacity:
              formik.dirty && Object.keys(formik.errors).length === 0 ? 1 : 0.5,
          }}
          onClick={() => formik.handleSubmit()}
        >
          Save as Draft
        </Box>
        <Box
          borderRadius="9999px"
          sx={{
            backgroundImage: "linear-gradient(to right, #2AF598, #009EFD)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "12px 24px",
            width: "fit-content",
            cursor:
              formik.dirty && Object.keys(formik.errors).length === 0
                ? "pointer"
                : "auto",
            color: "#FFFFFF",
            fontWeight: "700",
            fontSize: "14px",
            opacity:
              formik.dirty && Object.keys(formik.errors).length === 0 ? 1 : 0.5,
          }}
          onClick={() => formik.handleSubmit()}
        >
          Save as send
        </Box>
        <Button
          href={INVOICES_PATH}
          variant="primaryOutlined"
          sx={{ borderRadius: "100px" }}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default memo(FormCreate);
