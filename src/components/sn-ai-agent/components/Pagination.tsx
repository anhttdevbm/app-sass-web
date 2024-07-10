import { ChangeEvent, memo } from "react";
import {
  Pagination as MuiPagination,
  PaginationProps as MuiPaginationProps,
  PaginationItem,
  Stack,
  StackProps,
  paginationItemClasses,
} from "@mui/material";
import { Select, Text } from "components/shared";
import { useTranslations } from "next-intl";
import { NS_COMMON } from "constant/index";
import { formatNumber } from "utils/index";
import { ResponsiveStyleValue } from "@mui/system";
import FirstPageIcon from "icons/FirstPageIcon";
import LastPageIcon from "icons/LastPageIcon";
import { OPTIONS } from "components/Pagination";

type PaginationProps = Omit<MuiPaginationProps, "count"> & {
  totalPages: number;
  totalItems?: number;
  pageSize: number;
  onChangePage: (newPage: number) => void;
  onChangeSize: (newSize: number, keepPageIndex?: boolean) => void;
  containerProps?: StackProps;
  showFirstButton?: boolean;
  showLastButton?: boolean;
};

const RenderPaginationItem = (item, FirstPageIcon, LastPageIcon) => {
  if (item.type === "first") {
    return <PaginationItem {...item} component={FirstPageIcon} />;
  }
  if (item.type === "last") {
    return <PaginationItem {...item} component={LastPageIcon} />;
  }
  return <PaginationItem {...item} />;
};

const PageSizeSelector = ({ t, pageSize, onChangePageSize, totalItems }) => (
  <Stack
    direction="row"
    alignItems="center"
    spacing={1}
    display={{ xs: "none", md: "flex" }}
  >
    <Text variant="body2" fontWeight={600}>
      {t("paging.show")}
    </Text>
    <Select
      rootSx={{ borderColor: "grey.100", borderRadius: 2, height: 40 }}
      options={OPTIONS}
      onChange={onChangePageSize}
      value={pageSize}
      size="small"
    />
    <Text variant="body2" fontWeight={600}>
      {t("paging.outOf", { count: formatNumber(totalItems) })}
    </Text>
  </Stack>
);

const Pagination = (props: PaginationProps) => {
  const {
    totalPages,
    totalItems,
    pageSize,
    onChangePage,
    onChangeSize,
    containerProps,
    showFirstButton = true,
    showLastButton = true,
    sx,
    ...rest
  } = props;

  const t = useTranslations(NS_COMMON);

  const direction: ResponsiveStyleValue<
    "column" | "column-reverse" | "row" | "row-reverse"
  > =
    containerProps?.flexDirection === "row-reverse"
      ? { xs: "column-reverse", sm: "row-reverse" }
      : { xs: "column-reverse", sm: "row" };

  const onChange = (_, newPage: number) => {
    onChangePage(newPage);
  };

  const onChangePageSize = (event: ChangeEvent<HTMLInputElement>) => {
    onChangeSize(event.target.value as unknown as number);
  };

  if (!totalPages || !totalItems) return null;

  return (
    <Stack
      direction={direction}
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
        showFirstButton={showFirstButton}
        showLastButton={showLastButton}
        renderItem={(item) =>
          RenderPaginationItem(item, FirstPageIcon, LastPageIcon)
        }
        sx={paginationStyles(sx)}
        {...rest}
      />

      <PageSizeSelector
        t={t}
        pageSize={pageSize}
        onChangePageSize={onChangePageSize}
        totalItems={totalItems}
      />
    </Stack>
  );
};

export default memo(Pagination);

const paginationStyles = (sx) => ({
  [`& .${paginationItemClasses.root}`]: {
    fontWeight: 600,
  },
  [`& .${paginationItemClasses.selected}`]: {
    backgroundColor: ({ palette }) => `${palette.primary.main}!important`,
    borderColor: "primary.main",
    color: "common.white",
  },
  ...sx,
});
