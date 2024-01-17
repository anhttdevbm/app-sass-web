import { memo } from "react";
import PopoverLayout from "./PopoverLayout";
import { Button, Input, Text } from "components/shared";
import { Stack } from "@mui/material";
import { FormikProps } from "formik";
import { Billing } from "store/billing/reducer";
import { formatNumber } from "utils/index";
import { CURRENCY_SYMBOL } from "components/sn-sales/helpers";
import { CURRENCY_CODE } from "constant/enums";
import { Search } from "components/Filters";
import { NS_BILLING, NS_COMMON } from "constant/index";
import { useTranslations } from "next-intl";
import PlusIcon from "icons/PlusIcon";

type IProps = {};
const LinkBudgetPopup = (props: IProps) => {
  const {} = props;
  const commonT = useTranslations(NS_COMMON);
  const billingT = useTranslations(NS_BILLING);
  return (
    <>
      <PopoverLayout
        // eslint-disable-next-line react/no-children-prop
        children={
          <>
            <Stack direction={"row"} gap={2} p={2}>
              <Search
                name="search_key"
                placeholder={commonT("search")}
                // onEnter={(name, value) => {
                //   onChangeQueries(name, value);
                //   // onSearch();
                // }}
                // onChange={(name, value) => onChangeQueries(name, value)}
                sx={{ width: 210 }}
                // value={queries?.search_key}
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
