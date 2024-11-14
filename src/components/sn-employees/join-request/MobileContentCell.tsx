import { Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { memo } from "react";

import Avatar from "components/Avatar";
import { BodyCell } from "components/NewTable";
import { Text } from "components/shared";
import TextStatus from "components/TextStatus";
import { NS_COMMON, NS_COMPANY } from "constant/index";
import { Employee } from "store/company/reducer";
import { formatDate } from "utils/index";
import { COLOR_STATUS, TEXT_STATUS } from "../helpers";

type MobileContentCellProps = {
  item: Employee;
};

type InformationItemProps = {
  label: string;
  children?: string | React.ReactNode;
};

const MobileContentCell = (props: MobileContentCellProps) => {
  const { item } = props;
  const companyT = useTranslations(NS_COMPANY);
  const commonT = useTranslations(NS_COMMON);

  return (
    <BodyCell align="left">
      <Stack spacing={2} py={1.5}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar size={32} src={item?.avatar} />
          <Text variant="h6">{item.fullname}</Text>
        </Stack>
        <InformationItem label="Email">{item.email}</InformationItem>
        <InformationItem label={commonT("requestJoinTime")}>
          {formatDate(item.created_time)}
        </InformationItem>
        <InformationItem label={commonT("status")}>
          <TextStatus
            namespace={NS_COMPANY}
            color={COLOR_STATUS[item.status]}
            text={TEXT_STATUS[item.status]}
          />
        </InformationItem>
      </Stack>
    </BodyCell>
  );
};

export default memo(MobileContentCell);

const InformationItem = (props: InformationItemProps) => {
  const { label, children = "--" } = props;

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Text variant="caption" color="grey.400" width={57}>
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
