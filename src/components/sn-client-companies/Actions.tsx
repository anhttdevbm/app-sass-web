"use client";

import { Stack, selectClasses, Theme } from "@mui/material";
import { Date, Search } from "components/Filters";
import { Button, Text } from "components/shared";
import { DataAction, PayStatus } from "constant/enums";
import { NS_COMMON, NS_COMPANY, DATE_FORMAT_HYPHEN } from "constant/index";
import useToggle from "hooks/useToggle";
import PlusIcon from "icons/PlusIcon";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next-intl/client";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { memo, useEffect, useState } from "react";
import { useClientCompanies } from "store/company/selectors";
import { getPath } from "utils/index";
import Form from "./components/CreateForm";
import AssignerFilter from "./components/AssignerFilter";
import { Option } from "constant/types";
import Image from "next/image";
import UserPlaceholderImage from "public/images/img-user-placeholder.webp";
import { ClientCompanyData } from "store/company/actions";
import { Endpoint, client } from "api";

const Actions = () => {
  const {
    filters,
    isFetching,
    totalPages,
    pageIndex,
    options,
    onGetClientCompanies,
    onGetMemberOptions,
    pageSize,
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

  const onChangeQueries = (name: string, value?: string) => {
    const newValue = options.find(
      (item) => item && value && item?.value === value,
    );
    setOptionSelected(newValue);
    setQueries((prevQueries) => ({ ...prevQueries, [name]: newValue?.label }));
  };

  const onSearch = () => {
    const q = { ...queries };
    const path = getPath(pathname, q);
    push(path);
  };

  const onUpdate = async (data: ClientCompanyData) => {
    const payload = { ...data };       
    if (typeof data["avatar"] === "object") {
      const logoUrl = await client.upload(Endpoint.UPLOAD, data["avatar"]);
      payload.avatar = logoUrl;
    } else {
      delete payload["avatar"];
    }
    return await onCreateClientCompany(payload);
  };

  const onDoubleClick = () => setOptionSelected(undefined);

  useEffect(() => {
    onGetMemberOptions({ pageIndex: 1, pageSize: 20 });
  }, [onGetMemberOptions]);

  useEffect(() => {
    setQueries(filters);
  }, [filters]);

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
            {companyT("clientCompany.title")}
          </Text>
          <Button
            onClick={onShow}
            startIcon={<PlusIcon />}
            size="extraSmall"
            variant="primary"
            sx={{ height: 32, px: ({ spacing }) => `${spacing(2)}!important` }}
          >
            {companyT("clientCompany.create")}
          </Button>
        </Stack>

        <Stack
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
        >
          <Search
            placeholder={commonT("search")}
            name={"name"}
            onChange={onChangeQueries}
            value={queries["name"]}
            sx={{ width: 300, minWidth: 200 }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSearch();
              }
            }}
          />
          {optionSelected && (
            <Button size="extraSmall" sx={{padding: 0, display: "flex", gap: 1}} onDoubleClick={onDoubleClick}>
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
              onChange={onChangeQueries}
              value={queries?.["position.owner"]}
              hasAvatar
              name="fullname"
              sx={{ display: { xs: "none", md: "initial" } }}
              rootSx={{
                "& >svg": { fontSize: 16 },
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
        <Button
          size="extraSmall"
          sx={{ height: 32, display: { xs: "none", md: "flex" } }}
          onClick={onSearch}
          variant="secondary"
        >
          {commonT("search")}
        </Button>
      </Stack>
      {isShow && (
        <Form
          open={isShow}
          onClose={onHide}
          type={DataAction.CREATE}
          initialValues={INITIAL_VALUES}
          onSubmit={onUpdate}
        />
      )}
    </>
  );
};

export default memo(Actions);

const INITIAL_VALUES = {
  code: "COM1z",
  name: "",
  tax_code: "",
  zip_code: "",
  address: "",
  phone: "",
  email: "",
  avatar: "",
  website: "",
  status: false,
  created_time: "",
  contact: {
    name: "",
    position: "",
    address: "",
    phone: "",
    email: "",
    avatar: [],
    website: "",
  },
};
