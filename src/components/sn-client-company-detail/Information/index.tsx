"use client";

import { Divider, Stack, StackProps } from "@mui/material";
import FixedLayout from "components/FixedLayout";
import Link from "components/Link";
import { Button, Text } from "components/shared";
import Form from "components/sn-client-companies/components/Form";
import { ClientCompany } from "components/sn-client-companies/type";
import { DataAction } from "constant/enums";
import { DATE_LOCALE_FORMAT, NS_COMMON, NS_COMPANY } from "constant/index";
import {
  CLIENT_COMPANIES_PATH,
  EMPLOYEES_PATH,
  POSITIONS_PATH,
  PROJECTS_PATH,
} from "constant/paths";
import dayjs from "dayjs";
import useToggle from "hooks/useToggle";
import EditUnderlineIcon from "icons/EditUnderlineIcon";
import { useTranslations } from "next-intl";
import CompanyPlaceholderImage from "public/images/img-user-placeholder.webp";
import { memo, useEffect } from "react";
import { useHeaderConfig } from "store/app/selectors";
import { useClientCompanies } from "store/company/selectors";
import { client, Endpoint } from "api";

type InformationItemProps = StackProps & {
  label: string;
  children?: string | number | React.ReactNode;
};

const InformationCompany = () => {
  const { detailItem: item, onUpdateClientCompany } = useClientCompanies();
  const commonT = useTranslations(NS_COMMON);
  const companyT = useTranslations(NS_COMPANY);
  const [isShow, onShow, onHide] = useToggle();

  const { onUpdateHeaderConfig } = useHeaderConfig();

  const onUpdate = async (data: ClientCompany) => {
    const payload = { ...data };
    if (data.files) {
      const logoUrl = await client.upload(Endpoint.UPLOAD, data?.files);
      payload.avatar = [logoUrl];
    } else {
      delete payload["files"];
    }
    return await onUpdateClientCompany(payload);
  };

  useEffect(() => {
    onUpdateHeaderConfig({
      title: item?.name ?? "",
      prevPath: CLIENT_COMPANIES_PATH,
      imageUrl:
        Array.isArray(item?.avatar) && !!item?.avatar?.length
          ? (item?.avatar[0]?.link as string)
          : "" || CompanyPlaceholderImage,
    });
  }, [onUpdateHeaderConfig, item]);

  return (
    <>
      <FixedLayout flex={1}>
        <Stack px={{ sm: 3 }} py={{ md: 3 }} spacing={3}>
          <Stack direction="row" spacing={2} justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={1}>
              <Stack>
                <Text variant="h4">{item?.name ?? "--"}</Text>
                <Text variant="h6" color="grey.400">{`${companyT(
                  "clientCompany.taxCode",
                )}: ${item?.tax_code}`}</Text>
              </Stack>
            </Stack>
            <Stack>
              <Button
                variant="text"
                size="extraSmall"
                style={{ width: 32, maxWidth: 32, padding: 0 }}
                onClick={onShow}
              >
                <EditUnderlineIcon
                  sx={{
                    width: 16,
                    height: 16,
                    padding: 0,
                    margin: "auto",
                    color: "#666666",
                  }}
                />
              </Button>
            </Stack>
          </Stack>
          <Divider sx={{ borderColor: "grey.100" }} />
          <Stack spacing={3} width={{ xs: "fit-content", md: 600 }}>
            <Text variant="h5">
              {companyT("clientCompany.generalInformation")}
            </Text>
            <Stack
              direction="row"
              alignItems="center"
              spacing={{ xs: 2, sm: 5, lg: 10 }}
            >
              <InformationItem
                flex={1}
                label={companyT("clientCompany.createBy")}
              >
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
              <InformationItem
                flex={1}
                label={companyT("clientCompany.address")}
              >
                {item?.address}
              </InformationItem>

              <InformationItem
                flex={1}
                label={companyT("clientCompany.zipCode")}
              >
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
              <InformationItem
                flex={1}
                label={companyT("clientCompany.address")}
              >
                {item?.contact?.address}
              </InformationItem>

              <InformationItem flex={1} label={"Website"}>
                {item?.contact?.website}
              </InformationItem>
            </Stack>
          </Stack>
        </Stack>
      </FixedLayout>
      {isShow && (
        <Form
          open={isShow}
          onClose={onHide}
          type={DataAction.UPDATE}
          initialValues={item}
          onSubmit={onUpdate}
        />
      )}
    </>
  );
};

export default memo(InformationCompany);
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
