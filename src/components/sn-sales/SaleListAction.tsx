import { Stack } from "@mui/material";
import { Button, Text } from "components/shared";
import { NS_COMMON, NS_SALES } from "constant/index";
import { useTranslations } from "next-intl";
import React, { memo, useEffect, useMemo, useState } from "react";
import AddDealModal from "./Modals/AddDealsModal";
import ArrowExport from "icons/ArrowExport";
import PlusIcon from "icons/PlusIcon";
import { Dropdown, Search } from "components/Filters";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { SORT_OPTIONS } from "constant/enums";
import { useSales } from "store/sales/selectors";
import { usePathname, useRouter } from "next-intl/client";
import { getPath } from "utils/index";
import AddSquareIcon from "icons/AddSquareIcon";
import ExportModal from "./Modals/ExportModal";

const modalName = {
  DEAL: "deal",
  EXPORT: "export",
};

const SalesListAction = () => {
  const [dealModel, setDealModal] = useState(false);
  const [exportModel, setExportModel] = useState(false);
  const { push } = useRouter();
  const pathname = usePathname();
  const { salesFilters, onGetSales } = useSales();
  const commonT = useTranslations(NS_COMMON);
  const salesT = useTranslations(NS_SALES);

  const [queries, setQueries] = useState<Params>({
    sort: SORT_OPTIONS.DESC,
  });

  const onOpenModal = (modal) => {
    switch (modal) {
      case modalName.DEAL:
        setDealModal(true);
        break;
      case modalName.EXPORT:
        setExportModel(true);
        break;
      default:
    }
  };

  const onCloseModal = (modal) => {
    switch (modal) {
      case modalName.DEAL:
        setDealModal(false);
        break;
      case modalName.EXPORT:
        setExportModel(false);
        break;
      default:
    }
  };

  const onSearch = () => {
    const path = getPath(pathname, queries);
    push(path);
  };

  const onChangeQueries = (name, value) => {
    setQueries((prevQueries) => ({ ...prevQueries, [name]: value }));
  };

  useEffect(() => {
    setQueries(salesFilters);
  }, [salesFilters]);

  const SORT_FITLER = useMemo(
    () => [
      {
        label: salesT("list.filter.decending"),
        value: "DESC",
      },
      {
        label: salesT("list.filter.ascending"),
        value: "ASC",
      },
    ],
    [salesT],
  );

  return (
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
      overflow="hidden"
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={{
          md: 0,
          xs: 3,
        }}
      >
        <Text variant="h2" display={{ md: "none" }}>
          {salesT("list.title")}
        </Text>
        <Stack direction={"row"} gap={2}>
          <Button
            onClick={() => onOpenModal(modalName.DEAL)}
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
            <Text sx={{ display: { xs: "none", md: "block" } }} color="inherit">
              {salesT("list.action.deal")}
            </Text>
          </Button>
          <Button
            onClick={() => onOpenModal(modalName.EXPORT)}
            size="small"
            variant="secondary"
            sx={{ height: 40, width: "fit-content" }}
          >
            <ArrowExport
              sx={{
                width: { xs: 24, md: 18 },
                height: { xs: 24, md: 18 },
                mr: 1,
              }}
            />
            <Text sx={{ display: { xs: "none", md: "block" } }} color="inherit">
              {salesT("list.action.export")}
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
            name="sort"
            hasAll={false}
            onChange={(name, value) => onChangeQueries(name, value)}
            options={SORT_FITLER}
            value={queries?.sort || "DESC"}
          />
        </Stack>
        <Stack direction="row" alignItems="center" gap={2} flexWrap={"wrap"}>
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
          <Button
            size="extraSmall"
            sx={{
              // display: { xs: "flex", md: "none" },
              height: 32,
            }}
            onClick={onSearch}
            variant="secondary"
          >
            {commonT("search")}
          </Button>
        </Stack>
      </Stack>
      <AddDealModal
        open={dealModel}
        onClose={() => onCloseModal(modalName.DEAL)}
      />
      <ExportModal
        open={exportModel}
        onClose={() => onCloseModal(modalName.EXPORT)}
      />
    </Stack>
  );
};

export default memo(SalesListAction);
