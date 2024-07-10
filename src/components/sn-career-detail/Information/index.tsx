"use client";

import { memo, useMemo } from "react";
import { Divider, Stack, StackProps, Chip } from "@mui/material";
import { Text } from "components/shared";
import { formatDate, formatNumber } from "utils/index";
import { useMyCompany } from "store/company/selectors";
import StatusServer from "components/StatusServer";
import { useParams } from "next/navigation";
import { useHeaderConfig } from "store/app/selectors";
import { useCareer } from "store/career/selectors";
import { NS_COMMON, NS_COMPANY, DATE_LOCALE_FORMAT, NS_CAREER } from "constant/index";
import { useTranslations } from "next-intl";
import FixedLayout from "components/FixedLayout";
import { CareerData, UpdateStatusCareer } from "store/career/action";

type InformationItemProps = StackProps & {
  label: string;
  children?: string | number | React.ReactNode;
};

const InformationProjectPage = () => {
  const {
    item: detailItem,
    error: detailItemError,
    isFetching: detailItemIsFetching,
  } = useCareer();
  
  const { slug } = useParams();
  const commonT = useTranslations(NS_COMMON);
  const companyT = useTranslations(NS_COMPANY);
  const careerT = useTranslations(NS_CAREER);

  const { prevPath, title } = useHeaderConfig();

  const [item, error, isFetching] = useMemo(() => { 
    return [detailItem, detailItemError, detailItemIsFetching];
  }, [detailItem, detailItemError, detailItemIsFetching]);

  return (
    <StatusServer isFetching={isFetching} error={error} noData={!item}>
      <FixedLayout flex={1}>
        <Stack px={{ sm: 3 }} py={{ md: 3 }} spacing={3}>
          <Stack spacing={3} width={{ xs: "fit-content", md: 800 }}>
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
                label={careerT("form_career.title")}
              >
                {item?.title}
              </InformationItem>

              <InformationItem
                flex={1}
                label={careerT("form_career.location")}
              >
                {item?.location}
              </InformationItem>
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              spacing={{ xs: 2, sm: 5, lg: 10 }}
            >
              <InformationItem flex={1} label={careerT("form_career.start_time")}>
                {formatDate(item?.start_time)}
              </InformationItem>

              <InformationItem
                flex={1}
                label={careerT("form_career.end_time")}
              >
                {formatDate(item?.end_time)}
              </InformationItem>
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              spacing={{ xs: 2, sm: 5, lg: 10 }}
            >
              <InformationItem flex={1} style={{textAlign: 'left'}}  label={careerT("status")}>
                <Stack direction="row"  justifyContent="start">
                  {item?.status === UpdateStatusCareer.REOPEN ? (
                    <Chip
                      size="small"
                      label={careerT("careerTable.statusList.is_opening")}
                      color="success"
                    />
                  ) : (
                    <Chip
                      size="small"
                      label={careerT("careerTable.statusList.is_closed")}
                      color="primary"
                    />
                  )}
                </Stack>
              </InformationItem>

              <InformationItem
                flex={1}
                label={careerT("form_career.numberOfHires")}
              >
                {item?.numberOfHires}
              </InformationItem>
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              spacing={{ xs: 2, sm: 5, lg: 10 }}
            >
              <InformationItem flex={2} style={{textAlign: 'justify'}} label={careerT("form_career.description")}>
                {item?.description}
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
