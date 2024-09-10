"use client";

import { IconButton, Stack } from "@mui/material";
import { Endpoint, client } from "api";
import { Search } from "components/Filters";
import { Button, Text } from "components/shared";
import { DataAction } from "constant/enums";
import {
  AUTH_API_URL,
  NS_COMMON,
  NS_COMPANY
} from "constant/index";
import { Option } from "constant/types";
import useToggle from "hooks/useToggle";
import AddSquareIcon from "icons/AddSquareIcon";
import PlusIcon from "icons/PlusIcon";
import { debounce } from "lodash";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next-intl/client";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { memo, useCallback, useEffect, useState } from "react";
import { useHeaderConfig } from "store/app/selectors";
import { useClientCompanies } from "store/company/selectors";
import StringFormat from "string-format";
import { getPath } from "utils/index";
import SearchIcon from "../../icons/SearchIcon";
import Form from "./components/Form";
import { ClientCompany } from "./type";

const Actions = () => {
  const {
    filters,
    optionsFilters,
    options,
    onGetMemberOptions,
    onCreateClientCompany,
  } = useClientCompanies();
  const companyT = useTranslations(NS_COMPANY);
  const commonT = useTranslations(NS_COMMON);

  const [isShow, onShow, onHide] = useToggle();

  const pathname = usePathname();
  const { push } = useRouter();

  const [queries, setQueries] = useState<Params>({});
  const [optionSelected, setOptionSelected] = useState<Option | undefined>(
    undefined,
  );
  const { onUpdateHeaderConfig } = useHeaderConfig();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onDebounceSearch = useCallback(
    debounce((name, nextValue) => {
      const q = { ...queries, [name]: nextValue };
      const path = getPath(pathname, q);
      push(path);
    }, 500),
    [],
  );

  const onChangeQueries = (name: string, value?: string) => {
    setQueries((prevQueries) => ({ ...prevQueries, [name]: value }));
    onDebounceSearch(name, value);
  };

  const onChangeCreateBy = (name: string, value?: string) => {
    setQueries((prevQueries) => ({ ...prevQueries, [name]: value }));
    const q = { ...queries, created_by: value };
    const path = getPath(pathname, q);
    push(path);
  };

  const onSearch = () => {
    const q = { ...queries };
    const path = getPath(pathname, q);
    push(path);
  };

  const onUpdate = async (data: ClientCompany) => {
    const payload = { ...data };
    if (data.files) {
      const logoUrl = await client.upload(Endpoint.UPLOAD, data?.files);
      payload.avatar = [logoUrl];
    } else {
      delete payload["files"];
    }
    return await onCreateClientCompany(payload);
  };

  const onDoubleClick = () => {
    const value = { ...queries };
    delete value["created_by"];
    setQueries(value);
    onDebounceSearch("created_by", "");
  };

  useEffect(() => {
    onGetMemberOptions({ pageIndex: 1, pageSize: 20 });
  }, [onGetMemberOptions]);

  useEffect(() => {
    setQueries(filters);
    const newValue = options.find(
      (item) =>
        item && filters?.created_by && item?.value === filters?.created_by,
    );
    setOptionSelected(newValue);
  }, [filters, options]);

  const onGetMemberDetail = async (id: string) => {
    const response = await client.get(
      StringFormat(Endpoint.USER_ITEM, { id }),
      queries,
      {
        baseURL: AUTH_API_URL,
      },
    );
    const opt = {
      label: response.data?.fullname ?? "",
      value: response.data?.id ?? "",
      avatar: response.data?.avatar?.link ?? "",
    };
    setOptionSelected(opt);
  };

  useEffect(() => {
    if (
      optionsFilters &&
      typeof filters?.created_by !== "undefined" &&
      filters?.created_by === optionSelected?.value
    ) {
      onGetMemberDetail(filters?.created_by);
    }
  }, [filters, optionSelected]);

  useEffect(() => {
    onUpdateHeaderConfig({
      title: companyT("clientCompany.title"),
      imageUrl: undefined,
      prevPath: undefined,
    });
    return () => {
      onUpdateHeaderConfig({
        title: undefined,
        searchPlaceholder: undefined,
        prevPath: undefined,
        endpoint: undefined,
        key: undefined,
      });
    };
  }, [onUpdateHeaderConfig, companyT, pathname]);

  return (
    <>
      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems={{ md: "center" }}
        justifyContent="space-between"
        spacing={{ xs: 1, md: 3 }}
        px={{ xs: 0, md: 3 }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
          spacing={{ xs: 2, md: 0 }}
        >
          <Text variant="h4" display={{ md: "none" }}>
            {companyT("projectTypes.title")}
          </Text>
          {/* <Button
            onClick={onShow}
            startIcon={<PlusIcon />}
            size="extraSmall"
            variant="primary"
            sx={{ height: 32, px: ({ spacing }) => `${spacing(2)}!important` }}
          >
            {commonT("createNew")}
          </Button> */}
           <Search
            name="name"
            placeholder={commonT("search")}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSearch();
              }
            }}
            onChange={onChangeQueries}
            value={queries["name"]}
            sx={{
              height: 40,
              width: {
                lg: 332,
              },
              ".MuiInputBase-root": { height: 40, borderRadius: "100px" },
            }}
            startNode={""}
            endNode={<IconButton aria-label="search"><SearchIcon onClick={onSearch} style={{ color: "#0575E6" ,height:"18px",width:"18px"}} /></IconButton>}
          />
        </Stack>

        {/* <Stack
          direction="row"
          alignItems="center"
          spacing={3}
          py={{ xs: 1.25, md: 0.5, lg: 1.25 }}
          px={{ md: 1, lg: 2 }}
          borderRadius={1}
          width={{ xs: "100%", md: undefined }}
          justifyContent={{ xs: "flex-start", md: "flex-end" }}
          maxWidth={{ xs: "100%", md: "fit-content" }}
          overflow="auto"
          minWidth={{ md: "fit-content" }}
        > */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={3}
          py={{ xs: 1.25, md: 0.5, lg: 1.25 }}
          px={{ md: 1, lg: 2 }}
          justifyContent={{ xs: "flex-start", md: "flex-end" }}
          overflow="hidden"
          width="100%"
        >
          <Button
            onClick={onShow}
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
              height: 40,
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
            <Text sx={{ fontSize:"16px", display: { xs: "none", md: "block" } }} color="inherit">
              {companyT("clientCompany.create")}
            </Text>
          </Button>
          
        </Stack>
      </Stack>
      {isShow && (
        <Form
          open={isShow}
          onClose={onHide}
          type={DataAction.CREATE}
          onSubmit={onUpdate}
        />
      )}
    </>
  );
};

export default memo(Actions);
