import { memo } from "react";
import { Employee } from "store/company/reducer";
import { BodyCell, StatusCell } from "components/Table";
import { DATE_TIME_FORMAT_SLASH, NS_COMPANY, DATE_LOCALE_FORMAT } from "constant/index";
import { formatDate } from "utils/index";
import { TEXT_STATUS, COLOR_STATUS } from "../helpers";
import dayjs from "dayjs";
import { Text } from "components/shared";
import { Stack } from "@mui/material";
import Avatar from "components/Avatar";


type DesktopCellsProps = {
  item: Employee;
};

const DesktopCells = (props: DesktopCellsProps) => {
  const { item } = props;
  return (
    <>
      <BodyCell align="left">
        <Stack direction="row" alignItems="center" spacing={1}>
          <Avatar size={32} src={item?.avatar?.link} />
          <Text variant="h6">{item.fullname}</Text>
        </Stack>
      </BodyCell>
      <BodyCell align="left" noWrap>
        {item.email}
      </BodyCell>
      <BodyCell>{item.position?.name}</BodyCell>
      <BodyCell tooltip={dayjs(item.created_time).format(DATE_LOCALE_FORMAT)}>
        {/* {formatDate(item.created_time)} */}
        {dayjs(item.created_time).format(DATE_LOCALE_FORMAT)}
      </BodyCell>
      <BodyCell
        tooltip={dayjs(item.date_end_using).format(DATE_LOCALE_FORMAT)}
      >
        {/* {formatDate(item.date_end_using)} */}
        {dayjs(item.date_end_using).format(DATE_LOCALE_FORMAT)}
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
