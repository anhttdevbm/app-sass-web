import { Stack } from "@mui/material";
import dayjs from "dayjs";
import { memo, useMemo } from "react";
import StringFormat from "string-format";

import Avatar from "components/Avatar";
import Link from "components/Link";
import { BodyCell, StatusCell } from "components/NewTable";
import { Text } from "components/shared";
import { NS_COMPANY } from "constant/index";
import { EMPLOYEES_DETAIL_PATH } from "constant/paths";
import { Employee } from "store/company/reducer";
import { COLOR_STATUS, TEXT_STATUS } from "../helpers";

type DesktopCellsProps = {
  item: Employee;
};

// const DATE_FORMAT = DATE_LOCALE_FORMAT;
const DATE_FORMAT = "DD/MM/YYYY HH:mm";

const DesktopCells = (props: DesktopCellsProps) => {
  const { item } = props;
  const href = useMemo(
    () => StringFormat(EMPLOYEES_DETAIL_PATH, { id: item.id }),
    [item.id],
  );

  // const roleMapping: { [key: string]: string } = {
  //   AM: 'Admin',
  //   MN: 'Manager',
  //   LE: 'Leader',
  //   ST: 'Staff',
  //   CL: 'Client',
  //   CT: 'Contractor',
  //   EU: 'Guest',
  // };

  // const transformedRoles = item.roles.map((role: string) => roleMapping[role] || role);


  return (
    <>
      <BodyCell align="left">
        <Stack direction="row" alignItems="center" spacing={1}>
          <Avatar size={32} src={item?.avatar} />
          <Link href={href}>
            <Text variant="h6">{item.fullname}</Text>
          </Link>
        </Stack>
      </BodyCell>
      <BodyCell align="left" noWrap>
        {item.email}
      </BodyCell>
      <BodyCell
        align="left"
        tooltip={dayjs(item.requestJoinTime).format(DATE_FORMAT)}
      >
        {dayjs(item.requestJoinTime).format(DATE_FORMAT)}
      </BodyCell>
      <StatusCell
        namespace={NS_COMPANY}
        text={TEXT_STATUS[item.status]}
        color={COLOR_STATUS[item.status]}
        width={93}
        align="center"
      />
    </>
  );
};

export default memo(DesktopCells);
