import { memo } from "react";
import {
  Checkbox as MuiCheckbox,
  CheckboxProps as MuiCheckboxProps,
} from "@mui/material";
import TickIcon from "icons/TickIcon";
import TickedIcon from "icons/TickedIcon";

type CheckboxProps = MuiCheckboxProps & {
  checkedColor?: string;
};

const Checkbox = ({ sx, checkedColor = "#1BC5BD", ...rest }: CheckboxProps) => {
  return (
    <MuiCheckbox
      sx={{
        p: 0,
        fontSize: "1.5rem!important",
        // borderBlock: "5px!important",
        // borderRadius: "5px!important",
        "&.Mui-checked": {
          color: checkedColor,
        },
        ...sx,
      }}
      icon={<TickIcon />}
      checkedIcon={<TickedIcon />}
      {...rest}
    />
  );
};

export default memo(Checkbox);
