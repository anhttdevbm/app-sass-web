import { memo } from "react";
import { Stack, StackProps } from "@mui/material";
import Avatar from "components/Avatar";
import { Text } from "components/shared";
import { BodyCell } from "components/Table";
import { Member } from "store/project/reducer";
import { Collapse, DeleteUser } from "./components";
import { formatDate } from "utils/index";
import { NS_COMMON, NS_PROJECT } from "constant/index";
import { useTranslations } from "next-intl";

type MobileContentCellProps = {
  item: Member;
};

type InformationItemProps = StackProps & {
  label: string;
  children?: string | React.ReactNode;
};

const MobileContentCell = (props: MobileContentCellProps) => {
  const { item } = props;
  const commonT = useTranslations(NS_COMMON);
  const projectT = useTranslations(NS_PROJECT);

  return (
    <BodyCell align="left" sx={{ px: 0 }}>
      <Collapse label={<Label item={item} />}>
        <Stack px={2}>
          <InformationItem label={commonT("position")}>
            {item?.position?.name}
          </InformationItem>
          <InformationItem
            label={projectT("detailMembers.hoursWorked")}
          ></InformationItem>
          <InformationItem
            label={projectT("detailMembers.dateAddedProject")}
            borderBottom="none"
          >
            {formatDate(item.date_in)}
          </InformationItem>
        </Stack>
      </Collapse>
    </BodyCell>
  );
};

export default memo(MobileContentCell);

const Label = ({ item }: { item: Member }) => {
  return (
    <Stack
      direction="row"
      py={1.5}
      alignItems="center"
      justifyContent="space-between"
      spacing={1}
      width="100%"
      pr={3}
    >
      <Stack direction="row" py={1.5} alignItems="center" spacing={1}>
        <Avatar size={32} src={item?.avatar?.link} />
        <Stack>
          <Text variant="h6">{item.fullname}</Text>
          <Text variant="caption"></Text>
        </Stack>
      </Stack>
      <DeleteUser id={item.id} />
    </Stack>
  );
};

const InformationItem = (props: InformationItemProps) => {
  const { label, children = "--", ...rest } = props;

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      spacing={2}
      px={3}
      py={1}
      borderBottom="1px solid"
      borderColor="grey.100"
      {...rest}
    >
      <Text variant="h6" color="grey.400" maxWidth="50%">
        {label}
      </Text>

      {typeof children === "string" ? (
        <Text variant="body2" noWrap>
          {children}
        </Text>
      ) : (
        children
      )}
    </Stack>
  );
};
