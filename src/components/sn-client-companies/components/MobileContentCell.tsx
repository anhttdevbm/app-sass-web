import { Stack } from "@mui/material";
import Avatar from "components/Avatar";
import Link from "components/Link";
import { Checkbox, Text } from "components/shared";
import { ClientCompany } from "components/sn-client-companies/type";
import { BodyCell } from "components/Table";
import { DataAction } from "constant/enums";
import { DATE_LOCALE_FORMAT, NS_COMMON, NS_COMPANY } from "constant/index";
import { CLIENT_COMPANIES_PATH } from "constant/paths";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { memo, RefObject } from "react";
import DuplicateIcon from "../../../icons/DuplicateIcon";
import EditIcon from "../../../icons/EditIcon";
import ActionsCell from "./ActionsCell";

type MobileContentCellProps = {
  item: ClientCompany;
  checked: boolean;
  indexSelected: number;
  actionCellRef: RefObject<HTMLDivElement>;
  onUpdate: (type: number, item: ClientCompany) => void;
  onDuplicate: (type: number, item: ClientCompany) => void;
  onDelete: (type: number, item: ClientCompany) => void;
  onToggleSelect: (item: ClientCompany, indexSelected: number) => void;
};

type InformationItemProps = {
  label: string;
  children?: string | React.ReactNode;
};

const MobileContentCell = (props: MobileContentCellProps) => {
  const {
    item,
    checked,
    indexSelected,
    actionCellRef,
    onDuplicate,
    onUpdate,
    onDelete,
    onToggleSelect,
  } = props;
  const companyT = useTranslations(NS_COMPANY);
  const commonT = useTranslations(NS_COMMON);
  //onToggleSelect(item, indexSelected)
  return (
    <BodyCell
      align="left"
      sx={{
        display: "flex",
        p: "12px",
        width: "100%!important",
        maxWidth: "unset!important",
        flexDirection: "column",
        height: "auto",
        gap: 2,
      }}
    >
      <Stack direction="row" justifyContent="space-between">
        <Checkbox
          checked={checked}
          onChange={(event) => {
            onToggleSelect(item, indexSelected);
          }}
        />
        <ActionsCell
          sx={{
            verticalAlign: "middle",
            textAlign: "right",
            height: "auto",
          }}
          ref={actionCellRef}
          options={[
            {
              content: commonT("edit"),
              onClick: () => onUpdate(DataAction.UPDATE, item),
              icon: <EditIcon sx={{ color: "grey.400" }} fontSize="medium" />,
            },
            {
              content: companyT("clientCompany.duplicate"),
              onClick: () => onDuplicate(DataAction.OTHER, item),
              icon: (
                <DuplicateIcon sx={{ color: "grey.400" }} fontSize="medium" />
              ),
            },
          ]}
          onDelete={() => onDelete(DataAction.DELETE, item)}
          hasPopup={false}
        />
      </Stack>
      <Stack direction="row" justifyContent="space-between">
        <Text variant="h6" minWidth={108}>
          {companyT("clientCompany.companyName")}
        </Text>
        <Link href={`${CLIENT_COMPANIES_PATH}/${item?.id}`} underline="none">
          <Text variant="h6" align="right">
            {item?.name}
          </Text>
        </Link>
      </Stack>
      <Stack direction="row" justifyContent="space-between">
        <Text variant="h6" minWidth={108}>
          {companyT("clientCompany.createBy")}
        </Text>
        <Stack direction="row" gap={1}>
          <Avatar size={32} src={item?.created_by?.avatar} />
          <Text variant="h6" my="auto" align="right">
            {item?.created_by?.fullname}
          </Text>
        </Stack>
      </Stack>
      <Stack direction="row" justifyContent="space-between">
        <Text variant="h6" minWidth={108}>
          {companyT("clientCompany.createDate")}
        </Text>
        <Text variant="h6">
          {dayjs(item.created_time).format(DATE_LOCALE_FORMAT)}
        </Text>
      </Stack>
    </BodyCell>
  );
};

export default memo(MobileContentCell);
