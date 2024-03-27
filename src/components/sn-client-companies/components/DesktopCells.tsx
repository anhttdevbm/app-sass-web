import { Stack } from "@mui/material";
import Avatar from "components/Avatar";
import { BodyCell } from "components/Table";
import { Text } from "components/shared";
import {
  DATE_LOCALE_FORMAT
} from "constant/index";
import dayjs from "dayjs";
import { memo } from "react";
import { ClientCompany } from "store/company/reducer";

type DesktopCellsProps = {
  item: ClientCompany;
  order: number;
};

const DesktopCells = (props: DesktopCellsProps) => {
  const { item, order } = props;
  return (
    <>
      <BodyCell>{order}</BodyCell>
      <BodyCell align="left">
        <Stack direction="row" alignItems="center" spacing={1}>
          <Avatar size={32} />
          <Text variant="h6">{item.name}</Text>
        </Stack>
      </BodyCell>
      <BodyCell align="left">
        <Stack direction="row" alignItems="center" spacing={1}>
          <Avatar size={32} />
          <Text variant="h6">{item?.contact?.name}</Text>
        </Stack>
      </BodyCell>
      <BodyCell tooltip={dayjs(item.created_time).format(DATE_LOCALE_FORMAT)}>
        {dayjs(item.created_time).format(DATE_LOCALE_FORMAT)}
      </BodyCell>
    </>
  );
};

export default memo(DesktopCells);
