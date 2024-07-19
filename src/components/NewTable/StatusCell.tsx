import { memo } from "react";
import { AlertColor, TableCellProps } from "@mui/material";

import TextStatus from "components/TextStatus";
import { TextProps } from "components/shared";
import BodyCell from "./BodyCell";

type StatusCellProps = {
  text: string;
  color: AlertColor | "purple" | "positive";
  width?: TextProps["minWidth"];
  namespace?: string;
  textAlign?: string;
  textProps?: Omit<TextProps, "color" | "width">;
} & Omit<TableCellProps, "width">;

const StatusCell = (props: StatusCellProps) => {
  const { text, color, width, namespace, textProps, align, ...rest } = props;

  return (
    <BodyCell align={align} {...rest}>
      <TextStatus
        text={text}
        color={color}
        width={width}
        namespace={namespace}
        sx={{ borderRadius: 999 }}
        textAlign={align}
        {...textProps}
      />
    </BodyCell>
  );
};

export default memo(StatusCell);
