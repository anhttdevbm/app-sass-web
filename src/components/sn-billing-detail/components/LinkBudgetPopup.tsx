import { memo, useCallback, useEffect, useMemo, useState } from "react";
import PopoverLayout from "./PopoverLayout";
import { Button, Input, Text } from "components/shared";
import { Stack } from "@mui/material";
import { FormikProps } from "formik";
import { Billing, Budgets } from "store/billing/reducer";
import { formatNumber, stringifyURLSearchParams } from "utils/index";
import { CURRENCY_SYMBOL } from "components/sn-sales/helpers";
import { CURRENCY_CODE } from "constant/enums";
import { Dropdown, Search } from "components/Filters";
import { NS_BILLING, NS_COMMON } from "constant/index";
import { useTranslations } from "next-intl";
import PlusIcon from "icons/PlusIcon";
import { Option } from "constant/types";
import { TBudgetListFilter } from "store/project/budget/action";
import { useBillings, useBudgets } from "store/billing/selectors";
import { GetBudgetListQueries } from "store/billing/actions";
import Filter from "components/shared/Filter";

type IProps = {
  optionBudget?: Option[];
  arrBudgets?: Budgets[];
  setListBudgets?: (data: Budgets[]) => void;
};
const LinkBudgetPopup = (props: IProps) => {
  const { optionBudget, arrBudgets, setListBudgets } = props;
  const commonT = useTranslations(NS_COMMON);
  const billingT = useTranslations(NS_BILLING);
  const [queries, setQueries] = useState<GetBudgetListQueries>();
  const { budgetFilter, onGetBudgetFilters } = useBudgets();
  const [selected, setSelected] = useState<string>("");

  const onSearch = useCallback(() => {
    const newQueries = { ...queries };
    // switch (type) {
    //   case TAB_TYPE.ALL:
    onGetBudgetFilters(newQueries);
    //     break;
    //   case TAB_TYPE.MY:
    //     getMyBooking(newQueries);
    //     break;
    // }
  }, [queries]);

  const budgetOption = useMemo(() => {
    const result = budgetFilter
      ? budgetFilter?.map((item) => {
          return { label: item?.name, value: item?.id };
        })
      : [];
    result.unshift({
      label: commonT("all"),
      value: "",
    });
    return result;
  }, [budgetFilter]);

  const onChangeQueries = (name, value) => {
    setQueries((prev) => ({
      ...prev,
      [name]: value,
    }));

    // console.log(
    //   arrBudgets?.map((data) =>
    //     data?.id != findData?.id ? { ...findData } : { ...data },
    //   ),
    // );
    // );
  };

  useEffect(() => {
    if (selected && selected !== "") {
      const findData = budgetFilter?.find((el) => el.id == selected);

      if (!arrBudgets?.find((el) => el?.id === findData?.id)) {
        setListBudgets?.(
          ([...(arrBudgets ?? []), findData] as Budgets[]) ?? [],
        );
      } else {
        setListBudgets?.([...(arrBudgets ?? [])] ?? []);
      }
    } else {
      setListBudgets?.([...(arrBudgets ?? [])] ?? []);
    }
  }, [selected]);

  return (
    <>
      <PopoverLayout
        // eslint-disable-next-line react/no-children-prop
        children={
          <>
            <Stack direction={"column"} gap={2} p={2}>
              <Search
                name="search_key"
                placeholder={commonT("search")}
                onEnter={(name, value) => {
                  onChangeQueries(name, value);
                  onSearch();
                }}
                onChange={(name, value) => onChangeQueries(name, value)}
                sx={{ width: 210 }}
                value={queries?.search_key}
              />
              <Filter.Select
                value={selected || ""}
                onChange={(event: any) => {
                  setSelected(event?.target?.value ?? "");
                  onChangeQueries("search_key", "");
                }}
                label={billingT("list.table.budgets")}
                sx={{ maxWidth: "200px" }}
                options={budgetOption}
              />
            </Stack>
          </>
        }
        label={
          <Stack direction={"row"} gap={2} alignItems={"center"}>
            <Button
              variant="text"
              sx={{ textDecoration: "none", display: "flex" }}
              //   onClick={() => addRow()}
            >
              <PlusIcon sx={{ color: "#1BC5BD", mr: 1 }} />
              <Text variant={"body1"} color={"#1BC5BD"}>
                {billingT("detail.form.invoice.button.linkBudget")}
              </Text>
            </Button>
          </Stack>
        }
      />
    </>
  );
};
const sxConfig = {
  input: {
    height: 56,
  },
};
export default memo(LinkBudgetPopup);
