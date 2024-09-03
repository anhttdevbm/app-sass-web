import { Box, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { DatePicker } from "components/shared";
import NewPaymentMethodIcon from "icons/NewPaymentMethodIcon";
import Image from "next/image";
import NewPaymentModal from "./NewPaymentModal";

function InvoiceInfor({
  formik,
  handleChange,
  paymentSelected,
  setPaymentSelected,
  setOpen,
  open,
}) {
  return (
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
        }}
      >
        <Typography
          color="#FF2C56"
          fontSize={14}
          fontWeight={700}
          sx={{ minWidth: "130px" }}
        >
          Invoice#*
        </Typography>
        <TextField
          required
          error={Boolean(formik.errors?.invoice_number)}
          value={formik.values.invoice_number}
          onChange={(e) => handleChange("invoice_number", e.target.value)}
          sx={{
            "& .MuiInputBase-root.MuiOutlinedInput-root ": {
              borderRadius: "100px",
            },
            "& .MuiInputBase-input.MuiOutlinedInput-input": {
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
        ></TextField>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <Typography
          color="#FF2C56"
          fontSize={14}
          fontWeight={700}
          sx={{ minWidth: "130px" }}
        >
          Invoice Date*
        </Typography>

        <DatePicker
          name="invoice_date"
          onBlur={formik.handleBlur}
          value={formik.values?.invoice_date}
          error={formik.errors?.invoice_date}
          onChange={handleChange}
          endNode={
            <Image
              src="/images/date-icon.svg"
              alt=""
              width={18}
              height={18}
              style={{ cursor: "pointer" }}
            />
          }
          sx={{
            "& .MuiInputBase-root.MuiOutlinedInput-root ": {
              border: "1px solid #EFEFEF !important",
              borderRadius: "100px",
              background: "#ffffff",
              padding: "5px 30px",
              boxShadow: "none",
              ".MuiOutlinedInput-notchedOutline": {
                border: "1px solid #EFEFEF !important",
              },
              "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                {
                  border: "1px solid #EFEFEF !important",
                },
              "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                {
                  border: "1px solid #EFEFEF !important",
                },
            },
            width: "600px",
            marginLeft: "-16px",
          }}
        />
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            color="#212529"
            fontSize={14}
            fontWeight={400}
            sx={{ minWidth: "130px" }}
          >
            Due Date
          </Typography>

          <DatePicker
            name="due_date"
            value={formik.values.due_date}
            onChange={handleChange}
            endNode={
              <Image
                src="/images/date-icon.svg"
                alt=""
                width={18}
                height={18}
                style={{ cursor: "pointer" }}
              />
            }
            sx={{
              "& .MuiInputBase-root.MuiOutlinedInput-root ": {
                border: "1px solid #EFEFEF !important",
                borderRadius: "100px",
                background: "#ffffff",
                padding: "5px 30px",
              },
              width: "400px",
              boxShadow: "none",
              ".MuiOutlinedInput-notchedOutline": {
                border: "1px solid #EFEFEF !important",
              },
              "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                {
                  border: "1px solid #EFEFEF !important",
                },
              "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                {
                  border: "1px solid #EFEFEF !important",
                },
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
          name="subject"
          onChange={(e) => handleChange("subject", e.target.value)}
          value={formik.values.subject}
        ></TextField>
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: "16px",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
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
            Payment method
          </Typography>
          <TextField
            select
            sx={{
              "& .MuiInputBase-root.MuiOutlinedInput-root ": {
                borderRadius: "100px",
                width: "600px",
              },
              "& .MuiSelect-select.MuiInputBase-input.MuiOutlinedInput-input ":
                {
                  padding: "6px 30px",
                },
              boxShadow: "none",
              ".MuiOutlinedInput-notchedOutline": {
                border: "1px solid #EFEFEF !important",
              },
              "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                {
                  border: "1px solid #EFEFEF !important",
                },
              "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                {
                  border: "1px solid #EFEFEF !important",
                },
            }}
            SelectProps={{
              renderValue: (selected) => (
                <Typography color="#212121" fontWeight={700} fontSize={14}>
                  {formik.values.payment_items[paymentSelected]?.payment_method}
                </Typography>
              ),
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
            value={formik.values.payment_items[paymentSelected]?.payment_method}
            fullWidth
          >
            {(formik.values.payment_items ?? []).map((payment, index) => (
              <MenuItem
                key={index}
                value={payment?.payment_method}
                onClick={() => setPaymentSelected(index)}
              >
                <Stack
                  display="flex"
                  alignItems="center"
                  marginRight={1}
                  width={40}
                >
                  {payment.icon && (
                    <Image
                      src={payment.icon}
                      alt={payment?.payment_method}
                      width={40}
                      height={20}
                    />
                  )}
                </Stack>
                <Typography color="#212121" fontWeight={700} fontSize={14}>
                  {payment?.payment_method}
                </Typography>
              </MenuItem>
            ))}
            <MenuItem key={100}>
              <Stack display="flex" alignItems="center">
                <NewPaymentMethodIcon sx={{ margin: "auto", height: "12px" }} />
              </Stack>
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
          }}
        >
          <Typography color="#212529" fontSize={14} sx={{ minWidth: "130px" }}>
            Link
          </Typography>
          <TextField
            sx={{
              "& .MuiInputBase-root.MuiOutlinedInput-root ": {
                borderRadius: "100px",
              },
              "& .MuiInputBase-input.MuiOutlinedInput-input": {
                padding: "6px 30px",
              },
              boxShadow: "none",
              ".MuiOutlinedInput-notchedOutline": {
                border: "1px solid #EFEFEF !important",
              },
              "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                {
                  border: "1px solid #EFEFEF !important",
                },
              "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                {
                  border: "1px solid #EFEFEF !important",
                },
              width: "400px",
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
  );
}

export default InvoiceInfor;
