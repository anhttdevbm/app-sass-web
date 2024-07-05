import { memo } from "react";
import { Company } from "store/company/reducer";
import { BodyCell, StatusCell } from "components/Table";
import { DATE_TIME_FORMAT_SLASH, DATE_LOCALE_FORMAT, NS_COMMON, NS_MANAGER } from "constant/index";
import { formatDate, getPath } from "utils/index";
import {
  TEXT_STATUS,
  COLOR_STATUS,
  TEXT_PAY_STATUS,
  COLOR_PAY_STATUS,
} from "./components";
import { Text } from "components/shared";
import Avatar from "components/Avatar";
import { Stack } from "@mui/material";
import { COMPANY_DETAIL_PATH } from "constant/paths";
import { useTranslations } from "next-intl";
import dayjs from "dayjs";

type DesktopCellsProps = {
  item: Company;
};

const DesktopCells = (props: DesktopCellsProps) => {
  const { item } = props;

  const commonT = useTranslations(NS_COMMON);
  const managerT = useTranslations(NS_MANAGER);

  return (
    <>
      <BodyCell
        align="left"
        href={getPath(COMPANY_DETAIL_PATH, undefined, { id: item.id })}
        linkProps={{
          sx: { color: "text.primary" },
          tooltip: commonT("clickGoDetail", {
            name: managerT("companyList.company"),
          }),
        }}
      >
        <Stack
          width="fit-content"
          direction="row"
          alignItems="center"
          spacing={1.25}
        >
          <Avatar size={32} />
          <Text variant="h6" color="inherit">
            {item.name}
          </Text>
        </Stack>
      </BodyCell>
      <BodyCell align="left" noWrap>
        {item.email}
      </BodyCell>

      <BodyCell tooltip={dayjs(item.created_time).format(DATE_LOCALE_FORMAT)}>
        {/* {formatDate(item.created_time)} */}
        {dayjs(item.created_time).format(DATE_LOCALE_FORMAT)}
      </BodyCell>
      <StatusCell
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
        width={93}
      />
    </>
  );
};

export default memo(DesktopCells);
