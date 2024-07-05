import { memo } from "react";
import { Stack } from "@mui/material";
import { Text } from "components/shared";
import { formatDate } from "utils/index";
import { BodyCell } from "components/Table";
import { Project } from "store/project/reducer";
import { PROJECT_TASKS_PATH } from "constant/paths";
import { getPath } from "utils/index";
import Link from "components/Link";
import Avatar from "components/Avatar";
import { useTranslations } from "next-intl";
import { NS_COMMON, DATE_LOCALE_FORMAT } from "constant/index";
import ProjectPlaceholderImage from "public/images/img-logo-placeholder.webp";
import { Saved, SelectStatus } from "./components";
import dayjs from "dayjs";

type MobileContentCellProps = {
  item: Project;
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
      <BodyCell
        href={getPath(PROJECT_TASKS_PATH, undefined, { id: item.id })}
        align="left"
        sx={{ px: 0.5 }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Avatar
            size={24}
            src={item.avatar?.link ?? ProjectPlaceholderImage}
          />
          <Text
            variant="body2"
            color="text.primary"
            fontWeight={600}
            lineHeight={1.28}
            sx={{ "&:hover": { color: "primary.main" } }}
          >
            {item.name}
          </Text>
        </Stack>
      </BodyCell>
      <BodyCell align="left" sx={{ px: 0.5 }}>
        {item?.owner?.fullname}
      </BodyCell>
      <BodyCell align="left">
        {/* {formatDate(item.start_date)} */}
        {item.start_date ? dayjs(item.start_date).format(DATE_LOCALE_FORMAT) : ""}
      </BodyCell>
      <BodyCell align="left">
        {item.end_date ? dayjs(item.end_date).format(DATE_LOCALE_FORMAT) : ""}
      </BodyCell>
      {item.status ? (
        <BodyCell sx={{ display: 'flex', justifyContent: 'center', width: '100%', alignItems: 'center' }}>
          <SelectStatus value={item.status} id={item.id} />
        </BodyCell>
      ) : (
        <BodyCell />
      )}

      <BodyCell align="center" sx={{ px: 0.5 }}>
        <Saved id={item.id} value={item.saved} />
      </BodyCell>
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
