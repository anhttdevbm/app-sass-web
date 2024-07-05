import { memo } from "react";
import { Stack } from "@mui/material";
import Avatar from "components/Avatar";
import { Text } from "components/shared";
import { formatDate } from "utils/index";
import TextStatus from "components/TextStatus";
import { BodyCell } from "components/Table";
import { Employee } from "store/company/reducer";
import {
  COLOR_STATUS,
  TEXT_STATUS,
  COLOR_PAY_STATUS,
  TEXT_PAY_STATUS,
} from "./components/helpers";
import { NS_COMMON, NS_MANAGER, NS_COMPANY } from "constant/index";
import { useTranslations } from "next-intl";

type MobileContentCellProps = {
  item: Employee;
};

type InformationItemProps = {
  label: string;
  children?: string | React.ReactNode;
};

const MobileContentCell = (props: MobileContentCellProps) => {
  const { item } = props;
  const commonT = useTranslations(NS_COMMON);
  const managerT = useTranslations(NS_MANAGER);
  return (
    <BodyCell align="left" sx={{ px: 0.5 }}>
      <Stack spacing={2} py={1.5}>
        <Stack>
          <Text variant="h5">{item.fullname}</Text>
          <Text variant="body2">{item.email}</Text>
        </Stack>
        <InformationItem label="Email">{item.email}</InformationItem>
        <InformationItem label={commonT("creator")}>
          {item.fullname}
        </InformationItem>
        <InformationItem label={commonT("creationDate")}>
          {formatDate(item.created_time)}
        </InformationItem>
        <InformationItem label={commonT("status")}>
          <TextStatus
            text={
              item?.approve !== undefined
                ? TEXT_STATUS[Number(item.approve)]
                : TEXT_PAY_STATUS[Number(item.status)]
            }
            color={
              item?.approve !== undefined
                ? COLOR_STATUS[Number(item.approve)]
                : COLOR_PAY_STATUS[Number(item.status)]
            }
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
        <Text variant="body2" color="text.primary" noWrap>
          {children}
        </Text>
      ) : (
        children
      )}
    </Stack>
  );
};
