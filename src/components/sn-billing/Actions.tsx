"use client";

import { Link, Stack, Theme, selectClasses } from "@mui/material";
import { Dropdown, Search } from "components/Filters";
import { Button, Text } from "components/shared";
import { NS_BILLING, NS_COMMON } from "constant/index";
import useToggle from "hooks/useToggle";
import AddSquareIcon from "icons/AddSquareIcon";
import ArrowExport from "icons/ArrowExport";
import PlusIcon from "icons/PlusIcon";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next-intl/client";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { memo, useEffect, useMemo, useState } from "react";
import { useProjects } from "store/project/selectors";
import { getPath } from "utils/index";
import ExportView from "./Modals/ExportView";
import { STATUS_BILLING_OPTIONS } from "./components/helpers";
import { BILLING_CREATE_PATH } from "constant/paths";
import { Billing } from "store/billing/reducer";
import { useBillings } from "store/billing/selectors";
import useDebounce from "hooks/useDebounce";
import { BillingDataExport } from "store/billing/actions";

type Iprops = {
  selectedBills: BillingDataExport;
  setExportModel: (boolean) => void;
};
const Actions = (props: Iprops) => {
  const { selectedBills, setExportModel } = props;
  const { filters, size, onGetBillings } = useBillings();
  const commonT = useTranslations(NS_COMMON);
  const billingT = useTranslations(NS_BILLING);

  const pathname = usePathname();
  const { push } = useRouter();
  const [isShow, onShow, onHide] = useToggle();

  const [queries, setQueries] = useState<Params>({ status: "Unpaid" });
  // const [exportModel, setExportModel] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const statusOptions = useMemo(
    () =>
      STATUS_BILLING_OPTIONS.map((item) => ({
        ...item,
        label: item.label,
      })),
    [],
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChangeQueries = (name: string, value: any) => {
    const newQueries = {
      ...queries,
      [name]: value,
    };

    if (!value && typeof value === "undefined") {
      const allQueries = {
        ...queries,
        status: ["Open", "Paid", "Unpaid"],
      };

      onSearch(allQueries);
    } else {
      onSearch(newQueries);
    }
  };

  const [onSearch] = useDebounce((newQueries: Params) => {
    onGetBillings({ ...newQueries, page: 1, size: size });
  }, 1000);
  // const path = getPath(pathname, newQueries);
  // push(path);

  const onClear = () => {
    const newQueries = { page: 1, size: size };
    // const path = getPath(pathname, newQueries);
    // push(path);
    onGetBillings(newQueries);
  };

  const onRefresh = () => {
    onGetBillings({ ...filters, page: 1, size: size });
  };

  useEffect(() => {
    setQueries(filters);
  }, [filters]);

  const onOpenModal = () => {
    setIsOpenModal(true);
  };

  const onCloseModal = () => {
    setIsOpenModal(false);
  };

  const onOpenModalExport = () => {
    setExportModel(true);
  };

  const onCloseModalExport = () => {
    setExportModel(false);
  };

  return (
    <>
      <Stack
        direction={{
          md: "row",
          xs: "column",
        }}
        justifyContent={{
          xs: "flex-start",
          md: "space-between",
        }}
        alignItems={{
          xs: "stretch",
          md: "center",
        }}
        spacing={3}
        py={3}
        px={2}
        maxWidth="100%"
        // overflow="auto"
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={{
            md: 0,
            xs: 3,
          }}
        >
          <Text variant="h2" display={{ md: "none" }}>
            {billingT("list.title")}
          </Text>
          <Stack direction={"row"} gap={2}>
            <Button
              onClick={() => {
                push(BILLING_CREATE_PATH);
              }}
              size="small"
              variant="contained"
              sx={{ height: 40, width: "fit-content" }}
            >
              <AddSquareIcon
                sx={{
                  display: { xs: "block", md: "none" },
                  width: 24,
                  height: 24,
                }}
              />
              <PlusIcon
                sx={{
                  display: { xs: "none", md: "block" },
                  mr: 1,
                  width: 18,
                  height: 18,
                }}
              />
              <Text
                sx={{ display: { xs: "none", md: "block" } }}
                color="inherit"
              >
                {billingT("list.button.invoice")}
              </Text>
            </Button>
            <Button
              onClick={() => onOpenModalExport()}
              size="small"
              variant="secondary"
              sx={{ height: 40, width: "fit-content" }}
              disabled={selectedBills && selectedBills?.bill?.length === 0}
            >
              <ArrowExport
                sx={{
                  width: { xs: 24, md: 18 },
                  height: { xs: 24, md: 18 },
                  mr: 1,
                }}
              />
              <Text
                sx={{ display: { xs: "none", md: "block" } }}
                color="inherit"
              >
                {billingT("list.button.exportView")}
              </Text>
            </Button>
          </Stack>
        </Stack>
        <Stack
          direction={{
            md: "row",
            xs: "row-reverse",
          }}
          alignItems="flex-start"
          justifyContent={{ xs: "flex-end", md: "flex-start" }}
          spacing={3}
          overflow="auto"
          minWidth={{ md: "fit-content" }}
        >
          <Stack direction="row" alignItems="center" gap={2}>
            <Dropdown
              placeholder={commonT("status")}
              options={statusOptions}
              name="status"
              onChange={onChangeQueries}
              value={queries?.status ?? "Unpaid"}
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
          </Stack>
          <Stack direction="row" alignItems="center" gap={2}>
            <Link underline="none" href="#">
              <Stack direction="row" alignItems="center" mt={0.5} gap={2}>
                <PlusIcon
                  sx={{
                    display: { xs: "none", md: "block" },
                    alignItems: "center",
                    width: 18,
                    height: 18,
                    color: "#1BC5BD",
                  }}
                />
                <Text
                  sx={{ display: { xs: "none", md: "block" } }}
                  color="#1BC5BD"
                >
                  {billingT("list.filter.add")}
                </Text>
              </Stack>
            </Link>
          </Stack>
          <Stack direction="row" alignItems="center" gap={2} flexWrap={"wrap"}>
            <Search
              name="subject"
              placeholder={commonT("search")}
              onEnter={(name, value) => {
                onChangeQueries(name, value);
                // onSearch();
              }}
              onChange={(name, value) => onChangeQueries(name, value)}
              sx={{ width: 210 }}
              value={queries?.subject}
            />
            {/* <Button
            size="extraSmall"
            sx={{
              // display: { xs: "flex", md: "none" },
              height: 32,
            }}
            onClick={onSearch}
            variant="secondary"
          >
            {commonT("search")}
          </Button> */}
          </Stack>
        </Stack>
        {/* <AddDealModal
        open={dealModel}
        onClose={() => onCloseModal(modalName.DEAL)}
      /> */}

        {/* <InvoiceModal
        open={isOpenModal}
        onClose={() => onCloseModal()}
      /> */}
      </Stack>
      {/* <ExportView
        open={exportModel}
        onClose={() => onCloseModalExport()}
        item={selectedBills}
      /> */}
    </>
  );
};

export default memo(Actions);

const LATEST_VALUE = "updated_time=-1";
