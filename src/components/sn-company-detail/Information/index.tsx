"use client";

import { Divider, Stack, StackProps } from "@mui/material";
import Avatar from "components/Avatar";
import FixedLayout from "components/FixedLayout";
import Link from "components/Link";
import { Text } from "components/shared";
import StatusServer from "components/StatusServer";
import { Permission } from "constant/enums";
import { DATE_LOCALE_FORMAT, NS_COMMON, NS_COMPANY } from "constant/index";
import { EMPLOYEES_PATH, POSITIONS_PATH, PROJECTS_PATH } from "constant/paths";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import ProjectPlaceholderImage from "public/images/img-logo-placeholder.webp";
import { memo, useMemo } from "react";
import { useAuth, useHeaderConfig } from "store/app/selectors";
import { useMyCompany } from "store/company/selectors";
import { useCompany } from "store/manager/selectors";
import { formatNumber } from "utils/index";
import EditCompany from "./EditCompany";

type InformationItemProps = StackProps & {
  label: string;
  children?: string | number | React.ReactNode;
};

const InformationProjectPage = () => {
  const {
    item: detailItem,
    error: detailItemError,
    isFetching: detailItemIsFetching,
  } = useCompany();
  const {
    item: myItem,
    error: myItemError,
    isFetching: myItemIsFetching,
  } = useMyCompany();
  const { id } = useParams();
  const { user } = useAuth();
  const commonT = useTranslations(NS_COMMON);
  const companyT = useTranslations(NS_COMPANY);

  const { prevPath, title } = useHeaderConfig();

  const [item, error, isFetching] = useMemo(() => {
    if (id) {
      return [detailItem, detailItemError, detailItemIsFetching];
    }
    return [myItem, myItemError, myItemIsFetching];
  }, [
    detailItem,
    detailItemError,
    detailItemIsFetching,
    id,
    myItem,
    myItemError,
    myItemIsFetching,
  ]);

  return (
    <StatusServer isFetching={isFetching} error={error} noData={!item}>
      <FixedLayout flex={1}>
        <Stack px={{ sm: 3 }} py={{ md: 3 }} spacing={3}>
            <Stack direction="row" spacing={2} justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={1}>
              <Avatar
              src={typeof item?.avatar === 'string' ? item.avatar : ProjectPlaceholderImage}
              size={40}
              />
              <Stack>
              <Text variant="h4">{item?.name ?? "--"}</Text>
              <Text variant="h6" color="grey.400">{`${companyT(
                "information.form.title.taxCode",
              )}: ${item?.tax_code}`}</Text>
              </Stack>
            </Stack>
            {user?.roles.includes(Permission.AM)  && <EditCompany />}
            </Stack>
          <Stack spacing={3} width={{ xs: "fit-content", md: 600 }}>
            <Divider sx={{ borderColor: "grey.100" }} />
            <Text variant="h5">
              {companyT("information.generalInformation")}
            </Text>
            <Stack
              direction="row"
              alignItems="center"
              spacing={{ xs: 2, sm: 5, lg: 10 }}
            >
              <InformationItem
                flex={1}
                label={companyT("information.ownerOfCompany")}
              >
                {item?.owner?.fullname}
              </InformationItem>

              <InformationItem
                flex={1}
                label={companyT("information.ownerEmail")}
              >
                {item?.owner?.email}
              </InformationItem>
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              spacing={{ xs: 2, sm: 5, lg: 10 }}
            >
              <InformationItem flex={1} label={commonT("phone")}>
                {item?.phone}
              </InformationItem>

              <InformationItem
                flex={1}
                label={companyT("information.form.title.address")}
              >
                {item?.address}
              </InformationItem>
            </Stack>
            <Divider sx={{ borderColor: "grey.100" }} />
            <Text variant="h5">
              {companyT("information.detailInformation")}
            </Text>
            <Stack
              direction="row"
              alignItems="center"
              spacing={{ xs: 2, sm: 5, lg: 10 }}
            >
              <InformationItem
                flex={1}
                label={companyT("information.numberOfEmployees")}
              >
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
                  {formatNumber(item?.total_member)}
                </Link>
              </InformationItem>

              <InformationItem
                flex={1}
                label={companyT("information.numberOfPositions")}
              >
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
                  {formatNumber(item?.total_position)}
                </Link>
              </InformationItem>
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              spacing={{ xs: 2, sm: 5, lg: 10 }}
            >
              <InformationItem
                flex={1}
                label={companyT("information.numberOfProjects")}
              >
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
                  {formatNumber(item?.total_project)}
                </Link>
              </InformationItem>

              <InformationItem flex={1} label={commonT("creationDate")}>
                {/* {formatDate(item?.created_time, undefined, "--")} */}
                {dayjs(item?.created_time).format(DATE_LOCALE_FORMAT)}
              </InformationItem>
            </Stack>
          </Stack>
        </Stack>
      </FixedLayout>
    </StatusServer>
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
