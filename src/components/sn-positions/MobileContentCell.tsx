import { memo } from "react";
import { Stack } from "@mui/material";
import Avatar from "components/Avatar";
import { Text } from "components/shared";
import { formatDate, formatNumber } from "utils/index";
import { BodyCell } from "components/Table";
import { Position } from "store/company/reducer";
import { NS_COMMON, NS_COMPANY, DATE_TIME_FORMAT_SLASH, DATE_LOCALE_FORMAT } from "constant/index";
import { useTranslations } from "next-intl";
import dayjs from "dayjs";

type MobileContentCellProps = {
  item: Position;
};

type InformationItemProps = {
  label: string;
  children?: string | React.ReactNode;
};

const MobileContentCell = (props: MobileContentCellProps) => {
  const { item } = props;
  const commonT = useTranslations(NS_COMMON);
  const companyT = useTranslations(NS_COMPANY);

  return (
    <>
      <BodyCell align="left" sx={{ px: 0.5 }} textProps={{ variant: "h6" }}>
        {item?.name}
      </BodyCell>
      <BodyCell align="left" sx={{ px: 0.5 }}>
        {item?.created_by?.fullname}
      </BodyCell>
      <BodyCell
        tooltip={dayjs(item.created_time).format(DATE_LOCALE_FORMAT)}
        sx={{ px: 0.5 }}
        textProps={{
          sx: {
            wordBreak: "break-all",
          },
        }}
      >
        {/* {formatDate(item.created_time)} */}
        {dayjs(item.created_time).format(DATE_LOCALE_FORMAT)}
      </BodyCell>
      <BodyCell sx={{ px: 0.5 }}>
        {formatNumber(item?.total_member_of_position)}
      </BodyCell>
    </>
  );
};

export default memo(MobileContentCell);

const InformationItem = (props: InformationItemProps) => {
  const { label, children = "--" } = props;

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Text variant="caption" color="grey.400">
        {label}
      </Text>

      {typeof children === "string" ? (
        <Text variant="body2" noWrap>
          {children}
        </Text>
      ) : (
        children
      )}
    </Stack>
  );
};
