import { memo } from "react";
import { Stack } from "@mui/material";
import Avatar from "components/Avatar";
import { Text } from "components/shared";
import { formatDate, getPath } from "utils/index";
import TextStatus from "components/TextStatus";
import {
  COLOR_STATUS,
  TEXT_STATUS,
  COLOR_PAY_STATUS,
  TEXT_PAY_STATUS,
} from "./components";
import { BodyCell } from "components/Table";
import { Company } from "store/company/reducer";
import Link from "components/Link";
import { COMPANY_DETAIL_PATH } from "constant/paths";
import { NS_COMMON, NS_MANAGER } from "constant/index";
import { useTranslations } from "next-intl";

type MobileContentCellProps = {
  item: Company;
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
        <Link
          sx={{ color: "text.primary" }}
          tooltip={commonT("clickGoDetail", {
            name: managerT("companyList.company"),
          })}
          href={getPath(COMPANY_DETAIL_PATH, undefined, { id: item.id })}
          underline="none"
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar size={32} />
            <Text variant="h6" color="inherit">
              {item.name}
            </Text>
          </Stack>
        </Link>

        <InformationItem label="Email">{item.email}</InformationItem>
        <InformationItem label={commonT("creationDate")}>
          {formatDate(item.created_time)}
        </InformationItem>
        <InformationItem label={commonT("status")}>
          <TextStatus
            text={
              item?.is_approve !== undefined
                ? TEXT_STATUS[Number(item.is_approve)]
                : TEXT_PAY_STATUS[Number(item.status)]
            }
            color={
              item?.is_approve !== undefined
                ? COLOR_STATUS[Number(item.is_approve)]
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
    <Stack direction="row" spacing={2}>
      <Text variant="caption" color="grey.400" width={57}>
        {label}
      </Text>

      {typeof children === "string" ? (
        <Text variant="body2" sx={{ wordBreak: "break-all" }}>
          {children}
        </Text>
      ) : (
        children
      )}
    </Stack>
  );
};
