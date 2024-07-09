import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import { IconButton } from "@mui/material";
import SearchIcon from "../../../icons/SearchIcon";

export interface SearchInputProps {
  placeholder?: string;
  value: string;
  onChange?: (value: string) => void;
}

export const SearchInput = ({
  placeholder,
  onChange,
  value,
}: SearchInputProps) => {
  return (
    <Paper
      component="form"
      sx={{
        p: "2px 16px",
        display: "flex",
        alignItems: "center",
        width: 400,
        boxShadow: "none",
        borderRadius: "100px",
        border: "1px solid #EFEFEF",
        "&:focus-within": {
          borderColor: "#1976d2",
        },
      }}
    >
      <InputBase
        sx={{
          ml: 1,
          flex: 1,
          "& .MuiInputBase-input::placeholder": {
            color: "#00000080",
          },
        }}
        placeholder={placeholder}
        inputProps={{
          "aria-label": `${placeholder}`,
        }}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
      <IconButton sx={{ p: "10px" }} aria-label="menu">
        <SearchIcon
          style={{
            color: "#0575E6",
          }}
        />
      </IconButton>
    </Paper>
  );
};
