import {
  OutlinedInputProps,
  TextField as TextFiledMui,
  TextFieldProps,
  alpha,
  Theme,
} from "@mui/material";
import styled from "styled-components";

type TextFieldCustomProps = TextFieldProps & {
  theme: Theme;
};

export const TextField = styled(({ theme, ...props }: TextFieldCustomProps) => (
  <TextFiledMui
    InputProps={{ disableUnderline: true } as Partial<OutlinedInputProps>}
    {...props}
  />
))(({ theme, value }) => ({
  "& .MuiFilledInput-root": {
    overflow: "hidden",
    borderRadius: 0,
    backgroundColor: theme.palette.background.default,
    border: "1px solid",
    borderColor: alpha("#3699FF", 0.5),
    transition: theme.transitions.create([
      "border-color",
      "background-color",
      "box-shadow",
    ]),
    "&:hover": {
      backgroundColor: theme.palette.background.default,
    },
    "&.Mui-focused": {
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 2px`,
      borderColor: theme.palette.primary.main,
      backgroundColor: theme.palette.background.default,
    },
  },
  "& .MuiInputLabel-root": {
    fontWeight: 400,
    color: theme.palette.grey[300],
    ...(value ? { fontSize: "0.75rem", color: theme.palette.grey[300] } : {}),
    "&.Mui-focused": {
      fontSize: "0.75rem",
      color: theme.palette.grey[300],
    },
    left: "8px",
  },
  "& .MuiInputBase-input": {
    paddingLeft: "20px",
    paddingRight: "20px",
  },
}));
