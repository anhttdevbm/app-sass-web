"use client";

import { memo, useEffect, useMemo } from "react";
import { Divider, Stack, StackProps } from "@mui/material";
import { Button, Text } from "components/shared";
import { useParams } from "next/navigation";
import { useHeaderConfig } from "store/app/selectors";
import { useClientCompanies } from "store/company/selectors";
import { NS_COMMON, NS_COMPANY, DATE_LOCALE_FORMAT } from "constant/index";
import { useTranslations } from "next-intl";
import Link from "components/Link";
import ProjectPlaceholderImage from "public/images/img-logo-placeholder.webp";
import { EMPLOYEES_PATH, POSITIONS_PATH, PROJECTS_PATH, CLIENT_COMPANIES_PATH } from "constant/paths";
import FixedLayout from "components/FixedLayout";
import dayjs from "dayjs";
import EditIcon from "icons/EditIcon";
import Form from "components/sn-client-companies/components/Form";
import { DataAction } from "constant/enums";
import useToggle from "hooks/useToggle";
import { usePathname } from "next-intl/client";
import { ClientCompany } from "components/sn-client-companies/type";

type InformationItemProps = StackProps & {
  label: string;
  children?: string | number | React.ReactNode;
};

const InformationProjectPage = () => {
  const { detailItem: item, isFetching, error, onUpdateClientCompany } = useClientCompanies();
  const { id } = useParams();
  const commonT = useTranslations(NS_COMMON);
  const companyT = useTranslations(NS_COMPANY);
  const [isShow, onShow, onHide] = useToggle();
  const pathname = usePathname();

  const { prevPath, title, onUpdateHeaderConfig } = useHeaderConfig();

  const onUpdate = async (data: ClientCompany) => {
    return await onUpdateClientCompany(data);
  };

  useEffect(() => {
    onUpdateHeaderConfig({
      title: item?.name ?? "",
      prevPath: CLIENT_COMPANIES_PATH,
      imageUrl: ProjectPlaceholderImage,
    });
  }, [onUpdateHeaderConfig, item?.name]);

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
                <EditIcon
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
          type={DataAction.CREATE}
          initialValues={item}
          onSubmit={onUpdate}
        />
      )}
    </>
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