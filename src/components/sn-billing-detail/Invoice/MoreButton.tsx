import { ContentCopyRounded } from "@mui/icons-material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Menu, MenuItem, Stack, Typography } from "@mui/material";
import { IconButton } from "components/shared";
import { NS_BILLING } from "constant/index";
import TrashIcon from "icons/TrashIcon";
import { useTranslations } from "next-intl";
import { useState } from "react";
const ITEM_HEIGHT = 48;

function MoreButton({ onDeleteInvoice }) {
  const billingT = useTranslations(NS_BILLING);
  const options = [
    billingT("detail.form.top.button.option.deleteInvoice"),
    billingT("detail.form.top.button.option.duplicateInvoice"),
  ];
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Stack
      direction="row"
      sx={{
        borderRight: "1.5px solid #EBEAF2",
        display: "flex",
        gap: "8px",
        padding: "12px 8px",
        alignItems: "center",
      }}
    >
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon sx={{ height: "24px" }} />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: "25ch",
          },
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option}
            selected={option === "Pyxis"}
            onClick={handleClose}
          >
            {option ===
            billingT("detail.form.top.button.option.duplicateInvoice") ? (
              <Stack gap={2} direction={"row"} alignItems={"center"}>
                <ContentCopyRounded />
                <Typography fontSize={14} fontWeight={700} color="#4D4D4D">
                  {billingT("detail.form.top.button.option.duplicateInvoice")}
                </Typography>
              </Stack>
            ) : (
              <Stack
                gap={2}
                direction={"row"}
                alignItems={"center"}
                color={"red"}
                onClick={onDeleteInvoice}
              >
                <TrashIcon />
                <Typography fontSize={14} fontWeight={700} color="#4D4D4D">
                  {billingT("detail.form.top.button.option.deleteInvoice")}
                </Typography>
              </Stack>
            )}
          </MenuItem>
        ))}
      </Menu>
    </Stack>
  );
}

export default MoreButton;
