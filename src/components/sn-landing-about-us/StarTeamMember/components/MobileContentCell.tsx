import { memo, useState } from "react";
import { Text } from "components/shared";
import { formatDate } from "utils/index";
import { BodyCell } from "components/Table";
import { NS_CONTENTS } from "constant/index";
import { useTranslations } from "next-intl";
import { IApplicant } from "constant/types";
import { Stack, Link, Tooltip,　IconButton } from "@mui/material";
import Preview, { TitlePreview } from "components/Preview";
import { downloadImage,　copyImage } from "utils/index";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
import { DataAction } from "constant/enums";
import DownloadIcon from "icons/DownloadIcon";
import LinkIcon from "icons/LinkIcon";
import { clientStorage } from "utils/storage";
import { StartMemberData } from "store/content/reducer";

type MobileContentCellProps = {
  item: StartMemberData;
};

type InformationItemProps = {
  label: string;
  children?: string | React.ReactNode;
};

const MobileContentCell = (props: MobileContentCellProps) => {
  const contentT = useTranslations(NS_CONTENTS);

  return (
      <Stack spacing={2} py={1.5}>
        <InformationItem label={contentT("aboutUs.startTeamMemberTable.name")}>
          <Text>{props.item.name}</Text>
        </InformationItem>
        <InformationItem label={contentT("aboutUs.startTeamMemberTable.work_experience")}>
          <Text>{props.item.work_experience}</Text>
        </InformationItem>

        <InformationItem label={contentT("aboutUs.startTeamMemberTable.college")}>
          <Text>{props.item.college}</Text>
        </InformationItem>
        <InformationItem label={contentT("aboutUs.startTeamMemberTable.email")}>
          <Text>{props.item.email}</Text>
        </InformationItem>
      </Stack>
  );
};

export default memo(MobileContentCell);

const InformationItem = (props: InformationItemProps) => {
  const { label, children = "--" } = props;

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Text variant="caption" color="grey.400" width={100}>
        {label}
      </Text>

      {typeof children === "string" ? (
        <Text variant="body2" color="text.primary" noWrap>
          {children}
        </Text>
      ) : (
        children
      )}
    </Stack>
  );
};
