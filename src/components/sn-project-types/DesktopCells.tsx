import { memo } from "react";
import { BodyCell } from "components/Table";
import { DATE_TIME_FORMAT_SLASH, DATE_LOCALE_FORMAT } from "constant/index";
import { formatDate } from "utils/index";
import { Position } from "store/company/reducer";
import { Text } from "components/shared";
import Avatar from "components/Avatar";
import { Stack } from "@mui/material";
import dayjs from "dayjs";

type DesktopCellsProps = {
  item: Position;
  order: number;
};

const DesktopCells = (props: DesktopCellsProps) => {
  const { item, order } = props;
  return (
    <>
      <BodyCell>{order}</BodyCell>
      <BodyCell align="left">
        <Text variant="h6">{item?.name}</Text>
      </BodyCell>
      <BodyCell align="left" noWrap>
        {item?.created_by?.id ? (
          <Stack direction="row" alignItems="center" spacing={1}>
            <Avatar size={32} src={item.created_by?.avatar?.link} />
            <Text variant="body2">{item.created_by?.fullname}</Text>
          </Stack>
        ) : undefined}
      </BodyCell>
      <BodyCell tooltip={dayjs(item.created_time).format(DATE_LOCALE_FORMAT)}>
        {/* {formatDate(item.created_time)} */}
        {dayjs(item.created_time).format(DATE_LOCALE_FORMAT)}
      </BodyCell>
    </>
  );
};

export default memo(DesktopCells);
