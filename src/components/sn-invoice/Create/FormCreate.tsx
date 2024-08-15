"use client";
import {
  Box,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Endpoint } from "api";
import { Button, DatePicker } from "components/shared";
import { DEFAULT_PAGING } from "constant/index";
import { INVOICES_PATH } from "constant/paths";
import { useFormik } from "formik";
import useQueryParams from "hooks/useQueryParams";
import CloseIcon from "icons/CloseIcon";
import PlusIcon from "icons/PlusIcon";
import { memo, useEffect, useState } from "react";
import { useAuth, useHeaderConfig } from "store/app/selectors";
import { useBudgets } from "store/billing/selectors";
import { useClientCompanies } from "store/company/selectors";
import { useInvoices } from "store/invoice/selectors";
// import useExportDeal from "../hooks/useExportDeal";
import NewInvoiceIcon from "public/images/new-invoice.svg";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import * as Yup from "yup";
import NewPaymentModal from "./NewPaymentModal";

const initRow = {
  service_name: null,
  quantity: null,
  rate: null,
  discount: null,
  amount: 0,
};

const initPaymentItem = [
  {
    payment_method: "Stripe",
    payment_link: "https://stripe.com/",
  },
  {
    payment_method: "Paypal",
    payment_link: "https://paypal.com",
  },
  {
    payment_method: "Payoneer",
    payment_link: "https://payoneer.com/",
  },
];

const FormCreate = () => {
  const { items, onGetClientCompanies } = useClientCompanies();
  const { initQuery, isReady, query } = useQueryParams();
  const { onGetBudgets, budgets } = useBudgets();
  const { onCreateNewInvoice } = useInvoices();
  const { user } = useAuth();
  const [total, setTotal] = useState(0);
  const [paymentSelected, setPaymentSelected] = useState(0);
  const [open, setOpen] = useState(false);

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
    },
    validationSchema: Yup.object().shape({
      customer_name: Yup.string().trim().required("Required"),
      budget_name: Yup.string().required("Required"),
      invoice_date: Yup.string().required("Required"),
    }),
    onSubmit: async (formData) => {
      try {
        await onCreateNewInvoice({
          ...formData,
          invoice_number: formData.customer_name,
        });
        window.location.href = "/invoices";
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
    onGetClientCompanies({ ...DEFAULT_PAGING, pageSize: 50 });
    onGetBudgets({ ...initQuery });
  }, []);

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
    setTotal(formik.values.total);
  };

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
      console.log(
        "🚀 ~ onDragEnd ~ copiedItems:",
        copiedItems.length,
        copiedItems,
      );

      copiedItems.splice(destination.index, 0, removed);
      console.log("🚀 ~ onDragEnd ~ copiedItems:", copiedItems);
      handleChange("service_items", copiedItems);
    }
  };
  console.log("stfdfsd", formik.values);

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
          sx={{ minWidth: "120px" }}
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
              border: "1px solid #EFEFEF",
            },
            "& .MuiSelect-select.MuiInputBase-input.MuiOutlinedInput-input ": {
              padding: "10px 30px",
            },
            width: "50%",
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
          sx={{ minWidth: "120px" }}
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
              padding: "10px 30px",
            },
            width: "50%",
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
          sx={{ minWidth: "120px" }}
        >
          Bill from*
        </Typography>
        <TextField
          disabled
          multiline
          minRows={3}
          sx={{
            "& .MuiInputBase-root.MuiOutlinedInput-root ": {
              borderRadius: "12px",
              background: "rgba(249, 241, 241, 0.41)",
              padding: "10px 30px",
            },
            width: "50%",
            color: "rgba(33, 38, 60, 1)",
          }}
          value={`Company ${user?.company}`}
        ></TextField>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          padding: "24px",
          background: "#ffffff",
          borderRadius: "12px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Typography
            color="#FF2C56"
            fontSize={14}
            fontWeight={700}
            sx={{ minWidth: "120px" }}
          >
            Invoice Date*
          </Typography>

          <DatePicker
            name="invoice_date"
            onBlur={formik.handleBlur}
            value={formik.values?.invoice_date}
            error={formik.errors?.invoice_date}
            onChange={handleChange}
            // error={commonT(touchedErrors?.start_date, {
            //   name: commonT("form.title.startDate"),
            // })}
            sx={{
              "& .MuiInputBase-root.MuiOutlinedInput-root ": {
                border: "1px solid rgba(0, 0, 0, 0.38)",
                borderRadius: "100px",
                background: "#ffffff",
                padding: "8px 30px",
              },
              width: "72%",
            }}
          />
          <Box sx={{ display: "flex", alignItems: "center", gap: "32px" }}>
            <Typography color="#212529" fontSize={14} fontWeight={400}>
              Due Date
            </Typography>

            <DatePicker
              name="due_date"
              value={formik.values.due_date}
              onChange={handleChange}
              sx={{
                "& .MuiInputBase-root.MuiOutlinedInput-root ": {
                  border: "1px solid rgba(0, 0, 0, 0.38)",
                  borderRadius: "100px",
                  background: "#ffffff",
                  padding: "8px 30px",
                },
                width: "fit-content",
              }}
            />
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography
            color="#212529"
            fontSize={14}
            fontWeight={700}
            sx={{ minWidth: "130px" }}
          >
            Subject
          </Typography>
          <TextField
            sx={{
              "& .MuiInputBase-root.MuiOutlinedInput-root ": {
                borderRadius: "100px",
              },
              "& .MuiInputBase-input.MuiOutlinedInput-input": {
                padding: "10px 30px",
              },
              width: "50%",
            }}
            name="subject"
            onChange={(e) => handleChange("subject", e.target.value)}
            value={formik.values.subject}
          ></TextField>
        </Box>
        <Box sx={{ display: "flex", gap: "32px" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "50%",
            }}
          >
            <Typography
              color="#212529"
              fontSize={14}
              fontWeight={700}
              sx={{ minWidth: "130px" }}
            >
              Payment method
            </Typography>
            <TextField
              select
              sx={{
                "& .MuiInputBase-root.MuiOutlinedInput-root ": {
                  borderRadius: "100px",
                },
                "& .MuiSelect-select.MuiInputBase-input.MuiOutlinedInput-input ":
                  {
                    padding: "10px 30px",
                  },
              }}
              value={
                formik.values.payment_items[paymentSelected]?.payment_method
              }
              fullWidth
            >
              {(formik.values.payment_items ?? []).map((payment, index) => (
                <MenuItem
                  key={index}
                  value={payment?.payment_method}
                  onClick={() => setPaymentSelected(index)}
                >
                  <Typography color="#212121" fontWeight={700} fontSize={14}>
                    {payment?.payment_method}
                  </Typography>
                </MenuItem>
              ))}
              <MenuItem key={100}>
                <Typography
                  onClick={() => setOpen(true)}
                  color="#408DFB"
                  fontWeight={700}
                  fontSize={14}
                >
                  New payment method
                </Typography>
              </MenuItem>
            </TextField>
          </Box>
          <NewPaymentModal
            open={open}
            setOpen={setOpen}
            handleChange={(value) => {
              handleChange("payment_items", [
                ...formik.values.payment_items,
                {
                  payment_method: value,
                  payment_link: "",
                },
              ]);
              setOpen(false);
            }}
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "50%",
              gap: "32px",
            }}
          >
            <Typography color="#212529" fontSize={14} fontWeight={700}>
              Link
            </Typography>
            <TextField
              sx={{
                "& .MuiInputBase-root.MuiOutlinedInput-root ": {
                  borderRadius: "100px",
                },
                "& .MuiInputBase-input.MuiOutlinedInput-input": {
                  padding: "10px 30px",
                },
              }}
              value={formik.values.payment_items[paymentSelected]?.payment_link}
              onChange={(e) =>
                handleChange(
                  `payment_items[${paymentSelected}].payment_link`,
                  e.target.value,
                )
              }
              fullWidth
            ></TextField>
          </Box>
        </Box>
      </Box>
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
            width: "95%",
            alignItems: "center",
          }}
        >
          <Typography fontSize={20} fontWeight={600} color="#0575E6">
            Item Table
          </Typography>
          <Box>
            <Typography
              fontSize={12}
              fontWeight={500}
              color="#0575E6"
              sx={{ margin: "auto 0" }}
            >
              Enhance Your Invoices
            </Typography>
          </Box>
        </Box>
        <TableContainer
          component={Paper}
          sx={{ boxShadow: "none", width: "95%" }}
        >
          <Table
            sx={{ minWidth: 650, border: "none" }}
            aria-label="simple table"
          >
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    color: "#222222",
                    fontSize: "14px",
                    fontWeight: 600,
                    border: "1px solid #EBEAF2",
                  }}
                >
                  ITEM DETAILS
                </TableCell>
                <TableCell
                  sx={{
                    color: "#222222",
                    fontSize: "14px",
                    fontWeight: 600,
                    border: "1px solid #EBEAF2",
                  }}
                  align="right"
                >
                  UNIT
                </TableCell>
                <TableCell
                  sx={{
                    color: "#222222",
                    fontSize: "14px",
                    fontWeight: 600,
                    border: "1px solid #EBEAF2",
                  }}
                  align="right"
                >
                  QUANTITY
                </TableCell>
                <TableCell
                  sx={{
                    color: "#222222",
                    fontSize: "14px",
                    fontWeight: 600,
                    border: "1px solid #EBEAF2",
                  }}
                  align="right"
                >
                  RATE
                </TableCell>
                <TableCell
                  sx={{
                    color: "#222222",
                    fontSize: "14px",
                    fontWeight: 600,
                    border: "1px solid #EBEAF2",
                  }}
                  align="right"
                >
                  DISCOUNT
                </TableCell>
                <TableCell
                  sx={{
                    color: "#222222",
                    fontSize: "14px",
                    fontWeight: 600,
                    border: "1px solid #EBEAF2",
                  }}
                  align="right"
                >
                  AMOUNT
                </TableCell>
              </TableRow>
            </TableHead>

            <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
              <Droppable key={1} droppableId="1">
                {(provided, snapshot) => (
                  <TableBody
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {formik.values.service_items.map((row, index) => (
                      <Draggable
                        key={index}
                        draggableId={String(index)}
                        index={index}
                      >
                        {(provided) => (
                          <TableRow
                            key={index}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{
                              width: "600px",
                            }}
                          >
                            <TableCell
                              sx={{
                                color: "#495057 !important",
                                fontSize: "14px",
                                fontWeight: 400,
                                border: "1px solid #EBEAF2",
                                position: "relative",
                                paddingRight: "24px",
                              }}
                              align="left"
                            >
                              <TextField
                                name={`service_items[${index}].service_name`}
                                value={row.service_name}
                                onChange={(e) =>
                                  handleChange(
                                    `service_items[${index}].service_name`,
                                    e.target.value,
                                  )
                                }
                                placeholder="Type or click to select an item."
                                fullWidth
                                variant="standard"
                                InputProps={{
                                  disableUnderline: true,
                                  inputProps: {
                                    style: { textAlign: "left" },
                                  },
                                }}
                              />
                              <CloseIcon
                                sx={{
                                  position: "absolute",
                                  right: "4px",
                                  top: "6px",
                                  border: "1px solid #878787",
                                  borderRadius: "16px",
                                  padding: "2px",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  handleChange(
                                    `service_items[${index}].service_name`,
                                    "",
                                  )
                                }
                              />
                            </TableCell>
                            <TableCell
                              component="th"
                              scope="row"
                              sx={{
                                color: "#495057 !important",
                                fontSize: "14px",
                                fontWeight: 400,
                                border: "1px solid #EBEAF2",
                              }}
                              align="right"
                            >
                              Hour
                            </TableCell>
                            <TableCell
                              sx={{
                                color: "#495057 !important",
                                fontSize: "14px",
                                fontWeight: 400,
                                border: "1px solid #EBEAF2",
                              }}
                              align="right"
                            >
                              <TextField
                                name={`service_items[${index}].quantity`}
                                value={row.quantity}
                                type="number"
                                onChange={(e) =>
                                  handleChange(
                                    `service_items[${index}].quantity`,
                                    e.target.value,
                                  )
                                }
                                fullWidth
                                variant="standard"
                                InputProps={{
                                  disableUnderline: true,
                                  inputProps: {
                                    style: { textAlign: "right" },
                                  },
                                }}
                                sx={{
                                  "input::-webkit-outer-spin-button, input::-webkit-inner-spin-button":
                                    {
                                      WebkitAppearance: "none",
                                      margin: 0,
                                    },
                                }}
                              />
                            </TableCell>
                            <TableCell
                              sx={{
                                color: "#495057 !important",
                                fontSize: "14px",
                                fontWeight: 400,
                                border: "1px solid #EBEAF2",
                              }}
                              align="right"
                            >
                              <TextField
                                name={`service_items[${index}].rate`}
                                value={row.rate}
                                type="number"
                                fullWidth
                                onChange={(e) =>
                                  handleChange(
                                    `service_items[${index}].rate`,
                                    e.target.value,
                                  )
                                }
                                variant="standard"
                                InputProps={{
                                  disableUnderline: true,
                                  inputProps: {
                                    style: { textAlign: "right" },
                                  },
                                }}
                                sx={{
                                  "input::-webkit-outer-spin-button, input::-webkit-inner-spin-button":
                                    {
                                      WebkitAppearance: "none",
                                      margin: 0,
                                    },
                                }}
                              />
                            </TableCell>
                            <TableCell
                              sx={{
                                color: "#495057 !important",
                                fontSize: "14px",
                                fontWeight: 400,
                                border: "1px solid #EBEAF2",
                                position: "relative",
                                paddingRight: "24px",
                              }}
                              align="right"
                            >
                              <TextField
                                name={`service_items[${index}].discount`}
                                value={row.discount}
                                type="number"
                                fullWidth
                                onChange={(e) =>
                                  handleChange(
                                    `service_items[${index}].discount`,
                                    e.target.value,
                                  )
                                }
                                variant="standard"
                                InputProps={{
                                  disableUnderline: true,
                                  inputProps: {
                                    style: { textAlign: "right" },
                                    max: 100,
                                    min: 0,
                                  },
                                }}
                                sx={{
                                  "input::-webkit-outer-spin-button, input::-webkit-inner-spin-button":
                                    {
                                      WebkitAppearance: "none",
                                      margin: 0,
                                    },
                                }}
                              />
                              <Box
                                sx={{
                                  position: "absolute",
                                  right: "4px",
                                  top: "calc(50% - 10px)",
                                }}
                              >
                                %
                              </Box>
                            </TableCell>
                            <TableCell
                              sx={{
                                color: "#495057 !important",
                                fontSize: "14px",
                                fontWeight: 400,
                                border: "1px solid #EBEAF2",
                                position: "relative",
                              }}
                              align="right"
                            >
                              {row.amount}
                            </TableCell>
                          </TableRow>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </TableBody>
                )}
              </Droppable>
            </DragDropContext>
          </Table>
        </TableContainer>
      </Box>

      <Box
        sx={{ display: "flex", justifyContent: "space-between", width: "95%" }}
      >
        {/* <Button
          variant="primary"
          type="button"
          onClick={() =>
            handleChange("service_items", [
              ...formik.values.service_items,
              initRow,
            ])
          }
        >
          Add new row
        </Button> */}
        <Button
          variant="contained"
          sx={{
            textDecoration: "none",
            display: "flex",
            background: "#D9F0FD",
            boxShadow: "none",
            padding: "6px 32px 6px 12px !important",
          }}
          onClick={() =>
            handleChange("service_items", [
              ...formik.values.service_items,
              initRow,
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
          sx={{
            background: "#ffffff",
            padding: "12px 24px",
            width: "35%",
            display: "flex",
            justifyContent: "space-between",
            borderRadius: "100px",
            border: "1px solid #EFEFEF",
            alignItems: "center",
          }}
        >
          <Typography
            color="#666666"
            fontSize={16}
            fontWeight={400}
          >{`Total ( VND )`}</Typography>
          <Typography color="#666666" fontSize={16} fontWeight={400}>
            {Number((total * 105) / 100).toFixed(2)}
          </Typography>
        </Box>
      </Box>
      {
        <Box
          sx={{
            display: "flex",
            flexDirection: "row-reverse",
            width: "95%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "95%",
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
                {Number((total * 5) / 100).toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </Box>
      }

      <Box sx={{ display: "flex", flexDirection: "row-reverse", width: "95%" }}>
        <Typography
          color="#0575E6"
          sx={{ cursor: "pointer" }}
          onClick={handleShowTotal}
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
