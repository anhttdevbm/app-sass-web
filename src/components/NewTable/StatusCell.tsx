import { memo } from "react";
import { AlertColor, TableCellProps } from "@mui/material";
import { BodyCell } from "components/Table";
import TextStatus from "components/TextStatus";
import { TextProps } from "components/shared";

type StatusCellProps = {
  text: string;
  color: AlertColor | "purple" | "positive";
  width?: TextProps["minWidth"];
  namespace?: string;
  textProps?: Omit<TextProps, "color" | "width">;
} & Omit<TableCellProps, "width">;

const StatusCell = (props: StatusCellProps) => {
  const { text, color, width, namespace, textProps, ...rest } = props;

  return (
    <BodyCell {...rest}>
      <TextStatus
        text={text}
        color={color}
        width={width}
        namespace={namespace}
        {...textProps}
      />
    </BodyCell>
  );
};

export default memo(StatusCell);
