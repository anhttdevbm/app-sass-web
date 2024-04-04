import { ForwardedRef, forwardRef, memo } from "react";
import { TableCell, TableCellProps } from "@mui/material";
import { Text, TextProps } from "components/shared";

export type HeaderCellProps = {
  children: string | React.ReactNode;
  textProps?: TextProps;
  isStart: boolean;
  isEnd: boolean;
} & TableCellProps;

const HeaderCell = forwardRef(
  (props: HeaderCellProps, ref: ForwardedRef<HTMLTableCellElement>) => {
    const { children, textProps = {}, sx, isStart, isEnd, ...rest } = props;

    return (
      <TableCell
        sx={{
          backgroundColor: "grey.50",
          borderBottom: "none",
          py: 0,
          borderTopLeftRadius: isStart ? 4 : undefined,
          borderBottomLeftRadius: isStart ? 4 : undefined,
          borderTopRightRadius: isEnd ? 4 : undefined,
          borderBottomRightRadius: isEnd ? 4 : undefined,
          ...sx,
        }}
        height={HEIGHT_HEADER}
        ref={ref}
        align="center"
        {...rest}
      >
        {typeof children === "string" ? (
          <Text variant="h6" color="grey.400" {...textProps}>
            {children}
          </Text>
        ) : (
          children
        )}
      </TableCell>
    );
  },
);

export default memo(HeaderCell);

HeaderCell.displayName = "HeaderCell";

export const HEIGHT_HEADER = 40;
