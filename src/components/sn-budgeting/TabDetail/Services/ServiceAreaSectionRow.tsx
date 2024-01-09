import { Dispatch, SetStateAction } from "react";
import {
  Stack,
  TableRow, TableCell,
  Collapse
} from "@mui/material";
import { BodyCell } from "components/Table";
import { useState } from "react";
import ExpandCircleDownOutlinedIcon from "@mui/icons-material/ExpandCircleDownOutlined";
import { PTag } from "./ServiceUtil";
import { IconButton } from "components/shared";
import MoreDotIcon from "icons/MoreDotIcon";
import { TSection, budgetDetailRef } from "components/sn-budgeting/BudgetDetail";

interface ServiceAreaSectionRowProps {
  section: TSection;
  setAnchorEl: Dispatch<SetStateAction<HTMLButtonElement | null>>;
  anchorEl: HTMLButtonElement | null;
}

function ServiceAreaSectionRow({
  section,
  anchorEl,
  setAnchorEl,
}: ServiceAreaSectionRowProps) {
  const { name, workingTime, price, cost, description } = section;
  const [isCollapse, setIsCollapse] = useState(false);

  return (
    <TableRow
      sx={{
        "& .MuiTableCell-root": {
          borderBottom: "none",
        },
      }}
    >
      <TableRow>
        <BodyCell align="left">
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-start"
            onClick={() => setIsCollapse((prev) => !prev)}
            sx={{
              cursor: "pointer",
              "&:hover": { color: "primary.main" },
              "&:hover svg": { color: "primary.main" },
            }}
          >
            <ExpandCircleDownOutlinedIcon
              sx={{
                color: "grey.300",
                mr: 1,
                transform: isCollapse ? "rotate(180deg)" : "none",
              }}
            />
            <PTag>{name}</PTag>
          </Stack>
        </BodyCell>
        <BodyCell>{workingTime}</BodyCell>
        <BodyCell>{price}</BodyCell>
        <BodyCell>{cost}</BodyCell>
        <BodyCell>
          <IconButton
            noPadding
            sx={{ transform: "translateX(-50%)" }}
            onClick={(e) => {
              if (Boolean(anchorEl)) {
                budgetDetailRef.current?.setSelectedServiceData(null);
                setAnchorEl(null);
              } else {
                budgetDetailRef.current?.setSelectedServiceData(section?.service);
                setAnchorEl(e.currentTarget);
              }
            }}
          >
            <MoreDotIcon fontSize="medium" sx={{ color: "grey.300" }} />
          </IconButton>
        </BodyCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={12} sx={{ py: 0 }}>
          <Collapse in={isCollapse} timeout="auto" unmountOnExit>
            {description}
          </Collapse>
        </TableCell>
      </TableRow>
    </TableRow>
  );
}

export default ServiceAreaSectionRow;
