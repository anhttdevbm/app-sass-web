import { ImageList, InputAdornment, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "icons/CloseIcon";
import SearchIcon from "icons/SearchIcon";

interface ForwardHeaderProp {
  onPrevious: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSearchTxt: any;
}
const ForwardHeader = ({ onPrevious, onSearchTxt }: ForwardHeaderProp) => {
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
    onSearchTxt(event.target.value);
  };

  return (
    <>
      <Box sx={{ padding: 3, borderBottom: "1px solid #ECECF3" }}>
        <TextField
          size="small"
          sx={{
            backgroundColor: "var(--gray-0, #F7F7FD)",
            borderRadius: "10px",
            "& .MuiInputBase-root": {
              color: "black",
              borderRadius: "10px",
              border: "1px solid transparent",
            },
          }}
          placeholder="Search"
          fullWidth
          onKeyDown={handleKeyDown}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon
                  sx={{
                    color: "#999999",
                  }}
                />
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </>
  );
};

export default ForwardHeader;
