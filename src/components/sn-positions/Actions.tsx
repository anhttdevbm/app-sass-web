"use client";

import { memo, useState } from "react";
import {
  Stack,
  Theme,
  selectClasses,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Button, Text } from "components/shared";
import PlusIcon from "icons/PlusIcon";
import useToggle from "hooks/useToggle";
import { DataAction } from "constant/enums";
import { usePositions } from "store/company/selectors";
import Form from "./Form";
import { Date, Refresh, Search } from "components/Filters";
import {
  DATE_FORMAT_HYPHEN,
  NS_COMMON,
  NS_COMPANY,
  NS_PROJECT,
} from "constant/index";
import { useTranslations } from "next-intl";
import useBreakpoint from "hooks/useBreakpoint";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { usePathname, useRouter } from "next-intl/client";
import { getPath } from "utils/index";
import { AssignerFilter } from "components/sn-project-detail/Tasks/components";

const Actions = () => {
  const commonT = useTranslations(NS_COMMON);
  const companyT = useTranslations(NS_COMPANY);
  const projectT = useTranslations(NS_PROJECT);
  const [queries, setQueries] = useState<Params>({});

  const { push } = useRouter();
  const pathname = usePathname();

  const { breakpoints } = useTheme();
  const { isMdSmaller } = useBreakpoint();
  const is1440Larger = useMediaQuery(breakpoints.up(1440));

  const [isShow, onShow, onHide] = useToggle();
  const { onCreatePosition, onGetPositions, pageSize, pageIndex } =
    usePositions();

  const onRefresh = () => {
    onGetPositions({ pageSize, pageIndex });
  };

  const onChangeQueries = (name: string, value: unknown) => {
    setQueries((prevQueries) => ({ ...prevQueries, [name]: value }));
  };

  const onSearch = () => {
    const path = getPath(pathname, queries);
    push(path);
    onGetPositions(queries);
  };

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        borderBottom={{ md: "1px solid" }}
        borderColor={{ md: "grey.100" }}
        spacing={{ xs: 2, md: 0 }}
        px={{ md: 3 }}
        pt={{ md: 1.5 }}
        pb={1.5}
      >
        <Text variant="h4" display={{ md: "none" }}>
          {companyT("positions.title")}
        </Text>
        <Button
          onClick={onShow}
          startIcon={<PlusIcon />}
          size={"extraSmall"}
          variant="primary"
          sx={{ height: 32, px: ({ spacing }) => `${spacing(2)}!important` }}
        >
          {commonT("createNew")}
        </Button>

        <Stack
          direction="row"
          alignItems="center"
          spacing={3}
          justifyContent={{ xs: "flex-start", md: "flex-end" }}
          overflow="hidden"
          width="100%"
        >
          <Search
            placeholder={commonT("searchBy", {
              name: companyT("position.key"),
            })}
            name="name"
            onChange={onChangeQueries}
            value={queries?.["name"]}
            onEnter={(name, value) => {
              onChangeQueries(name, value);
              onSearch();
            }}
            sx={{
              width: { xs: is1440Larger ? 220 : 160 },
              minWidth: { xs: is1440Larger ? 220 : 160 },
            }}
          />
          <AssignerFilter
            onChange={onChangeQueries}
            value={queries?.["position.owner"]}
            hasAvatar
            sx={{ display: { xs: "none", md: "initial" } }}
            rootSx={{
              "& >svg": { fontSize: 16 },
              px: "0px!important",
              [`& .${selectClasses.outlined}`]: {
                pr: "0!important",
                mr: ({ spacing }: { spacing: Theme["spacing"] }) =>
                  `${spacing(4)}!important`,
                "& .sub": {
                  display: "none",
                },
              },
            }}
          />

          <Date
            label={commonT("form.title.startDate")}
            name="created_time"
            onChange={onChangeQueries}
            value={queries?.["created_time"]}
            format={DATE_FORMAT_HYPHEN}
            iconProps={{
              sx: { fontSize: 16 },
            }}
          />

          <Button
            size="extraSmall"
            sx={{ height: 32, display: { xs: "none", md: "flex" } }}
            onClick={onSearch}
            variant="secondary"
          >
            {commonT("search")}
          </Button>
        </Stack>

        {/* <Refresh onClick={onRefresh} /> */}
      </Stack>
      {isShow && (
        <Form
          open={isShow}
          onClose={onHide}
          type={DataAction.CREATE}
          initialValues={INITIAL_VALUES}
          onSubmit={onCreatePosition}
        />
      )}
    </>
  );
};

export default memo(Actions);

const INITIAL_VALUES = {
  name: "",
};
