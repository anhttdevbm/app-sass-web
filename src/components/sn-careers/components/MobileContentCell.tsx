import { Chip, Stack, Tooltip } from "@mui/material";
import { BodyCell } from "components/Table";
import { IconButton, Text } from "components/shared";
import { memo, useState } from "react";
import { useTranslations } from "next-intl";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
import { DataAction } from "constant/enums";
import Form from "./Form";
import { NS_CAREER } from "constant/index";
import { CareerData } from "store/career/action";

type MobileContentCellProps = {
  item: CareerData;
};
type InformationItemProps = {
  label: string;
  children?: string | React.ReactNode;
};

const MobileContentCell = (props: MobileContentCellProps) => {
  const careerT = useTranslations(NS_CAREER);
  const [item, setItem] = useState<CareerData>();
  const [action, setAction] = useState<DataAction | undefined>();

  const onActionToItem = (action: DataAction, item?: CareerData) => {
    return () => {
      if (action === DataAction.DELETE) {
        //Không Có chức năng này
        console.log(props.item);
      } else {
        item && setItem(props.item);
        // console.log(action);
      }
      setAction(action);
    };
  };

  const chuyen_dinh_dang_ngay = (dateString) => {
    const dateObject = new Date(dateString);

    // Lấy thông tin ngày, tháng, năm
    const year = dateObject.getFullYear();
    const month = dateObject.getMonth() + 1;
    const day = dateObject.getDate();

    // Tạo chuỗi mới với định dạng yyyy/mm/dd
    const formattedDate = `${day.toString().padStart(2, "0")}/${month.toString().padStart(2, "0")}/${year}`;

    return formattedDate;
  };

  return (
    <BodyCell align="left">
      <Stack spacing={2} py={1.5}>
        <InformationItem label={careerT("careerTable.title")}>
          <Text>{props.item.title}</Text>
        </InformationItem>
        <InformationItem label={careerT("careerTable.location")}>
          {props.item.location}
        </InformationItem>
        <InformationItem label={careerT("careerTable.time")}>
          {chuyen_dinh_dang_ngay(props.item.start_time)} {careerT("careerTable.endtime")} {chuyen_dinh_dang_ngay(props.item.end_time)}
        </InformationItem>
        <InformationItem label={careerT("careerTable.numberOfHires")}>
          {props.item.numberOfHires}
        </InformationItem>
        <InformationItem label={careerT("careerTable.description")}>
          {props.item.description}
        </InformationItem>
        <InformationItem label={careerT("status")}>
          {props.item.is_opening === true ? (
            <Chip
              size="small"
              label={careerT("careerTable.statusList.is_opening")}
              color="success"
            />
          ) : (
            <Chip
              size="small"
              label={careerT("careerTable.statusList.is_closed")}
              color="primary"
            />
          )}
        </InformationItem>
      </Stack>
    </BodyCell>
  );
};

export default memo(MobileContentCell);

const InformationItem = (props: InformationItemProps) => {
  const { label, children = "--" } = props;

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Text variant="caption" color="grey.400" width={57}>
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
