"use client";

import { Stack } from "@mui/material";
import { Search } from "components/Filters";
import { Button, IconButton, Text } from "components/shared";
import { DataAction, Permission } from "constant/enums";
import { NS_COMMON, NS_COMPANY } from "constant/index";
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
import { useProjectTypes } from "store/company/selectors";
import { getPath } from "utils/index";
import Form from "./Form";

const Actions = () => {
  const commonT = useTranslations(NS_COMMON);
  const companyT = useTranslations(NS_COMPANY);

  const { isMdSmaller } = useBreakpoint();

  const [isShow, onShow, onHide] = useToggle();
  const pathname = usePathname();
  const { push } = useRouter();
  const { user } = useAuth();

  const { onCreateProjectType, onGetProjectTypes, pageSize, pageIndex } =
    useProjectTypes();
  const [queries, setQueries] = useState<Params>({});
  const [filterField, setFilterField] = useState("name");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChangeQueries = (name: string, value: any) => {
    setQueries((prevQueries) => ({ ...prevQueries, [name]: value }));
  };

  const onSearch = () => {
    const q = { ...queries, fullname: queries["email"] };
    const path = getPath(pathname, q);
    push(path);
  };

  const onClear = () => {
    const newQueries = { pageIndex: 1, pageSize };
    const path = getPath(pathname, newQueries);
    push(path);
    onGetProjectTypes({ ...newQueries });
  };

  const onRefresh = () => {
    onGetProjectTypes({ pageSize, pageIndex });
  };

  // useEffect(() => {
  //   onGetOptions({ pageIndex: 1, pageSize: 20 });
  // }, [onGetOptions]);

  // useEffect(() => {
  //   setQueries(filters);
  // }, [filters]);

  return (
    <>
      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems={{ md: "center" }}
        justifyContent="space-between"
        spacing={{ xs: 1, md: 3 }}
        px={{ xs: 0, md: 3 }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
          spacing={{ xs: 2, md: 0 }}
        >
          <Text variant="h4" display={{ md: "none" }}>
            {companyT("projectTypes.title")}
          </Text>
          {/* <Button
            onClick={onShow}
            startIcon={<PlusIcon />}
            size="extraSmall"
            variant="primary"
            sx={{ height: 32, px: ({ spacing }) => `${spacing(2)}!important` }}
          >
            {commonT("createNew")}
          </Button> */}
          <Search
            name="search_key"
            placeholder={commonT("searchBy", { name: "project type name" })}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSearch();
              }
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
        </Stack>

        {/* <Stack
          direction="row"
          alignItems="center"
          spacing={3}
          py={{ xs: 1.25, md: 0.5, lg: 1.25 }}
          px={{ md: 1, lg: 2 }}
          borderRadius={1}
          width={{ xs: "100%", md: undefined }}
          justifyContent={{ xs: "flex-start", md: "flex-end" }}
          maxWidth={{ xs: "100%", md: "fit-content" }}
          overflow="auto"
          minWidth={{ md: "fit-content" }}
        > */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={3}
          py={{ xs: 1.25, md: 0.5, lg: 1.25 }}
          px={{ md: 1, lg: 2 }}
          justifyContent={{ xs: "flex-start", md: "flex-end" }}
          overflow="hidden"
          width="100%"
        >
          {(user?.roles.includes(Permission.AM) || user?.roles.includes(Permission.MN)) && (
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
            placeholder={commonT("searchBy", { name: "project type name" })}
            name={"name"}
            onChange={onChangeQueries}
            value={queries["name"]}
            sx={{ width: 300, minWidth: 200 }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSearch();
              }
            }}
          /> */}
          {/* <AssignerFilter
            onChange={onChangeQueries}
            value={queries?.["created_by"]}
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
          />
          <Button
            size="extraSmall"
            sx={{
              display: { xs: "none", md: "flex" },
              height: 32,
              px: ({ spacing }) => `${spacing(2)}!important`,
            }}
            onClick={onSearch}
            variant="secondary"
          >
            {commonT("search")}
          </Button> */}
        </Stack>
      </Stack>
      {isShow && (
        <Form
          open={isShow}
          onClose={onHide}
          type={DataAction.CREATE}
          initialValues={INITIAL_VALUES}
          onSubmit={onCreateProjectType}
        />
      )}
    </>
  );
};

export default memo(Actions);

const INITIAL_VALUES = {
  name: "",
};
