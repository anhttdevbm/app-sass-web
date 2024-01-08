import { Box, Button, Stack, StackProps, Tab } from "@mui/material";
import { NS_BILLING } from "constant/index";
import useTheme from "hooks/useTheme";
import { useTranslations } from "next-intl";
import { memo, useEffect, useState } from "react";

import { TabContext, TabPanel, TabList } from "@mui/lab";
import TabInvoice from "../Invoice";
import TabFeed from "../Feed";
import TabPayment from "../Payment";
import {
  Bill,
  Billing,
  BillingDataUpdate,
  Budgets,
  Service,
} from "store/billing/reducer";
import { User } from "constant/types";
import { useBillings } from "store/billing/selectors";
import { FormikProps, useFormik } from "formik";
import { Padding } from "@mui/icons-material";

type TabItemProps = {
  label: string;
  value: string;
  editForm?: boolean;
  item?: Billing;
  arrBudgets?: Budgets[];
  user: User;
  form: FormikProps<Billing>;
  billToInfo: Bill;
  setBillToInfo: (value: Bill) => void;
  billFromInfo: Bill;
  setBillFromInfo: (value: Bill) => void;
};

type TabListProps = {
  item?: Billing;
  arrBudgets?: Budgets[];
  user: User;
};

const TabInfo = (props: TabListProps) => {
  const { item, user, arrBudgets } = props;
  // const { id } = useParams() as { id: string };
  // const pathname = usePathname();
  const billingT = useTranslations(NS_BILLING);
  const { onUpdateBilling, updateStatus } = useBillings();
  const [value, setValue] = useState("Invoice");
  const [editForm, setEditForm] = useState<boolean>(false);
  const [billToInfo, setBillToInfo] = useState<Bill>({});
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [billFromInfo, setBillFromInfo] = useState<Bill>({
    fullNameCompany: user?.company,
  });

  const TABS = [
    {
      label: billingT("detail.form.invoice.title.invoice"),
      value: "Invoice",
    },
    {
      label: billingT("detail.form.feed.title.Feed"),
      value: "Feed",
    },
    {
      label: billingT("detail.form.payment.title.payments"),
      value: "Payment",
    },
  ];

  const formik = useFormik<Billing>({
    enableReinitialize: true,
    initialValues: {},
    onSubmit(values, formikHelpers) {
      // setDataUpdate
      const data = {
        ...values,
        // ...billToInfo,
        id: item?.id,
        billTo: billToInfo,
        billFrom: billFromInfo,
      } as BillingDataUpdate;
      handleSaveValue(data ?? {});
      setIsSubmit(true);
    },
  });

  useEffect(() => {
    formik.setValues(item ?? {});
  }, [item]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleSaveValue = (data: BillingDataUpdate) => {
    onUpdateBilling(data);
  };

  useEffect(() => {
    if (updateStatus && isSubmit) {
      formik.resetForm();
      setEditForm(false);
      setIsSubmit(false);
    }
  }, [updateStatus, isSubmit]);
  return (
    <>
      <Stack
        borderBottom={{ md: "1px solid" }}
        borderColor={{ md: "grey.100" }}
        width="100%"
        bgcolor="background.paper"
        px={3}
      >
        <TabContext value={value}>
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            gap={1}
            borderBottom={"1px solid #ECECF3"}
            height={40}
          >
            <TabList
              key={value}
              onChange={handleChange}
              sx={{
                height: 40,
                minHeight: "40px !important",
                ["& span"]: {
                  display: "none !important",
                },
              }}
            >
              {TABS.map((tab) => (
                <Tab
                  key={tab.label}
                  {...tab}
                  label={tab.label}
                  sx={{
                    color: value === tab.value ? "#212121" : "grey.300",
                    textTransform: "none",
                    background: value === tab.value ? "#E1F0FF" : "none",
                    paddingTop: "3px",
                    width: 150,
                    ["&.MuiTab-root.Mui-selected"]: {
                      color: "#212121",
                    },
                  }}
                />
              ))}
            </TabList>
            {value === "Invoice" && (
              <Stack gap={2} direction={"row"} mb={1}>
                {!editForm && (
                  <Button
                    variant="contained"
                    onClick={() => {
                      setEditForm(true);
                    }}
                  >
                    {billingT("detail.form.top.button.edit")}
                  </Button>
                )}

                {editForm && (
                  <>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setEditForm(false);
                      }}
                    >
                      {billingT("detail.form.top.button.cancel")}
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => formik.handleSubmit()}
                    >
                      {billingT("detail.form.top.button.saveChange")}
                    </Button>
                  </>
                )}
              </Stack>
            )}
          </Stack>
          {TABS.map((tab) => (
            <TabItem
              key={tab.label}
              {...tab}
              label={tab.label}
              editForm={editForm}
              item={item}
              user={user}
              arrBudgets={arrBudgets}
              form={formik}
              billToInfo={billToInfo}
              setBillToInfo={setBillToInfo}
              billFromInfo={billFromInfo}
              setBillFromInfo={setBillFromInfo}
            />
          ))}
          {/* <TabActions /> */}
        </TabContext>
      </Stack>
    </>
  );
};

export default memo(TabInfo);

const TabItem = (props: TabItemProps) => {
  const {
    label,
    value,
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

  const billingT = useTranslations(NS_BILLING);
  const { isDarkMode } = useTheme();

  // const pathname = usePathname();
  // const params = useParams();

  // const isActiveLink = useMemo(() => {
  //   const suffixPath = getSuffixPath(pathname);

  //   return suffixPath;
  // }, [pathname]);

  return (
    <TabPanel
      value={value}
      sx={{ padding: 0 }}
      // color={value ? "#212121" : "grey.300"}
      // sx={{ overflow: "scroll" }}
      // sx={{ overflow: "scroll", padding: "0px 12px" }}
    >
      {value === "Invoice" && (
        <TabInvoice
          title={label}
          editForm={editForm}
          item={item}
          user={user}
          arrBudgets={arrBudgets}
          form={form}
          billToInfo={billToInfo}
          setBillToInfo={setBillToInfo}
          billFromInfo={billFromInfo}
          setBillFromInfo={setBillFromInfo}
        />
      )}
      {value === "Feed" && (
        <TabFeed title={label} bill={item ?? {}} user={user} />
      )}
      {value === "Payment" && <TabPayment title={label} />}
    </TabPanel>
  );
};
