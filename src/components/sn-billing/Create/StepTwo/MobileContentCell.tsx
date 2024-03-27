import { Stack } from "@mui/material";
import Link from "components/Link";
import { BodyCell } from "components/Table";
import { Text } from "components/shared";
import { NS_COMMON } from "constant/index";
import { useTranslations } from "next-intl";
import { memo } from "react";
import { Billing, Service } from "store/billing/reducer";
import { formatDate } from "utils/index";

type MobileContentCellProps = {
  item?: Service;
};

type InformationItemProps = {
  label: string;
  children?: string | React.ReactNode;
  href?: string;
};

const MobileContentCell = (props: MobileContentCellProps) => {
  const { item } = props;
  const t = useTranslations(NS_COMMON);
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

export default memo(MobileContentCell);

const InformationItem = (props: InformationItemProps) => {
  const { label, children = "--", href } = props;

  const renderContent = () => {
    return (
      <>
        {typeof children === "string" ? (
          <Text variant="body2" sx={{ wordBreak: "break-word" }}>
            {children}
          </Text>
        ) : (
          children
        )}
      </>
    );
  };

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Text variant="caption" color="grey.400" width={57}>
        {label}
      </Text>
      {href ? (
        <Link href={href} underline="none">
          {renderContent()}
        </Link>
      ) : (
        renderContent()
      )}
    </Stack>
  );
};
