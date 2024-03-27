import { memo } from "react";
import {
  Checkbox as MuiCheckbox,
  CheckboxProps as MuiCheckboxProps,
} from "@mui/material";
import TickIcon from "icons/TickIcon";
import TickedIcon from "icons/TickedIcon";

type CheckboxProps = MuiCheckboxProps & {};

const Checkbox = (props: CheckboxProps) => {
  const { sx, ...rest } = props;
  return (
    <MuiCheckbox
      sx={{
        p: 0,
        fontSize: "1.5rem!important",
        // color: "#1BC5BD!important",
        // borderBlock: "5px!important",
        // borderRadius: "5px!important",

        ...sx,
      }}
      icon={<TickIcon />}
      checkedIcon={<TickedIcon />}
      {...rest}
    />
  );
};

export default memo(Checkbox);
