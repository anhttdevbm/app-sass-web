import {
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Theme,
  Typography,
  selectClasses,
} from "@mui/material";
import { Date, Dropdown } from "components/Filters";
import FixedLayout from "components/FixedLayout";
import Link from "components/Link";
import { DatePicker, Input, Text } from "components/shared";
import { CURRENCY_SYMBOL } from "components/sn-sales/helpers";
import { CURRENCY_CODE } from "constant/enums";
import { NS_BILLING, NS_COMMON } from "constant/index";
import { BILLING_EXPORT_PATH } from "constant/paths";
import { User } from "constant/types";
import { FormikProps, useFormik } from "formik";
import useBreakpoint from "hooks/useBreakpoint";
import PencilUnderlineIcon from "icons/PencilUnderlineIcon";
import EditIcon from "icons/EditIcon";
import MarkAsSendIcon from "icons/MarkAsSendIcon";
import ChangeTemplateIcon from "icons/ChangeTemplateIcon";
import FilePdfIcon from "icons/FilePdfIcon";
import ShareInvoiceIcon from "icons/ShareInvoiceIcon";
import { useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";
import { memo, useEffect, useMemo, useState } from "react";
import { BillingDataExport } from "store/billing/actions";
import { Bill, Billing, Budgets, Service } from "store/billing/reducer";
import { useBillings } from "store/billing/selectors";
import { formatDate, formatNumber, getPath } from "utils/index";
import BillModal from "../components/BillModal";
import LinkBudgetTable from "../components/LinkBudgetTable";
import ServiceTable from "../components/ServiceTable";
import VatPopup from "../components/VatPopup";
import ReplacePopup from "../components/ReplacePopup";
import { useInvoices } from "store/invoice/selectors";
import { useParams } from "next/navigation";
import { useAuth } from "store/app/selectors";

type TabProps = {
  title: string;
  editForm?: boolean;
  item?: Billing;
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
  const {
    title,
    editForm,
    item,
    user,
    arrBudgets,
    form,
    billToInfo,
    setBillToInfo,
    billFromInfo,
    setBillFromInfo,
  } = props;
  const { fileExport, onDownloadFileBilling, onViewFileBilling } =
    useBillings();
  const { item: itemInvoice, onGetInvoiceDetail } = useInvoices();
  const { id } = useParams();
  const commonT = useTranslations(NS_COMMON);
  const billingT = useTranslations(NS_BILLING);
  const { push } = useRouter();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [isBillTo, setIsBillTo] = useState<boolean>(false);

  const [listService, setListService] = useState<Service[]>([]);
  const [listBudgets, setListBudgets] = useState<Budgets[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [selectedDateSent, setSelectedDateSent] = useState<string>("");
  const [exportModel, setExportModel] = useState(false);
  const [viewFileStatus, setViewFileStatus] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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
  console.log("item", user);

  const options = [
    {
      label: billingT("detail.form.invoice.button.option.viewPdf"),
      value: "VIEW",
      icon: "/images/eye.svg",
    },
    {
      label: billingT("detail.form.invoice.button.option.download"),
      value: "DOWNLOAD",
      icon: "/images/document-download.svg",
    },
    {
      label: billingT("detail.form.invoice.button.option.replace"),
      value: "REPLACE",
      icon: "/images/replace.svg",
    },
  ];

  // useEffect(() => {
  //   if (item && arrBudgets) {
  //     formik.setValues(
  //       {
  //         ...item,
  //         vat: item?.vat ? Number(item?.vat) : 0,
  //       } ?? {},
  //     );
  //     if (item?.billFrom && item?.billFrom?.length > 0) {
  //       setBillFromInfo({
  //         city: item?.billFrom[0]?.city,
  //         country: item?.billFrom[0]?.country,
  //         fullNameCompany: item?.billFrom[0]?.company,
  //         save: item?.billFrom[0]?.save,
  //         state: item?.billFrom[0]?.state,
  //         street: item?.billFrom[0]?.street,
  //         tax_id: item?.billFrom[0]?.tax_id,
  //         zipCode: item?.billFrom[0]?.zip ?? 0,
  //       });
  //     }
  //     if (item?.billTo && item?.billTo?.length > 0) {
  //       setBillToInfo({
  //         city: item?.billTo[0]?.city,
  //         country: item?.billTo[0]?.country,
  //         fullNameCompany: item?.billTo[0]?.company,
  //         save: item?.billTo[0]?.save,
  //         state: item?.billTo[0]?.state,
  //         street: item?.billTo[0]?.street,
  //         tax_id: item?.billTo[0]?.tax_id,
  //         zipCode: item?.billTo[0]?.zip ?? 0,
  //       });
  //     }

  //     if (item?.budgetService && item?.budgetService?.length > 0) {
  //       setListService([...item?.budgetService]);
  //     }

  //     if (item?.budget && item?.budget?.length > 0) {
  //       const findBudget = arrBudgets?.filter((find) =>
  //         item?.budget?.find((el) => el.id === find.id),
  //       ) as Budgets[];
  //       setListBudgets(findBudget ?? []);
  //     }
  //   }
  // }, [item, arrBudgets]);

  // const handleClose = () => {
  //   setOpenModal(false);
  // };

  // useEffect(() => {
  //   if (arrService && arrService?.length > 0) {
  //     setListService([...arrService]);
  //   }
  // }, [arrService]);

  // const totalAmount = useMemo(() => {
  //   const result = listService?.reduce((prev, item) => {
  //     const amount = (item as Service).price || 0;
  //     return prev + amount;
  //   }, 0);
  //   return result;
  // }, [listService]);

  // const OptionBudget = useMemo(() => {
  //   const options = arrBudgets?.map((item) => {
  //     return { label: item.name, value: item.id };
  //   });
  //   return options;
  // }, [arrBudgets]);

  // const onChangeVat = () => {};
  // const onChangeBill = () => {};
  useEffect(() => {
    if (listService) {
      form.setFieldValue("budgetService", listService);
    }
  }, [billToInfo, listService]);

  // useEffect(() => {
  //   if (totalAmount && totalAmount != 0 && form?.values?.vat) {
  //     form.setFieldValue(
  //       "amount",
  //       form?.values?.vat !== 0
  //         ? totalAmount + Number(form?.values?.vat)
  //         : totalAmount,
  //     );
  //     form.setFieldValue("amount_unpaid", totalAmount);
  //   }
  // }, [totalAmount, form?.values?.vat]);

  // const arrBill = [{ id: item?.id ?? "" }];

  const onchangePdf = (value) => {
    setSelected(value);
    if (value === "VIEW") {
      // setExportModel(true);
      setViewFileStatus(true);
      push(getPath(BILLING_EXPORT_PATH, undefined, { id: item?.id ?? "" }));

      // onViewFileBilling({ fileType: "pdf_landscape", pageType: "Letter" }, {
      //   bill: arrBill ?? [],
      // } as BillingDataExport);
    }

    if (value === "DOWNLOAD") {
      onDownloadFileBilling(
        { fileType: "pdf_landscape", pageType: "Letter", fileName: fileName },
        {
          bill: arrBill ?? [],
        } as BillingDataExport,
      );
    }

    if (value === "REPLACE") {
      setAnchorEl(value);
      setFileName("");
    }
  };

  const onCloseModalExport = () => {
    setExportModel(false);
  };

  // useEffect(() => {
  //   if (fileExport && viewFileStatus) {
  //     push(getPath(BILLING_EXPORT_PATH, undefined));
  //     setViewFileStatus(false);
  //   }
  // }, [fileExport, viewFileStatus]);

  return (
    // <FixedLayout px={2} minHeight={"85vh"}>
    //   <Stack
    //     direction={"row"}
    //     gap={2}
    //     justifyContent={"space-between"}
    //     alignItems={"center"}
    //     py={1}
    //     position={"sticky"}
    //     // display={"unset"}
    //     top={0}
    //     zIndex={3}
    //     sx={{ background: "#fff" }}
    //   >
    //     <Button variant="outlined">
    //       {billingT("detail.form.invoice.button.sentToClient")}
    //     </Button>
    //     <Stack direction={"row"} gap={2}>
    //       <Dropdown
    //         placeholder={billingT("detail.form.invoice.title.invoicePDF")}
    //         options={options}
    //         name="Tag"
    //         hasIcon
    //         hasAll={false}
    //         onChange={(name, value) => onchangePdf(value)}
    //         value={selected}
    //         rootSx={{
    //           px: "0px!important",
    //           [`& .${selectClasses.outlined}`]: {
    //             pr: "0!important",
    //             mr: ({ spacing }: { spacing: Theme["spacing"] }) =>
    //               `${spacing(4)}!important`,
    //             "& .sub": {
    //               display: "none",
    //             },
    //           },
    //         }}
    //       />
    //       {selected === "REPLACE" && (
    //         <ReplacePopup
    //           fileName={fileName}
    //           selected={selected}
    //           anchorEl={anchorEl}
    //           setAnchorEl={setAnchorEl}
    //           setFileName={setFileName}
    //         />
    //       )}

    //       <Date
    //         label={billingT("detail.form.invoice.title.dateSent")}
    //         onChange={function (
    //           name: string,
    //           newDate?: string | undefined,
    //         ): void {
    //           setSelectedDateSent(newDate ?? "");
    //           // throw new Error("Function not implemented.");
    //         }}
    //         name={"dateSent"}
    //         value={selectedDateSent}
    //       />
    //     </Stack>
    //   </Stack>
    //   <Stack
    //     direction={"row"}
    //     gap={2}
    //     // justifyContent={"space-between"}
    //     // alignItems={"center"}
    //   >
    //     <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
    //       <Grid item xs={4} my={1}>
    //         <Box sx={{ border: "1px solid #ECECF3", p: 2, borderRadius: 4 }}>
    //           <Stack direction={"row"} gap={2} pb={1}>
    //             <Input
    //               title={billingT("detail.form.invoice.title.invoiceNumber")}
    //               name="invoiceNumber"
    //               onChange={form.handleChange}
    //               onBlur={form.handleBlur}
    //               value={form.values?.invoiceNumber}
    //               disabled={!editForm}
    //               // error={commonT(touchedErrors?.description, {
    //               //   name: commonT("form.title.description"),
    //               // })}
    //               fullWidth
    //               rootSx={sxConfig.input}
    //               sx={{ flex: 1, mt: { xs: 2, sm: 0 } }}
    //             />
    //             <Input
    //               title={billingT("detail.form.invoice.title.poNumber")}
    //               name="poNumber"
    //               onChange={form.handleChange}
    //               onBlur={form.handleBlur}
    //               value={form.values?.poNumber}
    //               disabled={!editForm}
    //               // error={commonT(touchedErrors?.description, {
    //               //   name: commonT("form.title.description"),
    //               // })}
    //               fullWidth
    //               rootSx={sxConfig.input}
    //               sx={{ flex: 1, mt: { xs: 2, sm: 0 } }}
    //             />
    //           </Stack>
    //           <Stack direction={"row"} gap={2} pb={1}>
    //             <DatePicker
    //               title={billingT("detail.form.invoice.title.invoiceDate")}
    //               name="date"
    //               onChange={(name, value) => {
    //                 form.setFieldValue(name, value);
    //               }}
    //               onBlur={form.handleBlur}
    //               value={form.values?.date}
    //               disabled={!editForm}
    //               // error={commonT(touchedErrors?.end_date, {
    //               //   name: commonT("form.title.endDate"),
    //               //   name2: commonT("form.title.startDate"),
    //               // })}
    //               rootSx={sxConfig.input}
    //               fullWidth
    //               // sx={{
    //               //   mt: { xs: 2, sm: 0 },
    //               // }}
    //             />
    //             <DatePicker
    //               title={billingT("detail.form.invoice.title.dueDate")}
    //               name="dueDate"
    //               onChange={(name, value) => {
    //                 form.setFieldValue(name, value);
    //               }}
    //               onBlur={form.handleBlur}
    //               value={form.values?.dueDate}
    //               disabled={!editForm || !form.values?.date}
    //               // error={commonT(touchedErrors?.end_date, {
    //               //   name: commonT("form.title.endDate"),
    //               //   name2: commonT("form.title.startDate"),
    //               // })}
    //               rootSx={sxConfig.input}
    //               fullWidth
    //               // sx={{
    //               //   mt: { xs: 2, sm: 0 },
    //               // }}
    //             />
    //           </Stack>
    //           <Stack direction={"row"} gap={2}>
    //             <Input
    //               title={billingT("detail.form.invoice.title.subject")}
    //               name="subject"
    //               onChange={form.handleChange}
    //               onBlur={form.handleBlur}
    //               value={form.values?.subject}
    //               disabled={!editForm}
    //               // error={commonT(touchedErrors?.description, {
    //               //   name: commonT("form.title.description"),
    //               // })}
    //               fullWidth
    //               rootSx={sxConfig.input}
    //               sx={{ flex: 1, mt: { xs: 2, sm: 0 } }}
    //             />
    //           </Stack>
    //         </Box>
    //       </Grid>
    //       <Grid item xs={4} my={1}>
    //         <Box
    //           sx={{
    //             border: "1px solid #ECECF3",
    //             p: 2,
    //             borderRadius: 4,
    //             height: 198,
    //           }}
    //         >
    //           <Stack direction={"row"} gap={2} justifyContent={"space-between"}>
    //             <Text variant={"body2"}>
    //               {billingT("detail.form.invoice.title.billTo")}
    //             </Text>
    //             {editForm && (
    //               <Link
    //                 href={""}
    //                 sx={{
    //                   textDecoration: "none",
    //                   display: "flex",
    //                 }}
    //                 onClick={() => {
    //                   setOpenModal(true);
    //                   setIsBillTo(true);
    //                 }}
    //               >
    //                 <PencilUnderlineIcon sx={{ color: "#1BC5BD", mr: 1 }} />
    //                 <Text variant={"body2"} color={"#1BC5BD"}>
    //                   {billingT("detail.form.invoice.button.edit")}
    //                 </Text>
    //               </Link>
    //             )}
    //           </Stack>
    //           <Stack gap={2} justifyContent={"start"} mt={3}>
    //             <Text variant={"body2"}>{billToInfo.fullNameCompany}</Text>
    //             <Text variant={"body2"}>{billToInfo.street}</Text>
    //             <Text variant={"body2"}>
    //               {billToInfo.city || billToInfo.state || billToInfo.country
    //                 ? (billToInfo.city ?? "") +
    //                   ", " +
    //                   (billToInfo.state ?? "") +
    //                   ", " +
    //                   (billToInfo.country ?? "")
    //                 : ""}
    //             </Text>
    //             <Text variant={"body2"}>{billToInfo.tax_id}</Text>
    //           </Stack>
    //         </Box>
    //       </Grid>
    //       <Grid item xs={4} my={1}>
    //         <Box
    //           sx={{
    //             border: "1px solid #ECECF3",
    //             p: 2,
    //             borderRadius: 4,
    //             height: 198,
    //           }}
    //         >
    //           <Stack direction={"row"} gap={2} justifyContent={"space-between"}>
    //             <Text variant={"body2"}>
    //               {billingT("detail.form.invoice.title.billFrom")}
    //             </Text>
    //             {editForm && (
    //               <Link
    //                 href={""}
    //                 sx={{ textDecoration: "none", display: "flex" }}
    //                 onClick={() => {
    //                   setOpenModal(true);
    //                   setIsBillTo(false);
    //                 }}
    //               >
    //                 <PencilUnderlineIcon sx={{ color: "#1BC5BD", mr: 1 }} />
    //                 <Text variant={"body2"} color={"#1BC5BD"}>
    //                   {billingT("detail.form.invoice.button.edit")}
    //                 </Text>
    //               </Link>
    //             )}
    //           </Stack>
    //           <Stack gap={2} justifyContent={"start"} mt={3}>
    //             <Text variant={"body2"}>
    //               {billFromInfo.fullNameCompany ?? ""}
    //             </Text>
    //             <Text variant={"body2"}>{billFromInfo.street ?? ""}</Text>
    //             <Text variant={"body2"}>
    //               {billFromInfo.city ||
    //               billFromInfo.state ||
    //               billFromInfo.country
    //                 ? (billFromInfo.city ?? "") +
    //                   ", " +
    //                   (billFromInfo.state ?? "") +
    //                   ", " +
    //                   (billFromInfo.country ?? "")
    //                 : ""}
    //             </Text>
    //             <Text variant={"body2"}>{billFromInfo.tax_id ?? ""}</Text>
    //           </Stack>
    //         </Box>
    //       </Grid>
    //     </Grid>
    //   </Stack>
    //   <Stack gap={2}>
    //     {/* <TableService /> */}
    //     <ServiceTable
    //       isEdit={editForm}
    //       listService={listService}
    //       setListService={setListService}
    //       arrBudgets={arrBudgets}
    //     />
    //   </Stack>
    //   <Stack alignItems="start" gap={2} pb={2}>
    //     <Grid container spacing={2} paddingTop={2} paddingLeft={2}>
    //       <Grid xs={1} md={1}>
    //         <Text variant={"body2"}>
    //           {billingT("detail.form.invoice.title.subtotal")}
    //         </Text>
    //       </Grid>
    //       <Grid xs={2} md={2}>
    //         <Text variant={"body2"}>
    //           {formatNumber(totalAmount, {
    //             prefix: CURRENCY_SYMBOL[CURRENCY_CODE.USD],
    //             numberOfFixed: 2,
    //           })}
    //         </Text>
    //       </Grid>
    //     </Grid>

    //     <Grid container spacing={2} paddingTop={2} paddingLeft={2}>
    //       <Grid xs={1} md={1}>
    //         <Text variant={"body2"}>
    //           {billingT("detail.form.invoice.title.vat")}
    //         </Text>
    //       </Grid>
    //       <Grid xs={2} md={2}>
    //         <Text variant={"body2"}>
    //           {formatNumber(form?.values?.vat, {
    //             prefix: CURRENCY_SYMBOL[CURRENCY_CODE.USD],
    //             numberOfFixed: 2,
    //           })}
    //         </Text>
    //       </Grid>
    //       {editForm && <VatPopup form={form} />}
    //     </Grid>

    //     <Grid container spacing={2} paddingTop={2} paddingLeft={2}>
    //       <Grid xs={1} md={1}>
    //         <Text variant={"body2"}>
    //           {billingT("detail.form.invoice.title.total")}
    //         </Text>
    //       </Grid>
    //       <Grid xs={2} md={2}>
    //         <Text variant={"body2"} fontWeight={800}>
    //           {formatNumber(
    //             form.values.vat && form.values.vat != 0
    //               ? totalAmount + Number(form?.values?.vat)
    //               : totalAmount,
    //             {
    //               prefix: CURRENCY_SYMBOL[CURRENCY_CODE.USD],
    //               numberOfFixed: 2,
    //             },
    //           )}
    //         </Text>
    //       </Grid>
    //     </Grid>
    //   </Stack>
    //   <Stack gap={2} pb={2}>
    //     <LinkBudgetTable
    //       arrBudgets={listBudgets ?? []}
    //       isEdit={editForm}
    //       item={item}
    //       setListBudgets={setListBudgets}
    //     />
    //   </Stack>
    //   <Stack gap={2} pb={2}>
    //     <Input
    //       title={billingT("detail.form.invoice.title.message")}
    //       name="message"
    //       onChange={form.handleChange}
    //       onBlur={form.handleBlur}
    //       value={form.values?.message}
    //       // error={commonT(touchedErrors?.description, {
    //       //   name: commonT("form.title.description"),
    //       // })}
    //       fullWidth
    //       rootSx={sxConfig.input}
    //       sx={{ flex: 1, mt: { xs: 2, sm: 0 } }}
    //     />
    //   </Stack>
    //   <BillModal
    //     open={openModal}
    //     handleClose={handleClose}
    //     isBillTo={isBillTo}
    //     billTo={billToInfo}
    //     billFrom={billFromInfo}
    //     setBillToInfo={setBillToInfo}
    //     setBillFromInfo={setBillFromInfo}
    //   />
    //   {/* <ExportView
    //     open={exportModel}
    //     onClose={() => onCloseModalExport()}
    //     item={{ bill: arrBill ?? [] } as BillingDataExport}
    //   /> */}
    // </FixedLayout>
    <Stack mt={2} sx={{ overflowY: "auto", height: "60vh" }}>
      <Stack
        gap={1}
        direction="row"
        sx={{ borderBottom: "1.5px solid #EBEAF2" }}
      >
        <Stack
          direction="row"
          sx={{
            borderRight: "1.5px solid #EBEAF2",
            display: "flex",
            gap: "8px",
            padding: "12px 8px",
          }}
        >
          <EditIcon sx={{ width: "12px", height: "12px", margin: "auto 0" }} />
          <Typography fontSize={14} fontWeight={400} color="#000000">
            Edit
          </Typography>
        </Stack>

        <Stack
          direction="row"
          sx={{
            borderRight: "1.5px solid #EBEAF2",
            display: "flex",
            gap: "8px",
            padding: "12px 8px",
          }}
        >
          <MarkAsSendIcon
            sx={{ width: "12px", height: "12px", margin: "auto 0" }}
          />
          <Typography fontSize={14} fontWeight={400} color="#000000">
            Mark As Send
          </Typography>
        </Stack>

        <Stack
          direction="row"
          sx={{
            borderRight: "1.5px solid #EBEAF2",
            display: "flex",
            gap: "8px",
            padding: "12px 8px",
          }}
        >
          <ShareInvoiceIcon
            sx={{ width: "12px", height: "12px", margin: "auto 0" }}
          />
          <Typography fontSize={14} fontWeight={400} color="#000000">
            Share
          </Typography>
        </Stack>

        <Stack
          direction="row"
          sx={{
            borderRight: "1.5px solid #EBEAF2",
            display: "flex",
            gap: "8px",
            padding: "12px 8px",
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
          }}
        >
          <FilePdfIcon
            sx={{ width: "12px", height: "12px", margin: "auto 0" }}
          />
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
          }}
        >
          <EditIcon sx={{ width: "12px", height: "12px", margin: "auto 0" }} />
        </Stack>
      </Stack>

      {/* Main */}
      <Stack
        sx={{ border: "1px solid #EFEFEF" }}
        mt={4}
        p={6}
        pr={{ xs: 6, lg: 20, xl: 40 }}
      >
        <Typography>VNP</Typography>
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
              {itemInvoice?.payment_items[0]?.payment_method ?? "Stripe"} |{" "}
            </Typography>
            <Typography fontSize={14} fontWeight={500} color="#0575E6">
              {itemInvoice?.payment_items[0]?.payment_method ??
                "https://stripe.com"}
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
          <Table
            sx={{ minWidth: 650, border: "none" }}
            aria-label="simple table"
          >
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{ color: "#878787", fontSize: "13px", fontWeight: 400 }}
                >
                  DESCRIPTION
                </TableCell>
                <TableCell
                  sx={{ color: "#878787", fontSize: "13px", fontWeight: 400 }}
                  align="right"
                >
                  UNIT
                </TableCell>
                <TableCell
                  sx={{ color: "#878787", fontSize: "13px", fontWeight: 400 }}
                  align="right"
                >
                  QTY
                </TableCell>
                <TableCell
                  sx={{ color: "#878787", fontSize: "13px", fontWeight: 400 }}
                  align="right"
                >
                  RATE
                </TableCell>
                <TableCell
                  sx={{ color: "#878787", fontSize: "13px", fontWeight: 400 }}
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
                    sx={{ color: "#21263C", fontSize: "13px", fontWeight: 400 }}
                  >
                    {row.service_name}
                  </TableCell>
                  <TableCell
                    sx={{ color: "#21263C", fontSize: "13px", fontWeight: 400 }}
                    align="right"
                  >
                    Hour
                  </TableCell>
                  <TableCell
                    sx={{ color: "#21263C", fontSize: "13px", fontWeight: 400 }}
                    align="right"
                  >
                    {row.quantity ?? ""}
                  </TableCell>
                  <TableCell
                    sx={{ color: "#21263C", fontSize: "13px", fontWeight: 400 }}
                    align="right"
                  >
                    ${row.rate},00
                  </TableCell>
                  <TableCell
                    sx={{ color: "#21263C", fontSize: "13px", fontWeight: 400 }}
                    align="right"
                  >
                    ${row.amount},00
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
              {itemInvoice?.total ?? 0}
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
              {(Number(itemInvoice?.total ?? 0) * 10) / 100}
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
              {(Number(itemInvoice?.total ?? 0) * 110) / 100}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

const sxConfig = {
  input: {
    height: 46,
  },
};

export default memo(TabInvoice);
