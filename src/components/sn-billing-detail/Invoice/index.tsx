import { Box, Button, Grid, Stack, Theme, selectClasses } from "@mui/material";
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
import { useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";
import { memo, useEffect, useMemo, useState } from "react";
import { BillingDataExport } from "store/billing/actions";
import { Bill, Billing, Budgets, Service } from "store/billing/reducer";
import { useBillings } from "store/billing/selectors";
import { formatNumber, getPath } from "utils/index";
import BillModal from "../components/BillModal";
import LinkBudgetTable from "../components/LinkBudgetTable";
import ServiceTable from "../components/ServiceTable";
import VatPopup from "../components/VatPopup";

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
  const commonT = useTranslations(NS_COMMON);
  const billingT = useTranslations(NS_BILLING);
  const { push } = useRouter();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [isBillTo, setIsBillTo] = useState<boolean>(false);

  const [listService, setListService] = useState<Service[]>([]);
  const [listBudgets, setListBudgets] = useState<Budgets[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [exportModel, setExportModel] = useState(false);
  const [viewFileStatus, setViewFileStatus] = useState<boolean>(false);

  const formik = useFormik<Billing>({
    enableReinitialize: true,
    initialValues: {},
    onSubmit(values, formikHelpers) {
      // setDataUpdate

      return;
    },
  });

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

  useEffect(() => {
    formik.setValues(
      {
        ...item,
        vat: item?.vat ? Number(item?.vat) : 0,
      } ?? {},
    );
    if (item?.billFrom && item?.billFrom?.length > 0) {
      setBillFromInfo({
        city: item?.billFrom[0]?.city,
        country: item?.billFrom[0]?.country,
        fullNameCompany: item?.billFrom[0]?.company,
        save: item?.billFrom[0]?.save,
        state: item?.billFrom[0]?.state,
        street: item?.billFrom[0]?.street,
        tax_id: item?.billFrom[0]?.tax_id,
        zipCode: item?.billFrom[0]?.zip ?? 0,
      });
    }
    if (item?.billTo && item?.billTo?.length > 0) {
      setBillToInfo({
        city: item?.billTo[0]?.city,
        country: item?.billTo[0]?.country,
        fullNameCompany: item?.billTo[0]?.company,
        save: item?.billTo[0]?.save,
        state: item?.billTo[0]?.state,
        street: item?.billTo[0]?.street,
        tax_id: item?.billTo[0]?.tax_id,
        zipCode: item?.billTo[0]?.zip ?? 0,
      });
    }

    if (item?.budgetService && item?.budgetService?.length > 0) {
      setListService([...item?.budgetService]);
    }

    if (item?.budget && item?.budget?.length > 0) {
      const findBudget = arrBudgets?.filter((find) =>
        item?.budget?.find((el) => el.id === find.id),
      ) as Budgets[];
      setListBudgets(findBudget ?? []);
    }
  }, [item, arrBudgets]);

  const handleClose = () => {
    setOpenModal(false);
  };

  // useEffect(() => {
  //   if (arrService && arrService?.length > 0) {
  //     setListService([...arrService]);
  //   }
  // }, [arrService]);

  const totalAmount = useMemo(() => {
    const result = listService?.reduce((prev, item) => {
      const amount = (item as Service).price || 0;
      return prev + amount;
    }, 0);
    return result;
  }, [listService]);

  const OptionBudget = useMemo(() => {
    const options = arrBudgets?.map((item) => {
      return { label: item.name, value: item.id };
    });
    return options;
  }, [arrBudgets]);

  // const onChangeVat = () => {};
  // const onChangeBill = () => {};
  useEffect(() => {
    if (listService) {
      form.setFieldValue("budgetService", listService);
    }
  }, [billToInfo, listService]);

  useEffect(() => {
    if (totalAmount && totalAmount != 0 && form?.values?.vat) {
      form.setFieldValue(
        "amount",
        form?.values?.vat !== 0
          ? totalAmount + Number(form?.values?.vat)
          : totalAmount,
      );
      form.setFieldValue("amount_unpaid", totalAmount);
    }
  }, [totalAmount, form?.values?.vat]);

  const arrBill = [{ id: item?.id ?? "" }];

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
      onDownloadFileBilling({ fileType: "pdf_landscape", pageType: "Letter" }, {
        bill: arrBill ?? [],
      } as BillingDataExport);
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
    <FixedLayout px={2}>
      <Stack
        direction={"row"}
        gap={2}
        justifyContent={"space-between"}
        alignItems={"center"}
        py={1}
        position={"sticky"}
        // display={"unset"}
        top={0}
        zIndex={3}
        sx={{ background: "#fff" }}
      >
        <Button variant="outlined">
          {billingT("detail.form.invoice.button.sentToClient")}
        </Button>
        <Stack direction={"row"} gap={2}>
          <Dropdown
            placeholder={billingT("detail.form.invoice.title.invoicePDF")}
            options={options}
            name="Tag"
            hasIcon
            hasAll={false}
            onChange={(name, value) => onchangePdf(value)}
            value={selected}
            rootSx={{
              px: "0px!important",
              [`& .${selectClasses.outlined}`]: {
                pr: "0!important",
                mr: ({ spacing }: { spacing: Theme["spacing"] }) =>
                  `${spacing(4)}!important`,
                "& .sub": {
                  display: "none",
                },
              },
            }}
          />
          <Date
            label={billingT("detail.form.invoice.title.dateSent")}
            onChange={function (
              name: string,
              newDate?: string | undefined,
            ): void {
              throw new Error("Function not implemented.");
            }}
            name={""}
          />
        </Stack>
      </Stack>
      <Stack
        direction={"row"}
        gap={2}
        // justifyContent={"space-between"}
        // alignItems={"center"}
      >
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={4} my={1}>
            <Box sx={{ border: "1px solid #ECECF3", p: 2, borderRadius: 4 }}>
              <Stack direction={"row"} gap={2} pb={1}>
                <Input
                  title={billingT("detail.form.invoice.title.invoiceNumber")}
                  name="invoiceNumber"
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  value={form.values?.invoiceNumber}
                  disabled={!editForm}
                  // error={commonT(touchedErrors?.description, {
                  //   name: commonT("form.title.description"),
                  // })}
                  fullWidth
                  rootSx={sxConfig.input}
                  sx={{ flex: 1, mt: { xs: 2, sm: 0 } }}
                />
                <Input
                  title={billingT("detail.form.invoice.title.poNumber")}
                  name="poNumber"
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  value={form.values?.poNumber}
                  disabled={!editForm}
                  // error={commonT(touchedErrors?.description, {
                  //   name: commonT("form.title.description"),
                  // })}
                  fullWidth
                  rootSx={sxConfig.input}
                  sx={{ flex: 1, mt: { xs: 2, sm: 0 } }}
                />
              </Stack>
              <Stack direction={"row"} gap={2} pb={1}>
                <DatePicker
                  title={billingT("detail.form.invoice.title.invoiceDate")}
                  name="date"
                  onChange={(name, value) => {
                    form.setFieldValue(name, value);
                  }}
                  onBlur={form.handleBlur}
                  value={form.values?.date}
                  disabled={!editForm}
                  // error={commonT(touchedErrors?.end_date, {
                  //   name: commonT("form.title.endDate"),
                  //   name2: commonT("form.title.startDate"),
                  // })}
                  rootSx={sxConfig.input}
                  fullWidth
                  // sx={{
                  //   mt: { xs: 2, sm: 0 },
                  // }}
                />
                <DatePicker
                  title={billingT("detail.form.invoice.title.dueDate")}
                  name="dueDate"
                  onChange={(name, value) => {
                    form.setFieldValue(name, value);
                  }}
                  onBlur={form.handleBlur}
                  value={form.values?.dueDate}
                  disabled={!editForm}
                  // error={commonT(touchedErrors?.end_date, {
                  //   name: commonT("form.title.endDate"),
                  //   name2: commonT("form.title.startDate"),
                  // })}
                  rootSx={sxConfig.input}
                  fullWidth
                  // sx={{
                  //   mt: { xs: 2, sm: 0 },
                  // }}
                />
              </Stack>
              <Stack direction={"row"} gap={2}>
                <Input
                  title={billingT("detail.form.invoice.title.subject")}
                  name="subject"
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  value={form.values?.subject}
                  disabled={!editForm}
                  // error={commonT(touchedErrors?.description, {
                  //   name: commonT("form.title.description"),
                  // })}
                  fullWidth
                  rootSx={sxConfig.input}
                  sx={{ flex: 1, mt: { xs: 2, sm: 0 } }}
                />
              </Stack>
            </Box>
          </Grid>
          <Grid item xs={4} my={1}>
            <Box
              sx={{
                border: "1px solid #ECECF3",
                p: 2,
                borderRadius: 4,
                height: 198,
              }}
            >
              <Stack direction={"row"} gap={2} justifyContent={"space-between"}>
                <Text variant={"body2"}>
                  {billingT("detail.form.invoice.title.billTo")}
                </Text>
                {editForm && (
                  <Link
                    href={""}
                    sx={{
                      textDecoration: "none",
                      display: "flex",
                    }}
                    onClick={() => {
                      setOpenModal(true);
                      setIsBillTo(true);
                    }}
                  >
                    <PencilUnderlineIcon sx={{ color: "#1BC5BD", mr: 1 }} />
                    <Text variant={"body2"} color={"#1BC5BD"}>
                      {billingT("detail.form.invoice.button.edit")}
                    </Text>
                  </Link>
                )}
              </Stack>
              <Stack gap={2} justifyContent={"start"} mt={3}>
                <Text variant={"body2"}>{billToInfo.fullNameCompany}</Text>
                <Text variant={"body2"}>{billToInfo.street}</Text>
                <Text variant={"body2"}>
                  {billToInfo.city || billToInfo.state || billToInfo.country
                    ? (billToInfo.city ?? "") +
                      ", " +
                      (billToInfo.state ?? "") +
                      ", " +
                      (billToInfo.country ?? "")
                    : ""}
                </Text>
                <Text variant={"body2"}>{billToInfo.tax_id}</Text>
              </Stack>
            </Box>
          </Grid>
          <Grid item xs={4} my={1}>
            <Box
              sx={{
                border: "1px solid #ECECF3",
                p: 2,
                borderRadius: 4,
                height: 198,
              }}
            >
              <Stack direction={"row"} gap={2} justifyContent={"space-between"}>
                <Text variant={"body2"}>
                  {billingT("detail.form.invoice.title.billFrom")}
                </Text>
                {editForm && (
                  <Link
                    href={""}
                    sx={{ textDecoration: "none", display: "flex" }}
                    onClick={() => {
                      setOpenModal(true);
                      setIsBillTo(false);
                    }}
                  >
                    <PencilUnderlineIcon sx={{ color: "#1BC5BD", mr: 1 }} />
                    <Text variant={"body2"} color={"#1BC5BD"}>
                      {billingT("detail.form.invoice.button.edit")}
                    </Text>
                  </Link>
                )}
              </Stack>
              <Stack gap={2} justifyContent={"start"} mt={3}>
                <Text variant={"body2"}>
                  {billFromInfo.fullNameCompany ?? ""}
                </Text>
                <Text variant={"body2"}>{billFromInfo.street ?? ""}</Text>
                <Text variant={"body2"}>
                  {billFromInfo.city ||
                  billFromInfo.state ||
                  billFromInfo.country
                    ? (billFromInfo.city ?? "") +
                      ", " +
                      (billFromInfo.state ?? "") +
                      ", " +
                      (billFromInfo.country ?? "")
                    : ""}
                </Text>
                <Text variant={"body2"}>{billFromInfo.tax_id ?? ""}</Text>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Stack>
      <Stack gap={2}>
        {/* <TableService /> */}
        <ServiceTable
          isEdit={editForm}
          listService={listService}
          setListService={setListService}
          arrBudgets={arrBudgets}
        />
      </Stack>
      <Stack alignItems="start" gap={2} pb={2}>
        <Grid container spacing={2} paddingTop={2} paddingLeft={2}>
          <Grid xs={1} md={1}>
            <Text variant={"body2"}>
              {billingT("detail.form.invoice.title.subtotal")}
            </Text>
          </Grid>
          <Grid xs={2} md={2}>
            <Text variant={"body2"}>
              {formatNumber(totalAmount, {
                prefix: CURRENCY_SYMBOL[CURRENCY_CODE.USD],
                numberOfFixed: 2,
              })}
            </Text>
          </Grid>
        </Grid>

        <Grid container spacing={2} paddingTop={2} paddingLeft={2}>
          <Grid xs={1} md={1}>
            <Text variant={"body2"}>
              {billingT("detail.form.invoice.title.vat")}
            </Text>
          </Grid>
          <Grid xs={2} md={2}>
            <Text variant={"body2"}>
              {formatNumber(form?.values?.vat, {
                prefix: CURRENCY_SYMBOL[CURRENCY_CODE.USD],
                numberOfFixed: 2,
              })}
            </Text>
          </Grid>
          {editForm && <VatPopup form={form} />}
        </Grid>

        <Grid container spacing={2} paddingTop={2} paddingLeft={2}>
          <Grid xs={1} md={1}>
            <Text variant={"body2"}>
              {billingT("detail.form.invoice.title.total")}
            </Text>
          </Grid>
          <Grid xs={2} md={2}>
            <Text variant={"body2"} fontWeight={800}>
              {formatNumber(
                form.values.vat && form.values.vat != 0
                  ? totalAmount + Number(form?.values?.vat)
                  : totalAmount,
                {
                  prefix: CURRENCY_SYMBOL[CURRENCY_CODE.USD],
                  numberOfFixed: 2,
                },
              )}
            </Text>
          </Grid>
        </Grid>
      </Stack>
      <Stack gap={2} pb={2}>
        <LinkBudgetTable
          arrBudgets={listBudgets ?? []}
          isEdit={editForm}
          item={item}
          setListBudgets={setListBudgets}
        />
      </Stack>
      <Stack gap={2} pb={2}>
        <Input
          title={billingT("detail.form.invoice.title.message")}
          name="message"
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          value={form.values?.message}
          // error={commonT(touchedErrors?.description, {
          //   name: commonT("form.title.description"),
          // })}
          fullWidth
          rootSx={sxConfig.input}
          sx={{ flex: 1, mt: { xs: 2, sm: 0 } }}
        />
      </Stack>
      <BillModal
        open={openModal}
        handleClose={handleClose}
        isBillTo={isBillTo}
        billTo={billToInfo}
        billFrom={billFromInfo}
        setBillToInfo={setBillToInfo}
        setBillFromInfo={setBillFromInfo}
      />
      {/* <ExportView
        open={exportModel}
        onClose={() => onCloseModalExport()}
        item={{ bill: arrBill ?? [] } as BillingDataExport}
      /> */}
    </FixedLayout>
  );
};

const sxConfig = {
  input: {
    height: 46,
  },
};

export default memo(TabInvoice);
