import { Button } from "components/shared";
import { NS_DOCS } from "constant/index";
import { useTranslations } from "next-intl";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Box, Typography, useMediaQuery } from "@mui/material";
import { Theme } from '@mui/material/styles';

export default function BtnAdd({ loading }: { loading?: boolean }) {
  const docsT = useTranslations(NS_DOCS);

  return (
    <Button
      disabled={loading}
      size={useMediaQuery((theme: Theme) => theme.breakpoints.up('md')) ? "medium" : "small"}
      variant="contained"
      sx={{
        boxShadow: "none",
        fontWeight: "700",
        background: "linear-gradient(90deg, #2AF598 0%, #009EFD 100%)",
        "&:hover": {
          background: "linear-gradient(90deg, #2AF598 0%, #009EFD 100%)",
        },
        borderRadius: "100px",
        height: useMediaQuery((theme: Theme) => theme.breakpoints.up('md')) ? 56 : 40,
        width: useMediaQuery((theme: Theme) => theme.breakpoints.up('md')) ? 131 : 124,
        "&.MuiButton-sizeMedium": {
          padding: 0,
        },
        "span,svg": { fontWeight: "700" },
        svg: {
          color: "common.white",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          gap: 1,
        }}
      >
        <AddIcon sx={{ marginRight: "4px", height: 24, width: 24 }} />
        <Typography variant="button">{docsT("button.add")}</Typography>
        <Box
          sx={{
            borderLeft: "1px solid",
            borderColor: "common.white",
            height: "100%",
            opacity: "50%",
          }}
        ></Box>
        <KeyboardArrowDownIcon sx={{ height: 14, width: 14 }} />
      </Box>
    </Button>
  );
}
