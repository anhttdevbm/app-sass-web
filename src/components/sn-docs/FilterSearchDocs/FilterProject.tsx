/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  ButtonBase,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import ChevronIcon from "icons/ChevronIcon";
import { useEffect, useMemo, useState } from "react";
import { useProjects } from "store/project/selectors";
import { FilterSearchDocsProps } from "./FilterSearchDocs";
import { useSearchParams } from "next/navigation";

export interface SelectDataProps {
  id: string;
  value: string;
}

const FilterProject = ({
  onChange,
}: Omit<FilterSearchDocsProps, "queries">) => {
  const searchParams = useSearchParams();
  const [selectedItemValue, setSelectedItemValue] = useState(
    searchParams.get("project") || "all",
  );
  const [open, setOpen] = useState(false);

  const { items: projects, onGetProjects } = useProjects();

  const onChangeSelect = (e: SelectChangeEvent<string>) => {
    setSelectedItemValue(e.target.value);
    onChange({
      project: e.target.value,
    });
  };

  useEffect(() => {
    onGetProjects({ pageSize: -1, pageIndex: 0 });
  }, []);
  return (
    <Box
      sx={{
        padding: "0 0 0 30px",
        border: "1px solid #EFEFEF",
        borderRadius: "100px",
        background: "#FFFFFF",
        minWidth: "150px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        height: "40px",
        position: "relative",
        cursor: "pointer",
        "&:hover": {
          bgcolor: "rgba(0, 0, 0, 0.05)",
        },
      }}
      onClick={() => setOpen(!open)}
    >
      <Typography
        component="span"
        sx={{ fontWeight: "bold", fontSize: "13px", opacity: 0.5 }}
      >
        Project:
      </Typography>
      <Select
        open={open}
        defaultValue="all"
        onClose={() => setOpen(false)}
        value={selectedItemValue}
        onChange={onChangeSelect}
        IconComponent={() => null}
        MenuProps={{
          PaperProps: {
            sx: {
              borderRadius: "12px",
              maxHeight: "50vh",
            },
          },
        }}
        sx={{
          textAlign: "center",
          fontSize: "13px",
          fontFamily: "unset",
          fontWeight: "bold",
          maxWidth: "200px",
          "& fieldset": {
            border: "none",
          },
          "& .MuiSelect-select": {
            padding: "0 40px 0 0 !important",
          },
        }}
      >
        <MenuItem
          sx={{
            fontSize: "13px",
            fontWeight: "Bold",
            color: "neutral.700",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden",
            width: "300px",
            display: "block",
          }}
          value="all"
        >
          All
        </MenuItem>
        {projects &&
          projects.map((item) => (
            <MenuItem
              sx={{
                fontSize: "13px",
                fontWeight: "Bold",
                color: "neutral.700",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
                width: "300px",
                display: "block",
              }}
              key={item.id}
              value={item.id}
            >
              {item.name}
            </MenuItem>
          ))}
      </Select>
      <Box
        sx={{
          position: "absolute",
          right: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          width: "18px",
          height: "18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderWidth: "0.2px",
          borderStyle: "solid",
          borderColor: "#5C5C5C",
          borderRadius: "100%",
          pointerEvents: "none",
        }}
      >
        <ChevronIcon />
      </Box>
    </Box>
  );
};

export default FilterProject;
