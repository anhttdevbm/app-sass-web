import { ChangeEvent, memo } from "react";
import {
  Pagination as MuiPagination,
  PaginationProps as MuiPaginationProps,
  Stack,
  StackProps,
  paginationItemClasses,
} from "@mui/material";
import { Select, Text } from "./shared";
import { useTranslations } from "next-intl";
import { NS_COMMON } from "constant/index";
import { formatNumber } from "utils/index";

type PaginationProps = Omit<MuiPaginationProps, "count"> & {
  totalPages?: number;
  totalItems?: number;
  pageSize: number;
  onChangePage: (newPage: number) => void;
  onChangeSize: (newSize: number, keepPageIndex?: boolean) => void;
  containerProps?: StackProps;
};

const Pagination = (props: PaginationProps) => {
  const {
    totalPages,
    totalItems,
    pageSize,
    onChangePage,
    onChangeSize,
    containerProps,
    sx,
    ...rest
  } = props;

  const t = useTranslations(NS_COMMON);

  const onChange = (_, newPage: number) => {
    onChangePage(newPage);
  };

  const onChangePageSize = (event: ChangeEvent<HTMLInputElement>) => {
    onChangeSize(event.target.value as unknown as number);
  };

  if (!totalPages || !totalItems) return null;

  return (
    <Stack
      direction={{ xs: "column-reverse", sm: "row" }}
      alignItems="center"
      justifyContent={{ xs: "center", md: "flex-start" }}
      width="100%"
      padding={2}
      spacing={{ md: 2 }}
      {...containerProps}
    >
      <MuiPagination
        count={totalPages}
        variant="outlined"
        shape="rounded"
        onChange={onChange}
        sx={{
          [`& .${paginationItemClasses.root}`]: {
            fontWeight: 600,
            border: "none",
            backgroundColor: "#D9F0FD",
            borderRadius : 3
          },
          [`& .${paginationItemClasses.selected}`]: {
            backgroundColor: ({ palette }) =>
              `${palette.primary.main}!important`,
            borderColor: "primary.main",
            color: "common.white",
          },
          ...sx,
        }}
        {...rest}
      />

      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        display={{ xs: "none", md: "flex" }}
      >
        <Text variant="body2" fontWeight={600}>
          {/* {t("paging.show")} */} Show
        </Text>
        <Select
          rootSx={{
            height: 40, background: "#D9F0FD!important",
            borderColor: "transparent",
            color: "black",
            borderRadius: "12px",
          }}
          options={OPTIONS}
          onChange={onChangePageSize}
          value={pageSize}
          size="small"
        />
        <Text variant="body2" fontWeight={600}>
          {/* {t("paging.outOf", { count: formatNumber(totalItems) })} */}
          all of {formatNumber(totalItems)}
        </Text>
      </Stack>
    </Stack>
  );
};

export default memo(Pagination);

export const OPTIONS = [
  { label: "5", value: 5 },
  { label: "10", value: 10 },
  { label: "25", value: 25 },
  { label: "50", value: 50 },
];
