import { Chip, Fab, IconButton, Menu, Tooltip } from "@mui/material";
import { BodyCell } from "components/Table";
import {
  ACCESS_TOKEN_STORAGE_KEY,
  NS_CAREER,
  NS_COMMON,
  NS_FEEDBACK,
} from "constant/index";
import { useTranslations } from "next-intl";
import React, { memo, useState } from "react";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
import { DataAction } from "constant/enums";
import Form from "./Form";
import { clientStorage } from "utils/storage";
import { CareerData } from "store/career/action";
import { useCareer } from "store/career/selectors";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MenuItem from "@mui/material/MenuItem";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { pink } from "@mui/material/colors";
import { CAREER_DETAIL_PATH } from "constant/paths";
import { getPath } from "utils/index";

type DesktopCellsProps = {
  item: CareerData;
};

const DesktopCells = (props: DesktopCellsProps) => {
  const { onGetCareer, items, totalItems, total_page, page, size, isIdle } =
    useCareer();
  const careerT = useTranslations(NS_CAREER);
  const commonT = useTranslations(NS_COMMON);
  const [item, setItem] = useState<CareerData>();
  const [action, setAction] = useState<DataAction | undefined>();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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
    const formattedDate = `${day.toString().padStart(2, "0")}/${month
      .toString()
      .padStart(2, "0")}/${year}`;
    return formattedDate;
  };

  return (
    <>
      <BodyCell
        align="left"
        href={getPath(CAREER_DETAIL_PATH, undefined, { id: String(props.item.slug)})}
        linkProps={{
          sx: { color: "text.primary" },
          tooltip: commonT("clickGoDetail", {
            name: careerT("title_form"),
          }),
        }}
      >
        {props.item.title}
      </BodyCell>
      <BodyCell align="left">{props.item.location}</BodyCell>
      <BodyCell align="left">
        {chuyen_dinh_dang_ngay(props.item.start_time)}{" "}
        {careerT("careerTable.endtime")}{" "}
        {chuyen_dinh_dang_ngay(props.item.end_time)}
      </BodyCell>
      <BodyCell align="left">{props.item.numberOfHires}</BodyCell>
      <BodyCell align="left">{props.item.description}</BodyCell>
      {/* <BodyCell align="left">{item.responsed_content}</BodyCell> */}
      <BodyCell align="left">
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
      </BodyCell>
    </>
  );
};
export default memo(DesktopCells);
