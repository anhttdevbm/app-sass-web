import { ForwardedRef, forwardRef, memo } from "react";
import {
  TableCell,
  TableCellProps,
  TableSortLabel,
  TableSortLabelProps,
} from "@mui/material";
import { Text, TextProps } from "components/shared";

export type HeaderCellProps = {
  name?: string;
  children: string | React.ReactNode;
  textProps?: TextProps;
  isStart: boolean;
  handleRequestSort?: (
    event: React.MouseEvent<unknown>,
    property: string,
  ) => void;
  isEnd: boolean;
} & TableCellProps &
  TableSortLabelProps;

const HeaderSortCell = forwardRef(
  (props: HeaderCellProps, ref: ForwardedRef<HTMLTableCellElement>) => {
    const {
      children,
      component: Component,
      textProps = {},
      sx,
      handleRequestSort,
      isStart,
      isEnd,
      direction,
      active,
      name,
      ...rest
    } = props;

    const createHandler = (property) => (event) => {
      handleRequestSort && handleRequestSort(event, property);
    };

    return (
      <TableCell
        sx={{
          // "&:hover": {
          //   backgroundColor: "grey.200",
          // },
          backgroundColor: "grey.50",
          borderBottom: "none",
          py: 0,
          borderTopLeftRadius: isStart ? 4 : undefined,
          borderBottomLeftRadius: isStart ? 4 : undefined,
          borderTopRightRadius: isEnd ? 4 : undefined,
          transitionDuration: "0.2s",
          ...sx,
        }}
        height={HEIGHT_HEADER}
        ref={ref}
        align="center"
        sortDirection={active ? direction : false}
        {...rest}
      >
        <TableSortLabel
          active={active}
          direction={direction}
          sx={{
            width: "fit-content",
            "& .MuiTableSortLabel-icon": {
              display: rest.align === "center" ? "none" : "block",
            },
            "&.Mui-active .MuiTableSortLabel-icon": {
              display: "block",
              color: "grey.400",
            },
            "& .MuiTableSortLabel-icon:hover": {
              display: "block",
              color: "grey.300",
            },
            "&.MuiTableSortLabel-root:hover .MuiTableSortLabel-icon": {
              display: "block",
              opacity: 0.8,
            },
            justifyContent:
              rest.align === "left"
                ? "flex-start"
                : rest.align === "right"
                ? "flex-end"
                : "center",
          }}
          color="grey.400"
          onClick={createHandler(name)}
        >
          {typeof children === "string" ? (
            <Text
              variant="h6"
              color="grey.400"
              {...textProps}
              noWrap
              sx={{
                textOverflow: "ellipsis",
                WebkitLineClamp: 1,
                overflow: "hidden",
              }}
            >
              {Component ? <Component /> : children}
            </Text>
          ) : Component ? (
            <Component />
          ) : (
            children
          )}
        </TableSortLabel>
      </TableCell>
    );
  },
);

export default memo(HeaderSortCell);

HeaderSortCell.displayName = "HeaderCell";

export const HEIGHT_HEADER = 40;
