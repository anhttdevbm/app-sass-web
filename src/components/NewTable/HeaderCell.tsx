import { TableCell, TableCellProps } from "@mui/material";
import { Text, TextProps } from "components/shared";
import { ForwardedRef, forwardRef, memo } from "react";

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
          backgroundColor: "#D9F0FD",
          border: 0,
          px: 2,
          py: 2,
          height: { HEIGHT_HEADER },
          borderTopLeftRadius: isStart ? 12 : undefined,
          borderBottomLeftRadius: isStart ? 12 : undefined,
          borderTopRightRadius: isEnd ? 12 : undefined,
          borderBottomRightRadius: isEnd ? 12 : undefined,
          ...sx,
        }}
        ref={ref}
        align="center"
        {...rest}
      >
        {typeof children === "string" ? (
          <Text
            variant="h6"
            {...textProps}
            sx={{
              fontSize: "16px",
              fontWeight: 400,
              color: "#4D4D4D",
            }}
          >
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

export const HEIGHT_HEADER = 65;
