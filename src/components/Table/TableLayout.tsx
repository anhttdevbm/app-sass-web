import {
  Box,
  BoxProps,
  CircularProgress,
  Stack,
  StackProps,
  SxProps,
  Table,
  TableBody,
  Grid,
  TableCellProps,
  TableHead,
  TableRow,
} from "@mui/material";
import { AN_ERROR_TRY_RELOAD_PAGE, NS_COMMON } from "constant";
import React, {
  createRef,
  forwardRef,
  memo,
  useEffect,
  useMemo,
  useState,
} from "react";
import CellBody, { HEIGHT_ROW } from "./BodyCell";
import CellHeader, { HEIGHT_HEADER } from "./HeaderCell";
import useWindowSize from "hooks/useWindowSize";
import { useSidebar } from "store/app/selectors";
import { useTranslations } from "next-intl";
import { uuid } from "utils/index";
import HeaderSortCell from "./HeaderSortCell";
import { Text } from "components/shared";

export type CellProps = TableCellProps & {
  value: string | React.ReactNode;
  sort?: boolean;
  name?: string;
  data?: string;
  width?: string | number;
  minWidth?: number;
  minwidth?: number | string;
  handler?: any;
};

type TableLayoutProps = {
  numberOfRows?: number;
  headerList: CellProps[];
  children: React.ReactNode;
  pending?: boolean;
  error?: string;
  noData?: boolean;
  hasSelectAll?: boolean;
  onCreate?: () => void;
  onEdit?: () => void;
  orderDirection?: "asc" | "desc";
  orderBy?: string | null;
  headerProps?: TableCellProps;
  containerHeaderProps?: BoxProps;
  accessKey?: string;
  handleRequestSort?: (
    event: React.MouseEvent<unknown>,
    property: string,
  ) => void;
  onLayout?: (refs) => void;
  titleColor?: string;
} & StackProps;

const TableLayout = forwardRef((props: TableLayoutProps, ref) => {
  const {
    numberOfRows = 10,
    headerList,
    children,
    pending,
    error,
    noData,
    hasSelectAll,
    onCreate,
    orderDirection = "asc",
    orderBy = null,
    onEdit,
    headerProps = {},
    handleRequestSort,
    accessKey,
    containerHeaderProps = {},
    titleColor = "grey.400",
    onLayout,
    ...rest
  } = props;
  const commonT = useTranslations(NS_COMMON);

  const { sx: sxHeaderProps, ...restHeaderProps } = headerProps;
  const { sx: sxContainerHeaderProps, ...restContainerHeaderProps } =
    containerHeaderProps;

  const [bodySx, setBodySx] = useState<SxProps>({});

  const size = useWindowSize();
  const { isExpandedSidebar } = useSidebar();

  const refs = useMemo(
    () => headerList?.map(() => createRef<HTMLTableCellElement>()),
    [headerList],
  );

  const nOfColumnsNotWidthFixed = useMemo(
    () =>
      headerList.reduce((out: number, item) => (out += !item.width ? 1 : 0), 0),
    [headerList],
  );

  const hasAdditionalRow = useMemo(
    () => Boolean(error || pending || noData),
    [error, noData, pending],
  );

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;

    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      const newBodySx = refs?.reduce((out, item, index) => {
        out[`& td:nth-of-type(${index + 1}), & th:nth-of-type(${index + 1})`] =
          {
            minWidth: item?.current?.offsetWidth,
            width: item?.current?.offsetWidth,
            maxWidth: item?.current?.offsetWidth,
            overflowX: "hidden",
          };
        return out;
      }, {});
      setBodySx(newBodySx);
    }, 250);
  }, [headerList, refs, children, size, isExpandedSidebar]);

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;

    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      onLayout && onLayout(refs.map((ref) => ref.current?.offsetWidth));
    }, 250);
  }, [onLayout, headerList, refs, size, isExpandedSidebar]);

  return (
    <Stack
      // flex={1}
      // maxHeight={HEIGHT_ROW * (numberOfRows + 1) + HEIGHT_HEADER + 10}
      // maxHeight={HEIGHT_ROW * (numberOfRows + 1)}
      overflow="hidden"
      {...rest}
    >
      <Box
        sx={{
          overflowX: "auto",
          overflowY: "hidden",
          minHeight: HEIGHT_HEADER,
          display: "flex",
          alignItem: "center",
          ...sxContainerHeaderProps,
        }}
        {...restContainerHeaderProps}
      >
        <Table sx={{ width: "100%" }}>
          <TableHead sx={{ width: "100%" }}>
            <TableRow>
              {headerList.map(({ sx: sxItem, component, ...item }, index) =>
                item.sort ? (
                  <HeaderSortCell
                    key={uuid()}
                    {...item}
                    direction={orderDirection}
                    active={orderBy === item.name}
                    component={component}
                    handleRequestSort={handleRequestSort}
                    width={item.width ?? `${100 / nOfColumnsNotWidthFixed}%`}
                    sx={
                      {height:"40px",
                        maxWidth:
                          item.width ?? `${100 / nOfColumnsNotWidthFixed}%`,
                        minWidth: item?.minWidth,
                        ...sxItem,
                        ...sxHeaderProps,
                      } as CellProps["sx"]
                    }
                    isStart={index === 0}
                    isEnd={index === headerList.length - 1}
                    {...restHeaderProps}
                    ref={refs[index]}
                  >
                    {hasSelectAll && index == 0 ? (
                      <Box>
                        <Grid
                          container
                          direction="row"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <Grid item xs={2}>
                            {children}
                          </Grid>
                          <Grid xs={10}>{item.value}</Grid>
                        </Grid>
                      </Box>
                    ) : (
                      item.value
                    )}
                  </HeaderSortCell>
                ) : (
                  <CellHeader
                    onClick={item.handler}
                    key={uuid()}
                    {...item}
                    width={item.width ?? `${100 / nOfColumnsNotWidthFixed}%`}
                    sx={
                      {height:"40px",
                        maxWidth:
                          item.width ?? `${100 / nOfColumnsNotWidthFixed}%`,
                        minWidth: item?.minWidth,
                        ...sxItem,
                        ...sxHeaderProps,
                      } as CellProps["sx"]
                    }
                    isStart={index === 0}
                    isEnd={index === headerList.length - 1}
                    {...restHeaderProps}
                    ref={refs[index]}
                  >
                    {hasSelectAll && index == 0 ? (
                      <Box>
                        <Grid
                          container
                          direction="row"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <Grid item xs={2}>
                            {children}
                          </Grid>
                          <Grid xs={10}>{item.value}</Grid>
                        </Grid>
                      </Box>
                    ) : item.data ? (
                      <>
                        <Text variant="h6" color={titleColor}>
                          {item.value}
                        </Text>
                        <Text variant="h5" color="grey.400">
                          {item.data}
                        </Text>
                      </>
                    ) : (
                      <Text variant="h6" color={titleColor}>
                        {item.value}
                      </Text>
                    )}
                  </CellHeader>
                ),
              )}
            </TableRow>
          </TableHead>
        </Table>
      </Box>

      <Box
        // maxHeight={HEIGHT_ROW * numberOfRows}
        sx={{
          overflowY: "auto",
          overflowX: "hidden",
        }}
        ref={ref}
      >
        <Table>
          <TableBody sx={bodySx}>
            {hasAdditionalRow ? (
              <TableRow>
                <CellBody
                  colSpan={headerList.length}
                  align="center"
                  sx={{ border: "none" }}
                >
                  {pending ? (
                    <CircularProgress size={20} color="primary" />
                  ) : Boolean(error) ? (
                    error ?? AN_ERROR_TRY_RELOAD_PAGE
                  ) : noData ? (
                    commonT("noData")
                  ) : null}
                </CellBody>
              </TableRow>
            ) : hasSelectAll ? (
              ""
            ) : (
              children
            )}
          </TableBody>
        </Table>
      </Box>
    </Stack>
  );
});

export default memo(TableLayout);

TableLayout.displayName = "TableLayout";
