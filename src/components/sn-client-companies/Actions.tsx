"use client";

import { Stack, Theme, selectClasses } from "@mui/material";
import { Endpoint, client } from "api";
import { Date, Search } from "components/Filters";
import { Button, Text } from "components/shared";
import { DataAction } from "constant/enums";
import {
  AUTH_API_URL,
  DATE_FORMAT_HYPHEN,
  NS_COMMON,
  NS_COMPANY,
} from "constant/index";
import { Option } from "constant/types";
import useToggle from "hooks/useToggle";
import PlusIcon from "icons/PlusIcon";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next-intl/client";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import Image from "next/image";
import UserPlaceholderImage from "public/images/img-user-placeholder.webp";
import { memo, useCallback, useEffect, useState } from "react";
import { useClientCompanies } from "store/company/selectors";
import { getPath } from "utils/index";
import AssignerFilter from "./components/AssignerFilter";
import Form from "./components/Form";
import { useHeaderConfig } from "store/app/selectors";
import { ClientCompany } from "./type";
import StringFormat from "string-format";
import { debounce } from "lodash";

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
  }, [onUpdateHeaderConfig, companyT, pathname]);

  return (
    <>
      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems={{ md: "center" }}
        justifyContent="space-between"
        spacing={{ xs: 1, md: 3 }}
        px={{ xs: 0, md: 3 }}
        py={{ xs: 0, md: 1.5 }}
        borderBottom={1}
        borderColor="grey.100"
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
          spacing={{ xs: 2, md: 0 }}
        >
          <Text variant="h4" display={{ md: "none" }}>
            {companyT("clientCompany.title")}
          </Text>
          <Button
            onClick={onShow}
            startIcon={<PlusIcon />}
            size="extraSmall"
            variant="primary"
            sx={{
              height: 40,
              px: ({ spacing }) => `${spacing(3)}!important`,
              py: ({ spacing }) => `${spacing(1.5)}!important`,
            }}
          >
            {companyT("clientCompany.create")}
          </Button>
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          spacing={3}
          py={{ xs: 1.25, md: 0.5, lg: 1.5 }}
          px={{ md: 1, lg: 1.5 }}
          borderRadius={1}
          width={{ xs: "100%", md: undefined }}
          justifyContent={{ xs: "flex-start", md: "flex-end" }}
          maxWidth={{ xs: "100%", md: "fit-content" }}
          overflow="auto"
          minWidth={{ md: "fit-content" }}
          border={1}
          borderColor="grey.100"
        >
          <Search
            placeholder={commonT("search")}
            name={"name"}
            onChange={onChangeQueries}
            value={queries["name"]}
            sx={{ width: 210, minWidth: 210 }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSearch();
              }
            }}
          />
          {optionSelected && (
            <Button
              size="extraSmall"
              sx={{ padding: 0, display: "flex", gap: 1 }}
              onDoubleClick={onDoubleClick}
            >
              <Image
                className="rounded"
                style={{ margin: "auto" }}
                src={optionSelected?.avatar || UserPlaceholderImage}
                alt={optionSelected?.label}
                width={22}
                height={22}
              ></Image>
              <Text>{optionSelected?.label}</Text>
            </Button>
          )}
          {!optionSelected && (
            <AssignerFilter
              onChange={onChangeCreateBy}
              value={optionSelected}
              hasAvatar
              name="created_by"
              sx={{ display: { xs: "none", md: "initial" } }}
              rootSx={{
                "& >svg": { fontSize: 16 },
                px: "0px!important",
                [`& .${selectClasses.outlined}`]: {
                  pr: "0!important",
                  mr: ({ spacing }: { spacing: Theme["spacing"] }) =>
                    `${spacing(0.5)}!important`,
                  "& .sub": {
                    display: "none",
                  },
                },
              }}
            />
          )}
          <Date
            label={companyT("clientCompany.createDate")}
            name="created_time"
            onChange={onChangeQueries}
            value={queries?.["created_time"]}
            format={DATE_FORMAT_HYPHEN}
            iconProps={{
              sx: { fontSize: 16 },
            }}
          />
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
