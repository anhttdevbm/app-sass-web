"use client";

import { Stack, Theme, selectClasses } from "@mui/material";
import { Endpoint, client } from "api";
import { Date, Search } from "components/Filters";
import { Button, Text } from "components/shared";
import { DataAction } from "constant/enums";
import { DATE_FORMAT_HYPHEN, NS_COMMON, NS_COMPANY } from "constant/index";
import { Option } from "constant/types";
import useToggle from "hooks/useToggle";
import PlusIcon from "icons/PlusIcon";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next-intl/client";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import Image from "next/image";
import UserPlaceholderImage from "public/images/img-user-placeholder.webp";
import { memo, useEffect, useState } from "react";
import { useClientCompanies } from "store/company/selectors";
import { getPath } from "utils/index";
import AssignerFilter from "./components/AssignerFilter";
import Form from "./components/Form";
import { useHeaderConfig } from "store/app/selectors";
import { ClientCompany } from "./type";

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
  const { onUpdateHeaderConfig } = useHeaderConfig();

  const onChangeQueries = (name: string, value?: string) => {
    setQueries((prevQueries) => ({ ...prevQueries, [name]: value }));
  };

  const onChangeCreateBy = (name: string, value?: string) => {
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

  const onDoubleClick = () => setOptionSelected(undefined);

  useEffect(() => {
    onGetMemberOptions({ pageIndex: 1, pageSize: 20 });
  }, [onGetMemberOptions]);

  useEffect(() => {
    setQueries(filters);
  }, [filters]);

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
          <AssignerFilter
            onChange={onChangeCreateBy}
            value={optionSelected?.value}
            hasAvatar
            name="fullname"
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
