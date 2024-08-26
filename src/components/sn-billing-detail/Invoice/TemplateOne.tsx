import {
  Box,
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
import { CURRENCY_SYMBOL } from "components/sn-sales/helpers";
import { CURRENCY_CODE } from "constant/enums";
import { memo } from "react";
import { formatDate, formatNumber } from "utils/index";

function TemplateOne({ user, itemInvoice, isEdit }) {
  return (
    <Stack sx={{ border: "1px solid #EFEFEF" }} mt={4} p={6}>
      <Typography fontWeight={700}>VNP</Typography>
      <Typography>{user?.country ?? "Vietnam"}</Typography>
      <Stack
        mt={3}
        sx={{ display: "flex", flexWrap: "wrap", gap: "30px" }}
        direction="row"
      >
        <Typography
          fontSize={24}
          fontWeight={600}
          color="#003169"
          sx={{ width: "fit-content", margin: "auto 0" }}
        >
          Invoice {itemInvoice?.invoice_number}
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: "8px",
            padding: "15px 30px",
            backgroundColor: "#FAFAFA",
            border: "1px solid #2AF598",
            width: "fit-content",
            borderRadius: "4px",
          }}
        >
          <Typography fontSize={14} fontWeight={700} color="#4A4A4A">
            Payment:{" "}
          </Typography>
          <Typography fontSize={14} fontWeight={500} color="#4A4A4A">
            {itemInvoice?.payment_items
              ? itemInvoice?.payment_items[0]?.payment_method
              : "Stripe"}{" "}
            |{" "}
          </Typography>
          <Typography fontSize={14} fontWeight={500} color="#0575E6">
            {itemInvoice?.payment_items
              ? itemInvoice?.payment_items[0]?.payment_link
              : "https://stripe.com"}
          </Typography>
        </Box>
      </Stack>

      <Stack direction="column" mt={2}>
        <Typography color="#878787" fontSize={13} fontWeight={400}>
          BILL FROM
        </Typography>
        <Typography color="#4A4A4A" fontSize={14} fontWeight={700} mt={1}>
          Company {user?.company}
        </Typography>
        <Typography color="#21263C" fontSize={14} fontWeight={400}>
          {user?.address ?? "Le Chan, Ho Chi Minh"}
        </Typography>
        <Typography color="#21263C" fontSize={14} fontWeight={400}>
          Tax ID: 00001
        </Typography>
      </Stack>

      <Stack
        direction="row"
        my={3}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          maxWidth: "80%",
        }}
      >
        <Stack direction="column">
          <Typography color="#878787" fontSize={13} fontWeight={400}>
            CLIENT
          </Typography>
          <Typography color="#4A4A4A" fontSize={14} fontWeight={700} mt={1}>
            Company A
          </Typography>
          <Typography color="#21263C" fontSize={14} fontWeight={400}>
            Grand Via 34, Spain
          </Typography>
          <Typography color="#21263C" fontSize={14} fontWeight={400}>
            Tax ID: 00001
          </Typography>
        </Stack>

        <Stack direction="column">
          <Typography color="#878787" fontSize={13} fontWeight={400}>
            DATE
          </Typography>
          <Typography color="#4A4A4A" fontSize={14} fontWeight={700} mt={1}>
            {formatDate(itemInvoice?.invoice_date)}
          </Typography>
        </Stack>

        <Stack direction="column">
          <Typography color="#878787" fontSize={13} fontWeight={400}>
            DUE DATE
          </Typography>
          <Typography color="#4A4A4A" fontSize={14} fontWeight={700} mt={1}>
            {formatDate(itemInvoice?.due_date)}
          </Typography>
        </Stack>

        <Stack direction="column">
          <Typography color="#878787" fontSize={13} fontWeight={400}>
            CREATED BY
          </Typography>
          <Typography color="#4A4A4A" fontSize={14} fontWeight={700} mt={1}>
            Garry Hunt
          </Typography>
        </Stack>
      </Stack>

      <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
        <Table sx={{ minWidth: 650, border: "none" }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  color: "#878787",
                  fontSize: "13px",
                  fontWeight: 400,
                  padding: "10px",
                }}
              >
                DESCRIPTION
              </TableCell>
              <TableCell
                sx={{
                  color: "#878787",
                  fontSize: "13px",
                  fontWeight: 400,
                  padding: "10px",
                }}
                align="right"
              >
                UNIT
              </TableCell>
              <TableCell
                sx={{
                  color: "#878787",
                  fontSize: "13px",
                  fontWeight: 400,
                  padding: "10px",
                }}
                align="right"
              >
                QTY
              </TableCell>
              <TableCell
                sx={{
                  color: "#878787",
                  fontSize: "13px",
                  fontWeight: 400,
                  padding: "10px",
                }}
                align="right"
              >
                RATE
              </TableCell>
              <TableCell
                sx={{
                  color: "#878787",
                  fontSize: "13px",
                  fontWeight: 400,
                  padding: "10px",
                }}
                align="right"
              >
                AMOUNT
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {itemInvoice?.service_items?.map((row) => (
              <TableRow
                key={row.service_name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  sx={{
                    color: "#21263C",
                    fontSize: "13px",
                    fontWeight: 400,
                    padding: "10px",
                  }}
                >
                  {row.service_name}
                </TableCell>
                <TableCell
                  sx={{
                    color: "#21263C",
                    fontSize: "13px",
                    fontWeight: 400,
                    padding: "10px",
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
                    padding: "10px",
                  }}
                  align="right"
                >
                  {row.quantity ?? ""}
                </TableCell>
                <TableCell
                  sx={{
                    color: "#21263C",
                    fontSize: "13px",
                    fontWeight: 400,
                    padding: "10px",
                  }}
                  align="right"
                >
                  {formatNumber(Number(row?.rate), {
                    prefix: CURRENCY_SYMBOL[CURRENCY_CODE.USD],
                    numberOfFixed: 2,
                  })}
                </TableCell>
                <TableCell
                  sx={{
                    color: "#21263C",
                    fontSize: "13px",
                    fontWeight: 400,
                    padding: "10px",
                  }}
                  align="right"
                >
                  {formatNumber(Number(row?.amount), {
                    prefix: CURRENCY_SYMBOL[CURRENCY_CODE.USD],
                    numberOfFixed: 2,
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack
        direction="column"
        mt={2}
        sx={{ alignItems: "flex-end", gap: "12px" }}
      >
        <Stack
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "350px",
          }}
          direction="row"
        >
          <Typography color="#878787" fontSize={14} fontWeight={400}>
            SUBTOTAL
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
            width: "350px",
          }}
          direction="row"
        >
          <Typography color="#878787" fontSize={14} fontWeight={400}>
            {`VAT(10%)`}
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
            width: "350px",
          }}
          direction="row"
        >
          <Typography color="#878787" fontSize={14} fontWeight={400}>
            GRAND TOTAL
          </Typography>
          <Typography color="#386aba" fontSize={16} fontWeight={700}>
            {formatNumber((Number(itemInvoice?.total ?? 0) * 110) / 100, {
              prefix: CURRENCY_SYMBOL[CURRENCY_CODE.USD],
              numberOfFixed: 2,
            })}
          </Typography>
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
            >
              Save
            </Box>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}

export default memo(TemplateOne);
