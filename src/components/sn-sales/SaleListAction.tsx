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
import SearchIcon from "icons/SearchIcon";

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
  const SORT_FITLER_COMPANY = useMemo(
    () => [
      {
        label: "Company",
        value: "DESC",
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
      <Stack direction="row" alignItems="center" gap={2} flexWrap={"wrap"}>
        <Text variant="h2" display={{ md: "none" }}>
          {salesT("list.title")}
        </Text>
        
        <Search
          name="search_key"
          placeholder={salesT("list.table.filter")}
          onEnter={(name, value) => {
            onChangeQueries(name, value);
            onSearch();
          }}
          onChange={(name, value) => onChangeQueries(name, value)}
          sx={{
            height: 48,
            width: {
              lg: 332,
            },
            ".MuiInputBase-root": { height: 48, borderRadius: "100px" },
          }}
          value={queries?.search_key}
          startNode={""}
          endNode={<SearchIcon style={{ color: "#0575E6" }} />}
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
        <Dropdown
          sx={{
            borderRadius: "100px",
            border: "1px solid #EFEFEF",
            padding: "0 20px",
            height: 48,
            fontWeight: 500,
            ".MuiInputBase-root": { pl: "0!important", height: 48 },
            color: "black",
            svg: {
              color: "black",
              borderRadius: "50px",
              border: "0.001px solid #5C5C5C",
            },
          }}
          name="sort"
          hasAll={false}
          onChange={(name, value) => {
            //  onChangeQueries(name, value)}
          }}
          options={SORT_FITLER_COMPANY}
          value={queries?.sort || "DESC"}
        />
        <Dropdown
          sx={{
            borderRadius: "100px",
            border: "1px solid #EFEFEF",
            padding: "0 20px",
            height: 48,
            fontWeight: 500,
            ".MuiInputBase-root": { pl: "0!important", height: 48 },
            color: "black",
            svg: {
              color: "black",
              borderRadius: "50px",
              border: "0.001px solid #5C5C5C",
            },
          }}
          name="sort"
          hasAll={false}
          onChange={(name, value) => onChangeQueries(name, value)}
          options={SORT_FITLER}
          value={queries?.sort || "DESC"}
        />
      </Stack>

      {/* <Stack
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
      
      </Stack> */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={{
          md: 0,
          xs: 3,
        }}
      >
        <Stack direction={"row"} gap={2}>
          <Button
            onClick={() => onOpenModal(modalName.EXPORT)}
            size="small"
            variant="secondary"
            sx={{
              height: 48,
              width: 129,
              background:
                "linear-gradient(#fff, #fff) padding-box, linear-gradient(90deg, #2AF598, #009EFD) border-box",
              color: "#0575E6",
              border: "1px solid transparent",
              fontWeight: "700",
              borderRadius: "100px",
              ":hover": { color: "#0575E6" },
              "p,svg": { fontWeight: "700" },
            }}
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
          <Button
            onClick={() => onOpenModal(modalName.DEAL)}
            size="small"
            variant="contained"
            sx={{
              boxShadow: "none",

              fontWeight: "700",
              background: "linear-gradient(90deg, #2AF598 0%, #009EFD 100%)",
              "&:hover": {
                background: "linear-gradient(90deg, #2AF598 0%, #009EFD 100%)",
              },
              borderRadius: "100px",
              height: 48,
              width: 129,
              "p,svg": { fontWeight: "700" },
              svg: {
                border: "1px solid white",
                borderRadius: "50px",
                color: "#2AF598",
                background: "white",
              },
            }}
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
