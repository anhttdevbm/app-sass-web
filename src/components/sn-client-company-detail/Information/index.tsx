"use client";

import { Divider, IconButton, Stack, StackProps } from "@mui/material";
import { Endpoint, client } from "api";
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
import ChevronIcon from "icons/ChevronIcon";
import EditUnderlineIcon from "icons/EditUnderlineIcon";
import { useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";
import CompanyPlaceholderImage from "public/images/img-user-placeholder.webp";
import { memo, useEffect } from "react";
import { useHeaderConfig } from "store/app/selectors";
import { useClientCompanies } from "store/company/selectors";

type InformationItemProps = StackProps & {
  label: string;
  children?: string | number | React.ReactNode;
};

const InformationCompany = () => {
  const { detailItem: item, onUpdateClientCompany } = useClientCompanies();
  const commonT = useTranslations(NS_COMMON);
  const companyT = useTranslations(NS_COMPANY);
  const [isShow, onShow, onHide] = useToggle();
  const { back } = useRouter();

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
    return () => {
      onUpdateHeaderConfig({
        title: undefined,
        searchPlaceholder: undefined,
        prevPath: undefined,
        endpoint: undefined,
        key: undefined,
      });
    };
  }, [onUpdateHeaderConfig, item]);

  const onBackRouter = () => back();

  return (
    <>
      <FixedLayout
        flex={1}
        style={{ overflowY: "auto", overflowX: "hidden" }}
        px={{ xs: 1, sm: 3 }}
        py={{ md: 3 }}
        rounded="4px"
        borderRadius={1}
        marginLeft={{ lg: 1, xl: 3 }}
        marginRight={{ lg: 1, xl: 3 }}
        width="auto"
      >
        <Stack spacing={3}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            width="100%"
            spacing={{ xs: 2, md: 0 }}
          >
            <IconButton
              size="medium"
              sx={{ display: { sm: "none" }, pl: { xs: 0, sm: 0 } }}
              onClick={onBackRouter}
            >
              <ChevronIcon
                sx={{ color: "text.primary", transform: "rotate(90deg)" }}
                fontSize="medium"
              />
              <Text variant="h5" display={{ md: "none" }}>
                {companyT("clientCompany.title")}
              </Text>
            </IconButton>
          </Stack>
          <Stack direction="row" spacing={2} justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={1}>
              <Stack>
                <Text
                  variant={{ xs: "h5", sm: "h5", md: "h4" }}
                  lineHeight={{ xs: "24px", sm: "24px" }}
                >
                  {item?.name ?? "--"}
                </Text>
                <Text variant="h6" color="grey.400">{`${companyT(
                  "clientCompany.taxCode",
                )}: ${item?.tax_code ?? "--"}`}</Text>
              </Stack>
            </Stack>
            <Stack>
              <Button
                variant="text"
                size="medium"
                style={{ width: 32, maxWidth: 32, padding: 8 }}
                onClick={onShow}
              >
                <EditUnderlineIcon
                  sx={{
                    width: 24,
                    height: 24,
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
              direction={{ xs: "column", sm: "row", md: "row" }}
              columnGap="56px"
              rowGap={2}
            >
              <Stack direction="column" gap={2} width="100%">
                <InformationItem
                  flex={1}
                  label={companyT("clientCompany.createBy")}
                >
                  {item?.created_by?.fullname}
                </InformationItem>

                <InformationItem
                  flex={1}
                  label={companyT("clientCompany.address")}
                >
                  {item?.address}
                </InformationItem>

                <InformationItem flex={1} label={"Email"}>
                  {item?.email}
                </InformationItem>

                <InformationItem flex={1} label={"Website"}>
                  {item?.website}
                </InformationItem>
              </Stack>

              <Stack direction="column" gap={2} width="100%">
                <InformationItem
                  flex={1}
                  label={companyT("clientCompany.createDate")}
                >
                  {dayjs(item?.created_time).format(DATE_LOCALE_FORMAT)}
                </InformationItem>

                <InformationItem
                  flex={1}
                  label={companyT("clientCompany.zipCode")}
                >
                  {item?.zip_code}
                </InformationItem>

                <InformationItem flex={1} label={commonT("phone")}>
                  {item?.phone ? item?.phone : undefined}
                </InformationItem>
              </Stack>
            </Stack>

            <Divider sx={{ borderColor: "grey.100" }} />

            <Text variant="h5">{companyT("clientCompany.contact")}</Text>

            <Stack
              direction={{ xs: "column", sm: "row", md: "row" }}
              columnGap="56px"
              rowGap={2}
            >
              <Stack direction="column" gap={2} width="100%">
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

                <InformationItem
                  flex={1}
                  label={companyT("clientCompany.address")}
                >
                  {item?.contact?.address}
                </InformationItem>
              </Stack>

              <Stack direction="column" gap={2} width="100%">
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

                <InformationItem flex={1} label={commonT("phone")}>
                  {item?.contact?.phone}
                </InformationItem>

                <InformationItem flex={1} label={"Website"}>
                  {item?.contact?.website}
                </InformationItem>
              </Stack>
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
        <Text variant="body2" whiteSpace="break-spaces">
          {children}
        </Text>
      ) : (
        children
      )}
    </Stack>
  );
};
