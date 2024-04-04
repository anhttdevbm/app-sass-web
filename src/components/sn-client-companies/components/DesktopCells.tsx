import { Stack } from "@mui/material";
import Avatar from "components/Avatar";
import { BodyCell } from "components/Table";
import { Text } from "components/shared";
import Link from "components/Link";
import { CLIENT_COMPANIES_PATH } from "constant/paths";
import { DATE_LOCALE_FORMAT } from "constant/index";
import dayjs from "dayjs";
import { memo } from "react";
import { ClientCompany, IAvatar } from "components/sn-client-companies/type";
import LogoPlaceholderImage from "public/images/img-user-placeholder.webp";

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
          <Avatar
            size={32}
            src={
              Array.isArray(item?.avatar) && !!item?.avatar?.length
                ? (item?.avatar[0] as IAvatar)?.link
                : LogoPlaceholderImage
            }
          />
          <Link href={`${CLIENT_COMPANIES_PATH}/${item?.id}`} underline="none">
            <Text
              variant="h6"
              sx={{
                "&:hover": { color: "primary.main" },
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 1,
                overflow: "hidden",
                wordBreak: "break-word",
                display: "-webkit-box",
                textOverflow: "ellipsis",
              }}
            >
              {item.name}
            </Text>
          </Link>
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
