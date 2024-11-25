"use client";

import {
  Stack,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { Search } from "components/Filters";
import { Button, IconButton, Text } from "components/shared";
import { DataAction, Permission } from "constant/enums";
import {
  NS_COMMON,
  NS_COMPANY,
  NS_PROJECT
} from "constant/index";
import useBreakpoint from "hooks/useBreakpoint";
import useToggle from "hooks/useToggle";
import AddSquareIcon from "icons/AddSquareIcon";
import PlusIcon from "icons/PlusIcon";
import SearchIcon from "icons/SearchIcon";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next-intl/client";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { memo, useState } from "react";
import { useAuth } from "store/app/selectors";
import { usePositions } from "store/company/selectors";
import { getPath } from "utils/index";
import Form from "./Form";

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
  const { user } = useAuth();

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
        <Search
          name="search_key"
          placeholder={commonT("searchBy", {
            name: companyT("position.key"),
          })}
          onEnter={(name, value) => {
            onChangeQueries(name, value);
            onSearch();
          }}
          onChange={onChangeQueries}
          sx={{
            height: 40,
            width: {
              lg: 332,
            },
            ".MuiInputBase-root": { height: 40, borderRadius: "100px" },
          }}
          value={queries?.["name"]}
          startNode={""}
          endNode={<IconButton aria-label="search"><SearchIcon onClick={onSearch} style={{ color: "#0575E6", height: "18px", width: "18px" }} /></IconButton>}
        />

        <Stack
          direction="row"
          alignItems="center"
          spacing={3}
          justifyContent={{ xs: "flex-start", md: "flex-end" }}
          overflow="hidden"
          width="100%"
        >
          {(user?.roles.includes(Permission.AM)) && (
            <Button
              onClick={onShow}
              size="small"
              variant="contained"
              sx={{
                boxShadow: "none",

                fontWeight: "700",
                background: "linear-gradient(90deg, #2AF598 0%, #009EFD 100%)",
                "&:hover": {
                  background: "linear-gradient(90deg, #2AF598 0%, #009EFD 100%)",
                },
                borderRadius: "100px",
                height: 40,
                width: 129,
                "p,svg": { fontWeight: "700" },
                svg: {
                  border: "1px solid white",
                  borderRadius: "50px",
                  color: "#2AF598",
                  background: "white",
                },
              }}
            >
              <AddSquareIcon
                sx={{
                  display: { xs: "block", md: "none" },
                  width: 24,
                  height: 24,
                }}
              />
              <PlusIcon
                sx={{
                  display: { xs: "none", md: "block" },
                  mr: 1,
                  width: 18,
                  height: 18,
                }}
              />
              <Text sx={{ fontSize: "16px", display: { xs: "none", md: "block" } }} color="inherit">
                {commonT("createNew")}
              </Text>
            </Button>
          )}

          {/* <Search
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
          /> */}
          {/* <AssignerFilter
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
          /> */}

          {/* <Date
            label={commonT("form.title.startDate")}
            name="created_time"
            onChange={onChangeQueries}
            value={queries?.["created_time"]}
            format={DATE_FORMAT_HYPHEN}
            iconProps={{
              sx: { fontSize: 16 },
            }}
          /> */}

          {/* <Button
            size="extraSmall"
            sx={{ height: 32, display: { xs: "none", md: "flex" } }}
            onClick={onSearch}
            variant="secondary"
          >
            {commonT("search")}
          </Button>*/}
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
