import { memo, useMemo } from "react";
import { Stack } from "@mui/material";
import dayjs from "dayjs";
import StringFormat from "string-format";

import Link from "components/Link";
import { BodyCell, StatusCell } from "components/NewTable";
import { Text } from "components/shared";
import Avatar from "components/Avatar";
import { NS_COMPANY, DATE_LOCALE_FORMAT } from "constant/index";
import { EMPLOYEES_DETAIL_PATH } from "constant/paths";
import { Employee } from "store/company/reducer";
import { TEXT_STATUS, COLOR_STATUS } from "../helpers";


type DesktopCellsProps = {
  item: Employee;
};

// const DATE_FORMAT = DATE_LOCALE_FORMAT;
const DATE_FORMAT = 'DD/MM/YYYY';

const DesktopCells = (props: DesktopCellsProps) => {
  const { item } = props;
  const href = useMemo(() => StringFormat(EMPLOYEES_DETAIL_PATH, { id: item.id }), [item.id])
  return (
    <>
      <BodyCell align="left">
        <Stack direction="row" alignItems="center" spacing={1}>
          <Avatar size={32} src={item?.avatar?.link} />
          <Link href={href}><Text variant="h6">{item.fullname}</Text></Link>
        </Stack>
      </BodyCell>
      <BodyCell align="left" noWrap>
        {item.email}
      </BodyCell>
      <BodyCell align="left">{item.position?.name}</BodyCell>
      <BodyCell
        align="left"
        tooltip={dayjs(item.created_time).format(DATE_FORMAT)}
      >
        {/* {formatDate(item.created_time)} */}
        {dayjs(item.created_time).format(DATE_FORMAT)}
      </BodyCell>
      <BodyCell
        align="left"
        tooltip={dayjs(item.date_end_using).format(DATE_FORMAT)}
      >
        {/* {formatDate(item.date_end_using)} */}
        {dayjs(item.date_end_using).format(DATE_FORMAT)}
      </BodyCell>
      <StatusCell
        namespace={NS_COMPANY}
        text={TEXT_STATUS[item.status]}
        color={COLOR_STATUS[item.status]}
        width={93}
      />
    </>
  );
};

export default memo(DesktopCells);
