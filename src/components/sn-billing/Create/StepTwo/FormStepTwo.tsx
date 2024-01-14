import {
  Box,
  Button,
  InputAdornment,
  InputLabel,
  NativeSelect,
  Radio,
  RadioGroup,
  Stack,
  TableRow,
  TextField,
  Theme,
  selectClasses,
} from "@mui/material";
import Avatar from "components/Avatar";
import { CellProps, TableLayout } from "components/Table";
import { Select, Text } from "components/shared";
import { NS_BILLING } from "constant/index";
import PlusIcon from "icons/PlusIcon";
import { useTranslations } from "next-intl";
import { memo, useEffect, useMemo, useState } from "react";
import {
  useBillings,
  useBudgets,
  useServiceBudgets,
} from "store/billing/selectors";
import MobileContentCell from "./MobileContentCell";
import DesktopCells from "./DesktopCells";
import { Dropdown } from "components/Filters";
import { useFormik } from "formik";
import { Budgets } from "store/billing/reducer";
import SelectMultiple from "components/sn-billing/components/SelectMultiple";
import { useAuth } from "store/app/selectors";
import { BILLING_PATH } from "constant/paths";
import { useRouter } from "next-intl/client";
import FixedLayout from "components/FixedLayout";

const billingFormTranslatePrefix = "list.form";

type IProps = {
  isMdSmaller?: boolean;
  handleSubmit?: () => void;
  budgets?: Budgets[];
  setActiveStep?: (value) => void;
};

type FilterTable = {
  itemAmount?: string;
  itemTime?: string;
  express?: string;
  itemPercent?: number;
  revenueBy?: string;
};
const options = [
  {
    label: "By Service",
    value: "SERVICE",
  },
  {
    label: "By Budget",
    value: "BUDGET",
  },
];

const optionsPercent = [
  {
    label: "100%",
    value: 100,
  },
  {
    label: "50%",
    value: 50,
  },
  {
    label: "20%",
    value: 20,
  },
];

const optionsExpresses = [
  {
    label: "Invoice",
    value: "INVOICE",
  },
  {
    label: "Other",
    value: "Other",
  },
];
const FormStepTwo = (props: IProps) => {
  const { handleSubmit, isMdSmaller, budgets, setActiveStep } = props;
  const { push } = useRouter();
  const { arrService, sumAmount, onGetServiceBudgets } = useServiceBudgets();
  const { budgetDetail, onGetBudgetDetail } = useBudgets();
  const { user } = useAuth();
  const { onCreateBilling, createStatus } = useBillings();
  const [checkItem, setCheckItem] = useState<string>("1");
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [filterTable, setFilterTable] = useState<FilterTable>({
    itemAmount: "SERVICE",
    itemTime: "SERVICE",
    itemPercent: 50,
    express: "INVOICE",
    revenueBy: "SERVICE",
  });

  const billingT = useTranslations(NS_BILLING);

  const formik = useFormik({
    initialValues: {
      invoiceMethod: "",
      vat: 0,
      budgetService: [],
      amount: 0,
      amount_unpaid: 0,
      user: [],
    },
    // validationSchema: {},
    onSubmit(values, formikHelpers) {
      const arrBudgetId = budgets?.map((item) => {
        return { id: item.id };
      });
      const arrServiceId = arrService?.map((item) => {
        return { id: item.id };
      });
      const data = {
        ...values,
        budgetService: arrServiceId,
        // invoiceNumber: "",
        budget: arrBudgetId ?? [],
        user: [{ id: user?.id }],

        // status: "unpaid",
      };
      // delete data["express"];
      // delete data["itemBy"];
      // delete data["itemByAmount"];
      // delete data["itemByTime"];
      // delete data["itemPercent"];

      onCreateBilling(data);
      setActiveStep?.(1);
      setIsSubmit(true);
    },
  });

  useEffect(() => {
    if (createStatus && isSubmit) {
      setIsSubmit(false);
      push(BILLING_PATH);
    }
  }, [createStatus, isSubmit]);

  const desktopHeaderList: CellProps[] = useMemo(
    () => [
      {
        value: billingT(
          `${billingFormTranslatePrefix}.table_step_2.service_type`,
        ),
        width: "20%",
        align: "center",
      },
      {
        value: billingT(
          `${billingFormTranslatePrefix}.table_step_2.description`,
        ),
        width: "20%",
        align: "center",
      },
      {
        value: billingT(`${billingFormTranslatePrefix}.table_step_2.unit`),
        width: "15%",
        align: "center",
      },
      {
        value: billingT(`${billingFormTranslatePrefix}.table_step_2.qty`),
        width: "15%",
        align: "center",
      },
      {
        value: billingT(`${billingFormTranslatePrefix}.table_step_2.rate`),
        width: "15%",
        align: "center",
      },
      {
        value: billingT(`${billingFormTranslatePrefix}.table_step_2.amount`),
        width: "15%",
        align: "center",
      },
    ],
    [billingT],
  );
  const mobileHeaderList: CellProps[] = useMemo(
    () => [
      {
        value: billingT(
          `${billingFormTranslatePrefix}.table_step_2.service_type`,
        ),
        width: "20%",
        align: "center",
      },
      {
        value: billingT(
          `${billingFormTranslatePrefix}.table_step_2.description`,
        ),
        width: "20%",
        align: "center",
      },
      {
        value: billingT(`${billingFormTranslatePrefix}.table_step_2.unit`),
        width: "15%",
        align: "center",
      },
      {
        value: billingT(`${billingFormTranslatePrefix}.table_step_2.qty`),
        width: "15%",
        align: "center",
      },
      {
        value: billingT(`${billingFormTranslatePrefix}.table_step_2.rate`),
        width: "15%",
        align: "center",
      },
      {
        value: billingT(`${billingFormTranslatePrefix}.table_step_2.amount`),
        width: "15%",
        align: "center",
      },
    ],
    [billingT],
  );

  const headerList = useMemo(() => {
    const additionalHeaderList = isMdSmaller
      ? mobileHeaderList
      : desktopHeaderList;
    return [
      ...additionalHeaderList,
      { value: "", width: "10%" },
    ] as CellProps[];
  }, [desktopHeaderList, isMdSmaller, mobileHeaderList]);

  useEffect(() => {
    if (budgets && budgets?.length > 0) {
      budgets?.forEach((item) => {
        onGetServiceBudgets(item?.id ?? "");
      });
    }
  }, [onGetServiceBudgets, budgets]);

  // useEffect(() => {
  //   onGetBudgetDetail(budgetId ?? "");
  // }, [onGetBudgetDetail, budgetId]);

  const onChangeRadio = (event, value) => {
    setCheckItem(value);
    formik.setFieldValue("invoiceMethod", value);
  };

  useEffect(() => {
    if (sumAmount) {
      formik.setFieldValue("amount", sumAmount);
      formik.setFieldValue("amount_unpaid", sumAmount);
    }
  }, [sumAmount]);
  return (
    <FixedLayout>
      <Box>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={{
            md: 0,
            xs: 3,
          }}
        >
          <Stack direction="column" py={3} gap={2}>
            <Text variant={"h4"}>
              {billingT(`${billingFormTranslatePrefix}.content.step2.content1`)}
            </Text>
            <Text variant={"body1"}>
              {billingT(`${billingFormTranslatePrefix}.content.step2.content2`)}
            </Text>
          </Stack>
          <Stack direction="row" gap={2}>
            <Button variant="contained" onClick={() => formik.handleSubmit()}>
              {billingT(`${billingFormTranslatePrefix}.button.submit`)}
            </Button>
          </Stack>
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={{
            md: 0,
            xs: 3,
          }}
        >
          <Stack direction="row" alignItems="center" mt={0.5} gap={2}>
            <RadioGroup onChange={onChangeRadio} value={checkItem}>
              <Stack gap={2} direction={"row"}>
                <Radio value={"1"} />
                <Text variant={"body1"} mt={1}>
                  {billingT(
                    `${billingFormTranslatePrefix}.title.uninvoiced_time_expenses`,
                  )}
                </Text>

                <Dropdown
                  // placeholder={commonT("status")}
                  options={options}
                  name="itemByTime"
                  onChange={(e, value) => {
                    setFilterTable({ itemTime: value });
                  }}
                  defaultValue={"SERVICE"}
                  hasAll={false}
                  value={filterTable.itemTime}
                  rootSx={{
                    color: "#1BC5BD",
                    px: "0px!important",
                    [`& .${selectClasses.outlined}`]: {
                      pr: "0!important",
                      mr: ({ spacing }: { spacing: Theme["spacing"] }) =>
                        `${spacing(4)}!important`,
                      "& .sub": {
                        display: "none",
                      },
                    },
                    "& .text-option": {
                      color: "#1BC5BD !important",
                    },
                  }}
                />
              </Stack>

              <Stack gap={2} direction={"row"}>
                <Radio value={"2"} />
                <Text variant={"body1"} mt={1}>
                  {billingT(
                    `${billingFormTranslatePrefix}.title.uninvoiced_amount`,
                  )}
                </Text>

                <Dropdown
                  // placeholder={commonT("status")}
                  options={options}
                  name="itemByAmount"
                  onChange={(e, value) => {
                    setFilterTable({ itemAmount: value });
                  }}
                  defaultValue={"SERVICE"}
                  hasAll={false}
                  value={filterTable.itemAmount}
                  rootSx={{
                    color: "#1BC5BD",
                    px: "0px!important",
                    [`& .${selectClasses.outlined}`]: {
                      pr: "0!important",
                      mr: ({ spacing }: { spacing: Theme["spacing"] }) =>
                        `${spacing(4)}!important`,
                      "& .sub": {
                        display: "none",
                      },
                    },
                    "& .text-option": {
                      color: "#1BC5BD !important",
                    },
                  }}
                />
              </Stack>

              <Stack gap={2} direction={"row"}>
                <Radio value={"3"} />
                <Dropdown
                  // placeholder={commonT("status")}
                  options={optionsPercent}
                  name="itemBy"
                  onChange={(e, value) => {
                    setFilterTable({ itemPercent: value });
                  }}
                  hasAll={false}
                  defaultValue={50}
                  value={filterTable.itemPercent}
                  rootSx={{
                    color: "#1BC5BD",
                    px: "0px!important",
                    [`& .${selectClasses.outlined}`]: {
                      pr: "0!important",
                      mr: ({ spacing }: { spacing: Theme["spacing"] }) =>
                        `${spacing(4)}!important`,
                      "& .sub": {
                        display: "none",
                      },
                    },
                    "& .text-option": {
                      color: "#1BC5BD !important",
                    },
                  }}
                />
                <Text variant={"body1"} mt={1}>
                  {billingT(
                    `${billingFormTranslatePrefix}.title.of_the_budget_revenue`,
                  )}
                </Text>

                <Dropdown
                  // placeholder={commonT("status")}
                  options={options}
                  name="itemBy"
                  onChange={(e, value) => {
                    setFilterTable({ revenueBy: value });
                  }}
                  defaultValue={"SERVICE"}
                  value={filterTable.revenueBy}
                  hasAll={false}
                  rootSx={{
                    color: "#1BC5BD",
                    px: "0px!important",
                    [`& .${selectClasses.outlined}`]: {
                      pr: "0!important",
                      mr: ({ spacing }: { spacing: Theme["spacing"] }) =>
                        `${spacing(4)}!important`,
                      "& .sub": {
                        display: "none",
                      },
                    },
                    "& .text-option": {
                      color: "#1BC5BD !important",
                    },
                  }}
                />
              </Stack>
            </RadioGroup>
          </Stack>
          {checkItem == "1" && (
            <Stack gap={2} mr={10}>
              <Stack gap={2}>
                <SelectMultiple
                  limitTags={10}
                  options={[]}
                  onSelect={(e, data) => null}
                  // onInputChange={(value) => onSearchTags(value)}
                  // onEnter={onEnter}
                  label={billingT(
                    `${billingFormTranslatePrefix}.title.display_service`,
                  )}
                  sx={sxConfig}
                />
              </Stack>

              <Stack gap={2}>
                <SelectMultiple
                  limitTags={10}
                  options={[]}
                  onSelect={(e, data) => null}
                  // onInputChange={(value) => onSearchTags(value)}
                  // onEnter={onEnter}
                  label={billingT(
                    `${billingFormTranslatePrefix}.title.display_expenses`,
                  )}
                  sx={sxConfig}
                />
              </Stack>
            </Stack>
          )}
        </Stack>

        <Stack
          gap={2}
          direction={"row"}
          borderBottom={"1px solid #ECECF3"}
          pb={2}
        >
          <Text variant={"body1"}>
            {billingT(`${billingFormTranslatePrefix}.title.display_expenses`)}
          </Text>
          <Dropdown
            // placeholder={commonT("status")}
            options={optionsExpresses}
            name="express"
            onChange={(e, value) => {
              setFilterTable({ express: value });
            }}
            defaultValue={"INVOICE"}
            hasAll={false}
            value={filterTable.express}
            rootSx={{
              color: "#1BC5BD",
              px: "0px!important",
              [`& .${selectClasses.outlined}`]: {
                pr: "0!important",
                mr: ({ spacing }: { spacing: Theme["spacing"] }) =>
                  `${spacing(4)}!important`,
                "& .sub": {
                  display: "none",
                },
              },
              "& .text-option": {
                color: "#1BC5BD !important",
              },
            }}
          />
        </Stack>
        <Stack alignItems="start" gap={1}>
          <Stack direction="row" mt={2} gap={2}>
            <Text variant={"body1"}>
              {billingT(`${billingFormTranslatePrefix}.title.subTotal`)}
            </Text>
            <Text variant={"body1"} ml={2}>
              {"$" + sumAmount}
            </Text>
          </Stack>
          <Stack direction="row" gap={2}>
            <Text variant={"body1"}>
              {billingT(`${billingFormTranslatePrefix}.title.vat`) + " 0%"}
            </Text>
            <Text variant={"body1"} ml={4}>
              {"$" + 0}
            </Text>
          </Stack>
          <Stack direction="row" gap={2}>
            <Text variant={"body1"}>
              {billingT(`${billingFormTranslatePrefix}.title.total`)}
            </Text>
            <Text variant={"body1"} ml={1.5} fontWeight={600}>
              {"$" + sumAmount}
            </Text>
          </Stack>
        </Stack>
        <Stack direction="row" alignItems="center" mt={3} gap={2}>
          <Text variant={"h4"}>
            {billingT(`${billingFormTranslatePrefix}.title.invoice_preview`)}
          </Text>
        </Stack>
        <Stack
          direction="row"
          spacing={{
            md: 0,
            xs: 3,
          }}
        >
          <TableLayout
            headerList={headerList}
            // pending={isFetching}
            maxHeight={350}
            width={"100%"}
            py={2}
            headerProps={{
              sx: { px: { xs: 0.5, md: 2 } },
            }}
            // error={error as string}
            // noData={!isIdle && totalItems === 0}
            px={{ md: 3 }}
          >
            {formik.values.invoiceMethod === "2" &&
              arrService?.map((item, index) => {
                return (
                  <TableRow key={item.id}>
                    {isMdSmaller ? (
                      <MobileContentCell item={item} />
                    ) : (
                      <DesktopCells
                        order={0}
                        item={item}
                        // order={(pageIndex - 1) * pageSize + (index + 1)}
                      />
                    )}
                  </TableRow>
                );
              })}
          </TableLayout>
        </Stack>
      </Box>
    </FixedLayout>
  );
};
const sxConfig = {
  input: {
    width: "400px !important",
    height: 50,
    background: "#FFF !important",
  },
};

export default memo(FormStepTwo);
