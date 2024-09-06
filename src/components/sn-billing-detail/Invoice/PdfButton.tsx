import { Menu, MenuItem, Stack, Typography } from "@mui/material";
import { IconButton } from "components/shared";
import { INVOICE_EXPORT_PATH } from "constant/paths";
import DownloadPdfIcon from "icons/DownloadPdfIcon";
import PdfIcon from "icons/PdfIcon";
import ViewPDFIcon from "icons/ViewPDFIcon";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import StringFormat from "string-format";
const ITEM_HEIGHT = 48;

function PdfButton({ handleDownloadPdf }) {
  const { id } = useParams();
  const { push } = useRouter();
  const options = ["View PDF", "Download PDF"];
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleViewPdf = () => {
    push(StringFormat(INVOICE_EXPORT_PATH, { id }));
  };

  return (
    <Stack
      direction="row"
      sx={{
        borderRight: "1.5px solid #EBEAF2",
        display: "flex",
        gap: "8px",
        padding: "6px 8px",
        alignItems: "center",
      }}
    >
      <PdfIcon sx={{ width: "12px", height: "12px", margin: "auto 0" }} />

      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <Typography fontSize={14} fontWeight={400} color="#000000">
          PDF/Print
        </Typography>
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
            {option === "View PDF" ? (
              <Stack
                onClick={handleViewPdf}
                gap={2}
                direction={"row"}
                alignItems={"center"}
              >
                <Typography fontSize={14} fontWeight={700} color="#4D4D4D">
                  View PDF
                </Typography>
                <ViewPDFIcon />
              </Stack>
            ) : (
              <Stack
                onClick={handleDownloadPdf}
                gap={2}
                direction={"row"}
                alignItems={"center"}
                color={"red"}
              >
                <Typography fontSize={14} fontWeight={700} color="#4D4D4D">
                  Download PDF
                </Typography>
                <DownloadPdfIcon />
              </Stack>
            )}
          </MenuItem>
        ))}
      </Menu>
    </Stack>
  );
}

export default PdfButton;
