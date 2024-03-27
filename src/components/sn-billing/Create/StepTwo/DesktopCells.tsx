import { Link, Stack } from "@mui/material";
import { BodyCell } from "components/Table";
import { Text } from "components/shared";
import { NS_COMMON } from "constant/index";
import { BILLING_DETAIL_PATH, BILLING_INFO_PATH } from "constant/paths";
import { useTranslations } from "next-intl";
import { memo } from "react";
import { Billing, Service } from "store/billing/reducer";
import { formatDate, getPath } from "utils/index";

type DesktopCellsProps = {
  item?: Service;
  order: number;
};

const DesktopCells = (props: DesktopCellsProps) => {
  const { item, order } = props;
  const commonT = useTranslations(NS_COMMON);

  return (
    <>
      <BodyCell align="left">
        {/* <Link
          underline="none"
          href={getPath(BILLING_DETAIL_PATH, undefined, {})}
        > */}

        {item?.billType}

        {/* </Link> */}
      </BodyCell>

      <BodyCell align="left" sx={{ paddingLeft: 0 }}>
        {item?.desc}
      </BodyCell>
      <BodyCell align="left">{item?.unit}</BodyCell>

      <BodyCell
        // href={getPath(PROJECT_TASKS_PATH, undefined, { id: item?.id })}
        align="left"
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          {item?.qty}
        </Stack>
      </BodyCell>
      <BodyCell align="center">{item?.price}</BodyCell>
      <BodyCell align="center">{item?.markUp}</BodyCell>
    </>
  );
};

export default memo(DesktopCells);
