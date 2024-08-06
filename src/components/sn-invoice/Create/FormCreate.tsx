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
import { Button, DatePicker } from "components/shared";
import { DEFAULT_PAGING } from "constant/index";
import { INVOICES_PATH } from "constant/paths";
import { useFormik } from "formik";
import useQueryParams from "hooks/useQueryParams";
import CloseIcon from "icons/CloseIcon";
import PlusIcon from "icons/PlusIcon";
import { memo, useEffect, useState } from "react";
import { useAuth } from "store/app/selectors";
import { useBudgets } from "store/billing/selectors";
import { useClientCompanies } from "store/company/selectors";
import { useInvoices } from "store/invoice/selectors";
// import useExportDeal from "../hooks/useExportDeal";
import * as Yup from "yup";

const initRow = {
  service_name: null,
  quantity: null,
  rate: null,
  discount: null,
  amount: 0,
};

const FormCreate = () => {
  const { items, onGetClientCompanies } = useClientCompanies();
  const { initQuery, isReady, query } = useQueryParams();
  const { onGetBudgets, budgets } = useBudgets();
  const { onCreateNewInvoice } = useInvoices();
  const { user } = useAuth();
  const [total, setTotal] = useState(0);
  const formik = useFormik({
    initialValues: {
      customer_name: "",
      budget_name: "",
      subject: "",
      invoice_date: "",
      service_items: [initRow],
      total: 0,
      note: "",
      payment_items: [
        {
          payment_method: "Paypal",
          payment_link: "https://paypal.com",
        },
      ],
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
            "& .MuiOutlinedInput-root.Mui-focused fieldset": {},
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
              disabled
              sx={{
                "& .MuiInputBase-root.MuiOutlinedInput-root ": {
                  borderRadius: "100px",
                },
              }}
              value={formik.values.payment_items[0].payment_method}
              fullWidth
            ></TextField>
          </Box>

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
              disabled
              sx={{
                "& .MuiInputBase-root.MuiOutlinedInput-root ": {
                  borderRadius: "100px",
                },
              }}
              value={formik.values.payment_items[0].payment_link}
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
            <TableBody>
              {formik.values.service_items.map((row, index) => (
                <TableRow
                  key={index}
                  sx={
                    {
                      // "&:last-child td, &:last-child th": { border: 0 },
                      // border: "1px solid #878787",
                    }
                  }
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
                        handleChange(`service_items[${index}].service_name`, "")
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
              ))}
            </TableBody>
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
            {total}
          </Typography>
        </Box>
      </Box>
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
            cursor: "pointer",
            color: "#0575E6",
            fontWeight: "700",
            fontSize: "14px",
          }}
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
            cursor: "pointer",
            color: "#FFFFFF",
            fontWeight: "700",
            fontSize: "14px",
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
