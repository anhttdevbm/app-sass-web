import { Link, Stack } from "@mui/material";
import Avatar from "components/Avatar";
import { BodyCell } from "components/Table";
import { Text } from "components/shared";
import { NS_COMMON } from "constant/index";
import { BILLING_DETAIL_PATH, BILLING_INFO_PATH } from "constant/paths";
import { useTranslations } from "next-intl";
import { memo } from "react";
import { Billing, Budgets } from "store/billing/reducer";
import { formatDate, getPath } from "utils/index";

type DesktopCellsProps = {
  item?: Budgets;
  order: number;
};

const DesktopCells = (props: DesktopCellsProps) => {
  const { item, order } = props;
  const commonT = useTranslations(NS_COMMON);

  return (
    <>
      <BodyCell align="center">
        {/* <Link
          underline="none"
          href={getPath(BILLING_DETAIL_PATH, undefined, {})}
        > */}

        {item?.name}

        {/* </Link> */}
      </BodyCell>

      <BodyCell align="center" sx={{ paddingLeft: 0 }}>
        <Stack direction={"row"} gap={2} spacing={2} alignItems={"center"}>
          <Avatar size={40} src={item?.project?.avatar[0]?.link} />
          {item?.project.name}
        </Stack>
      </BodyCell>

      <BodyCell
        // href={getPath(PROJECT_TASKS_PATH, undefined, { id: item?.id })}
        align="center"
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          {""}
        </Stack>
      </BodyCell>
      <BodyCell align="center" sx={{ paddingRight: 8 }}>
        {item?.revenue}
      </BodyCell>
      <BodyCell align="center" sx={{ paddingRight: 10 }}>
        {item?.revenuePJ}
        {/* <Saved id={item.id} value={item.saved} /> */}
      </BodyCell>
    </>
  );
};

export default memo(DesktopCells);
