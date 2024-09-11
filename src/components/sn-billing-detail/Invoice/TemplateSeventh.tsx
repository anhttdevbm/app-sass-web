import {
  Box,
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { CURRENCY_SYMBOL } from "components/sn-sales/helpers";
import { CURRENCY_CODE } from "constant/enums";
import { User } from "constant/types";
import { useFormik } from "formik";
import { memo, PropsWithChildren, useEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Invoice } from "store/invoice/reducer";
import { formatDate, formatNumber } from "utils/index";
import { makeStyles, Theme } from "@mui/material/styles";

type Props = {
  user?: User;
  itemInvoice?: Invoice;
  isEdit?: Boolean;
  handleChange: (field, value) => void;
  onDragEnd: (result) => void;
  formik?: any;
};

function TemplateSeventh({
  user,
  itemInvoice,
  isEdit,
  formik,
  handleChange,
  onDragEnd,
}: PropsWithChildren<Props>) {
  return (
    <Stack sx={{ border: "1px solid #EFEFEF" }} mt={4} pt={4} px={5}>
      <Stack
        p={4}
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          background: "#FAFAFA",
        }}
      >
        <Stack
          direction="row"
          sx={{
            height: "fit-content",
            paddingY: 1,
          }}
        >
          <Stack direction="column" gap={1}>
            <Typography
              color="#212529"
              minWidth={150}
              fontSize={14}
              fontWeight={700}
            >
              Created
            </Typography>
            <Typography color="#212529" fontSize={14} fontWeight={400}>
              Garry Hunt
            </Typography>
          </Stack>

          <Stack direction="column" gap={1}>
            <Typography
              color="#212529"
              minWidth={150}
              fontSize={14}
              fontWeight={700}
            >
              Date
            </Typography>
            <Typography color="#212529" fontSize={14} fontWeight={400}>
              {formatDate(itemInvoice?.invoice_date)}
            </Typography>
          </Stack>

          <Stack direction="column" gap={1}>
            <Typography
              color="#212529"
              minWidth={150}
              fontSize={14}
              fontWeight={700}
            >
              Due date
            </Typography>
            <Typography color="#212529" fontSize={14} fontWeight={400}>
              {formatDate(itemInvoice?.due_date)}
            </Typography>
          </Stack>
        </Stack>

        <Stack direction="row" gap={3}>
          <Stack direction="column">
            <Typography fontWeight={500} color="#4A4A4A" fontSize={14}>
              VNP
            </Typography>
            <Typography
              fontSize={24}
              fontWeight={600}
              color="#212529"
              sx={{ width: "fit-content", marginTop: 1 }}
            >
              Invoice {itemInvoice?.invoice_number}
            </Typography>
          </Stack>
        </Stack>
      </Stack>

      <Stack
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 3,
        }}
      >
        <Stack direction="column" sx={{ maxWidth: "45%" }}>
          <Typography color="#212529" fontSize={14} fontWeight={600}>
            BILL TO
          </Typography>
          <Typography color="#212529" fontSize={14} fontWeight={400} mt={1}>
            {itemInvoice?.bill_to?.name}
          </Typography>
          <Typography color="#212529" fontSize={14} fontWeight={400}>
            {itemInvoice?.bill_to?.address}
          </Typography>
          <Typography color="#212529" fontSize={14} fontWeight={400}>
            Tax ID: {itemInvoice?.bill_to?.tax_code}
          </Typography>
          <Typography color="#212529" fontSize={14} fontWeight={400}>
            {itemInvoice?.bill_to?.phone}
          </Typography>
        </Stack>

        <Stack direction="column">
          <Stack direction="column">
            <Typography color="#212529" fontSize={14} fontWeight={600}>
              BILL FROM
            </Typography>
            <Typography color="#212529" fontSize={14} fontWeight={400} mt={1}>
              Company {user?.company}
            </Typography>
            <Typography color="#212529" fontSize={14} fontWeight={400}>
              {user?.address ?? "Le Chan, Ho Chi Minh"}
            </Typography>
            <Typography color="#212529" fontSize={14} fontWeight={400}>
              Tax ID: 00001
            </Typography>
          </Stack>
        </Stack>
      </Stack>

      <TableContainer
        component={Paper}
        sx={{ boxShadow: "none", marginTop: 4 }}
      >
        <Table sx={{ minWidth: 900, border: "none" }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  color: "#333333",
                  fontSize: "13px",
                  fontWeight: 700,
                  padding: "12px 20px 12px 0",
                  borderTop: "1px solid rgba(51, 51, 51, 0.1)",
                }}
              >
                ITEM
              </TableCell>
              <TableCell
                sx={{
                  color: "#333333",
                  fontSize: "13px",
                  fontWeight: 700,
                  padding: "12px 20px",
                  borderTop: "1px solid rgba(51, 51, 51, 0.1)",
                }}
                align="right"
              >
                UNIT
              </TableCell>
              <TableCell
                sx={{
                  color: "#333333",
                  fontSize: "13px",
                  fontWeight: 700,
                  padding: "12px 20px",
                  borderTop: "1px solid rgba(51, 51, 51, 0.1)",
                }}
                align="right"
              >
                QTY
              </TableCell>
              <TableCell
                sx={{
                  color: "#333333",
                  fontSize: "13px",
                  fontWeight: 700,
                  padding: "12px 20px",
                  borderTop: "1px solid rgba(51, 51, 51, 0.1)",
                }}
                align="right"
              >
                RATE
              </TableCell>
              <TableCell
                sx={{
                  color: "#333333",
                  fontSize: "13px",
                  fontWeight: 700,
                  padding: "12px 20px",
                  borderTop: "1px solid rgba(51, 51, 51, 0.1)",
                }}
                align="right"
              >
                AMOUNT
              </TableCell>
            </TableRow>
          </TableHead>
          <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
            <Droppable
              isDropDisabled={true}
              droppableId="template-one-droppable"
            >
              {(provided, snapshot) => (
                <TableBody
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  sx={{
                    borderBottom: "1px solid rgba(51, 51, 51, 0.1)",
                  }}
                >
                  {(formik
                    ? formik.values.service_items
                    : itemInvoice?.service_items
                  )?.map((row, index) => (
                    <Draggable
                      isDragDisabled={true}
                      key={String(row._id)}
                      draggableId={String(row._id)}
                      index={index}
                    >
                      {(provided) => (
                        <TableRow
                          key={index}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <TableCell
                            component="th"
                            scope="row"
                            sx={{
                              color: "#21263C",
                              fontSize: "13px",
                              fontWeight: 400,
                              padding: "12px 20px 12px 0",
                              border: "none",
                            }}
                          >
                            {isEdit ? (
                              <Stack>
                                <TextField
                                  name={`service_items[${index}].service_name`}
                                  value={row.service_name}
                                  onChange={(e) =>
                                    handleChange(
                                      `service_items[${index}].service_name`,
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Add a service name"
                                  fullWidth
                                  variant="standard"
                                  InputProps={{
                                    disableUnderline: true,
                                    inputProps: {
                                      style: {
                                        textAlign: "left",
                                        fontSize: "13px",
                                        fontWeight: 700,
                                        color: "#212529",
                                      },
                                    },
                                  }}
                                />
                                00{index + 1}
                              </Stack>
                            ) : (
                              <Stack>
                                <Typography
                                  color="#212529"
                                  fontSize={14}
                                  fontWeight={700}
                                >
                                  {row.service_name}
                                </Typography>
                                <Typography
                                  color="#212529"
                                  fontSize={14}
                                  fontWeight={400}
                                >
                                  00{index + 1}
                                </Typography>
                              </Stack>
                            )}
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "#21263C",
                              fontSize: "13px",
                              fontWeight: 400,
                              padding: "12px 20px",
                              border: "none",
                            }}
                            align="right"
                          >
                            Hour
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "#21263C",
                              fontSize: "13px",
                              fontWeight: 400,
                              padding: "12px 20px",
                              border: "none",
                            }}
                            align="right"
                          >
                            {isEdit ? (
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
                                    style: {
                                      textAlign: "right",
                                      fontSize: "13px",
                                    },
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
                            ) : (
                              String(row.quantity)
                            )}
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "#21263C",
                              fontSize: "13px",
                              fontWeight: 400,
                              padding: "12px 20px",
                              border: "none",
                            }}
                            align="right"
                          >
                            {isEdit ? (
                              <TextField
                                name={`service_items[${index}].rate`}
                                value={row.rate}
                                type="number"
                                onChange={(e) =>
                                  handleChange(
                                    `service_items[${index}].rate`,
                                    e.target.value,
                                  )
                                }
                                fullWidth
                                variant="standard"
                                InputProps={{
                                  disableUnderline: true,
                                  inputProps: {
                                    style: {
                                      textAlign: "right",
                                      fontSize: "13px",
                                    },
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
                            ) : (
                              formatNumber(Number(row?.rate), {
                                prefix: CURRENCY_SYMBOL[CURRENCY_CODE.USD],
                                numberOfFixed: 2,
                              })
                            )}
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "#21263C",
                              fontSize: "13px",
                              fontWeight: 400,
                              padding: "12px 20px",
                              border: "none",
                            }}
                            align="right"
                          >
                            {formatNumber(Number(row?.amount), {
                              prefix: CURRENCY_SYMBOL[CURRENCY_CODE.USD],
                              numberOfFixed: 2,
                            })}
                          </TableCell>
                        </TableRow>
                      )}
                    </Draggable>
                  ))}
                </TableBody>
              )}
            </Droppable>
          </DragDropContext>
        </Table>
      </TableContainer>

      <Stack
        direction="column"
        mt={2}
        sx={{
          alignItems: "flex-end",
        }}
      >
        <Stack
          direction="row-reverse"
          sx={{
            width: "100%",
          }}
        >
          <Stack direction="column" gap={1}>
            <Stack
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "300px",
              }}
              direction="row"
            >
              <Typography color="#212529" fontSize={14} fontWeight={400}>
                Subtotal
              </Typography>
              <Typography color="#21263C" fontSize={14} fontWeight={400}>
                {formatNumber(Number(itemInvoice?.total ?? 0), {
                  prefix: CURRENCY_SYMBOL[CURRENCY_CODE.USD],
                  numberOfFixed: 2,
                })}
              </Typography>
            </Stack>

            <Stack
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "300px",
                paddingLeft: "28px",
              }}
              direction="row"
            >
              <Typography color="#212529" fontSize={14} fontWeight={400}>
                VAT
              </Typography>
              <Typography color="#21263C" fontSize={14} fontWeight={400}>
                {formatNumber((Number(itemInvoice?.total ?? 0) * 10) / 100, {
                  prefix: CURRENCY_SYMBOL[CURRENCY_CODE.USD],
                  numberOfFixed: 2,
                })}
              </Typography>
            </Stack>

            <Stack
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "300px",
                paddingLeft: "20px",
              }}
              direction="row"
            >
              <Typography color="#212529" fontSize={14} fontWeight={400}>
                Total
              </Typography>
              <Typography color="#212529" fontSize={14} fontWeight={400}>
                {formatNumber((Number(itemInvoice?.total ?? 0) * 110) / 100, {
                  prefix: CURRENCY_SYMBOL[CURRENCY_CODE.USD],
                  numberOfFixed: 2,
                })}
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        <Stack
          sx={{
            display: "flex",
            flexDirection: "row",
            marginBottom: "20px",
            alignItems: "center",
            gap: 9,
            marginTop: 2,
            width: "100%",
            justifyContent: "flex-end",
          }}
        >
          <Stack
            direction="row"
            sx={{
              alignItems: "center",
              gap: 4,
            }}
          >
            <Typography
              sx={{ marginRight: "auto" }}
              fontSize={16}
              fontWeight={700}
              color="#333333"
            >
              Amount Due
            </Typography>
            <Typography
              sx={{ marginLeft: "auto" }}
              fontSize={24}
              fontWeight={600}
              color="#333333"
            >
              {formatNumber((Number(itemInvoice?.total ?? 0) * 110) / 100, {
                prefix: CURRENCY_SYMBOL[CURRENCY_CODE.USD],
                numberOfFixed: 2,
              })}
            </Typography>
          </Stack>
          <Stack
            sx={{
              display: "flex",
              paddingX: 6,
              background: "#03AE00",
              borderRadius: "100px",
              padding: "6px 30px",
              gap: 1,
              minWidth: "174px",
              textAlign: "center",
            }}
            direction="row"
          >
            <Typography fontSize={14} fontWeight={700} color="#FFFFFF">
              Payment:{" "}
            </Typography>
            <Typography fontSize={14} fontWeight={500} color="#FFFFFF">
              {itemInvoice?.payment_items
                ? itemInvoice?.payment_items[0]?.payment_method
                : "Stripe"}{" "}
            </Typography>
          </Stack>
        </Stack>

        {isEdit && (
          <Stack
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "350px",
              marginTop: 2,
            }}
            direction="row-reverse"
          >
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
              onClick={formik.handleSubmit}
            >
              Save
            </Box>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}

export default memo(TemplateSeventh);
