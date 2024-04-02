"use client";

import { Divider, Stack, StackProps } from "@mui/material";
import Link from "components/Link";
import { Text } from "components/shared";
import { ClientCompany } from "components/sn-client-companies/type";
import { DATE_LOCALE_FORMAT, NS_COMMON, NS_COMPANY } from "constant/index";
import { EMPLOYEES_PATH, POSITIONS_PATH, PROJECTS_PATH } from "constant/paths";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { memo } from "react";
import { useClientCompanies } from "store/company/selectors";

type InformationItemProps = StackProps & {
  label: string;
  children?: string | number | React.ReactNode;
};

const InformationProjectPage = (props: { item?: ClientCompany }) => {
  const { item } = props;
  const commonT = useTranslations(NS_COMMON);
  const companyT = useTranslations(NS_COMPANY);

  return (
    <Stack sx={{ overflowY: "auto", width: "100%", marginBottom: 3 }}>
      <Stack spacing={3} width={{ xs: "fit-content", md: 600 }}>
        <Text variant="h5">{companyT("clientCompany.generalInformation")}</Text>
        <Stack
          direction="row"
          alignItems="center"
          spacing={{ xs: 2, sm: 5, lg: 10 }}
        >
          <InformationItem flex={1} label={companyT("clientCompany.createBy")}>
            {item?.contact?.name}
          </InformationItem>

          <InformationItem
            flex={1}
            label={companyT("clientCompany.createDate")}
          >
            {dayjs(item?.created_time).format(DATE_LOCALE_FORMAT)}
          </InformationItem>
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          spacing={{ xs: 2, sm: 5, lg: 10 }}
        >
          <InformationItem flex={1} label={companyT("clientCompany.address")}>
            {item?.address}
          </InformationItem>

          <InformationItem flex={1} label={companyT("clientCompany.zipCode")}>
            {item?.zip_code}
          </InformationItem>
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          spacing={{ xs: 2, sm: 5, lg: 10 }}
        >
          <InformationItem flex={1} label={"Email"}>
            {item?.email}
          </InformationItem>

          <InformationItem flex={1} label={commonT("phone")}>
            {item?.phone ? item?.phone : undefined}
          </InformationItem>
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          spacing={{ xs: 2, sm: 5, lg: 10 }}
        >
          <InformationItem flex={1} label={"Website"}>
            {item?.website}
          </InformationItem>
        </Stack>

        <Divider sx={{ borderColor: "grey.100" }} />

        <Text variant="h5">{companyT("clientCompany.contact")}</Text>
        <Stack
          direction="row"
          alignItems="center"
          spacing={{ xs: 2, sm: 5, lg: 10 }}
        >
          <InformationItem flex={1} label={commonT("fullName")}>
            <Link
              href={EMPLOYEES_PATH}
              underline="none"
              sx={{
                color: "inherit",
                "&:hover": {
                  color: "primary.main",
                },
                fontSize: 14,
              }}
            >
              {item?.contact?.name}
            </Link>
          </InformationItem>

          <InformationItem flex={1} label={commonT("position")}>
            <Link
              href={POSITIONS_PATH}
              underline="none"
              sx={{
                color: "inherit",
                "&:hover": {
                  color: "primary.main",
                },
                fontSize: 14,
              }}
            >
              {item?.contact?.position}
            </Link>
          </InformationItem>
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          spacing={{ xs: 2, sm: 5, lg: 10 }}
        >
          <InformationItem flex={1} label={"Email"}>
            <Link
              href={PROJECTS_PATH}
              underline="none"
              sx={{
                color: "inherit",
                "&:hover": {
                  color: "primary.main",
                },
                fontSize: 14,
              }}
            >
              {item?.contact?.email}
            </Link>
          </InformationItem>

          <InformationItem flex={1} label={commonT("phone")}>
            {item?.contact?.phone}
          </InformationItem>
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          spacing={{ xs: 2, sm: 5, lg: 10 }}
        >
          <InformationItem flex={1} label={companyT("clientCompany.address")}>
            {item?.contact?.address}
          </InformationItem>

          <InformationItem flex={1} label={"Website"}>
            {item?.contact?.website}
          </InformationItem>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default memo(InformationProjectPage);
const InformationItem = (props: InformationItemProps) => {
  const { label, children = "--", ...rest } = props;
  return (
    <Stack spacing={0.5} {...rest}>
      <Text color="grey.400" variant="caption" width={130}>
        {label}
      </Text>
      {typeof children === "string" ? (
        <Text variant="body2">{children}</Text>
      ) : (
        children
      )}
    </Stack>
  );
};
