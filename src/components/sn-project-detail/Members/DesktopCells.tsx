import { Stack } from "@mui/material";
import Avatar from "components/Avatar";
import { Text } from "components/shared";
import { BodyCell } from "components/Table";
import { DATE_LOCALE_FORMAT } from "constant/index";
import dayjs from "dayjs";
import ProjectPlaceholderImage from "public/images/img-logo-placeholder.webp";
import { memo } from "react";
import { Member } from "store/project/reducer";
import { DeleteUser } from "./components";


type DesktopCellsProps = {
  item: Member;
  order: number;
};

const DesktopCells = (props: DesktopCellsProps) => {
  const { item, order } = props;
  const avatarSrc = typeof item.avatar === 'object' ? item.avatar.link : item.avatar;

  return (
    <>
      <BodyCell align="center">{order}</BodyCell>
      <BodyCell align="left">
        <Stack direction="row" alignItems="center" spacing={1}>
          <Avatar size={32} src={avatarSrc ?? ProjectPlaceholderImage} />
          <Text variant="h6">{item.fullname}</Text>
        </Stack>
      </BodyCell>
      <BodyCell align="left" textProps={{ noWrap: true }} tooltip={item.email}>
        {item.email}
      </BodyCell>
      <BodyCell>{item?.position?.name}</BodyCell>
      <BodyCell></BodyCell>
      <BodyCell tooltip={dayjs(item.date_in).format(DATE_LOCALE_FORMAT)}>
        {/* {formatDate(item?.date_in)} */}
        {dayjs(item.date_in).format(DATE_LOCALE_FORMAT)}
      </BodyCell>
      <BodyCell align="left">
        <DeleteUser id={item.id} />
      </BodyCell>
    </>
  );
};

export default memo(DesktopCells);
