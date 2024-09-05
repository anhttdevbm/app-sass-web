/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import PlusIcon from "icons/PlusIcon";
import { Button, Text } from "components/shared";
import { Dropdown, Search } from "components/Filters";
import { getPath } from "utils/index";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { NS_COMMON, NS_COMPANY, NS_DOCS, NS_TICKET } from "constant/index";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import {
  Box,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Stack,
} from "@mui/material";
import { usePathname, useRouter } from "next-intl/client";
import { useTranslations } from "next-intl";
import { useDocs } from "store/docs/selectors";
import NoneIcon from "icons/NoneIcon";
import FilterSearchDocs from "../../../FilterSearchDocs/FilterSearchDocs";
import { DocGroupByEnum } from "constant/enums";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { useParams, useSearchParams } from "next/navigation";
import IconButton from "@mui/material/IconButton";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import MenuIcon from "@mui/icons-material/Menu";
import { changeTypeViewDoc, TypeViewListDoc } from "store/docs/reducer";
import SearchIcon from "icons/SearchIcon";
import useToggle from "hooks/useToggle";
import { TICKET_CREATE_PATH } from "constant/paths";
import { useSelector } from "react-redux";
import { selectSearchTicket } from "store/ticket/selectors";
import { setKeySearchTicket } from "store/ticket/actions";
import { TypeViewList } from "../../../@type";

const ChangeViewListDoc = () => {
  const [typeViewListDoc, setTypeViewListDoc] = useState<TypeViewList>(
    TypeViewList.TABLE,
  );
  const dispatch = useAppDispatch();

  const handleChangeView = (type: TypeViewList) => {
    dispatch(changeTypeViewDoc(type));
    setTypeViewListDoc(type);
  };

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <IconButton
        onClick={() => handleChangeView(TypeViewList.TABLE)}
        aria-label="view-basic"
        sx={{
          backgroundColor:
            typeViewListDoc === TypeViewList.LIST ? "common.white" : "#E9EBF3",
          boxShadow:
            typeViewListDoc === TypeViewList.LIST
              ? "0px 4px 8px rgba(0, 0, 0, 0.1)"
              : "none",
        }}
      >
        <MenuIcon />
      </IconButton>
      <IconButton
        onClick={() => handleChangeView(TypeViewList.LIST)}
        aria-label="view-kanban"
        sx={{
          backgroundColor:
            typeViewListDoc !== TypeViewList.LIST ? "common.white" : "#E9EBF3",
          boxShadow:
            typeViewListDoc !== TypeViewList.LIST
              ? "0px 4px 8px rgba(0, 0, 0, 0.1)"
              : "none",
        }}
      >
        <ViewModuleIcon />
      </IconButton>
    </Stack>
  );
};

type ActionProps = {
  isProjectTabMode: boolean;
};

const Actions = ({ isProjectTabMode }: ActionProps) => {
  const data = useSelector(selectSearchTicket);
  const dispatch = useAppDispatch();
  const t = useTranslations(NS_TICKET);
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const [queries, setQueries] = useState<any>({});
  const queriesRef = useRef(queries);

  const onChangeQueries = (name: string, value: any) => {
    setQueries((prevQueries) => ({ ...prevQueries, [name]: value }));
  };
  useEffect(() => {
    onSearch();
  }, [queries]);

  const onSearch = useCallback(() => {
    let newQueries = {
      ...queries,
      page: 1,
    };
    const payload = {
      ...data,
      keySearch: newQueries?.search_key,
      priority:
        newQueries?.priority?.id == 0 ? "" : newQueries?.priority?.priority,
      assingn: newQueries?.assingn?.id,
      ticketType:
        newQueries?.typeTicket?.id == 0
          ? ""
          : newQueries?.typeTicket?.typeTicket,
    };
    dispatch(setKeySearchTicket(payload));
  }, [queries, data]);


  useEffect(() => {
    setQueries({ search_key: searchParams.get("search_key") });
  }, [searchParams.get("search_key")]);

  return (
    <>
      <Stack
        direction="column"
        justifyContent="space-between"
        spacing={{ xs: 1, md: 2 }}
        px={{ xs: 0, md: 3 }}
        py={{ xs: 0, sm: 1, md: 1 }}
        zIndex={2}
      >
        <Stack
          direction={{ xs: "column", sm: "row", md: "row" }}
          alignItems={{ xs: "start", sm: "center", md: "center" }}
          gap={{ xs: 1 }}
          justifyContent={{ md: "space-between" }}
          width="100%"
          spacing={{ xs: 2, md: 0 }}
        >
          <Box width={{ xs: "100%" }} display={{ xs: "block" }}>
            <Search
              placeholder={t("actions.search")}
              name="search_key"
              onChange={onChangeQueries}
              value={queries?.search_key}
              sx={{
                minWidth: { xs: "100%", sm: 200, md: 200 },
              }}
              onKeyDown={(e) => {
                e.stopPropagation();
                if (e.key === "Enter") {
                  onSearch();
                }
              }}
              startNode={null}
              endNode={<SearchIcon sx={{ color: "dodgerblue" }} />}
              rootSx={{ borderRadius: "2rem" }}
            />
          </Box>
          <Stack
            direction="row"
            justifyContent={{
              xs: "space-between",
              sm: "flex-end",
              md: "flex-end",
            }}
            spacing={1}
            width={{ xs: "100%" }}
          >
            <ChangeViewListDoc />
            <Button
              onClick={() => {
                push(TICKET_CREATE_PATH);
              }}
              size="small"
              variant="primary"
              sx={{
                height: 40,
                width: "fit-content",
                borderRadius: 100,
                background: "linear-gradient(90deg, #2AF598 0%, #009EFD 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(90deg, #2AF598 0%, #009EFD 100%)",
                },
              }}
            >
              <PlusIcon
                sx={{
                  mr: 1,
                  width: 18,
                  height: 18,
                }}
              />
              <Text color="inherit">{t("actions.createTicket")}</Text>
            </Button>
          </Stack>
        </Stack>

        <Box
          bgcolor="background.default"
          borderRadius={{ xs: "0rem", sm: "2rem", md: "2rem" }}
          overflow={{ xs: "auto" }}
          sx={{
            "&::-webkit-scrollbar": {
              display: "none",
            },
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-start"
            width="fit-content"
            spacing={3}
            py={{ xs: 1.25, md: 1, lg: 1.25 }}
            px={{ xs: 3, md: 2, lg: 2 }}
            overflow="auto"
            sx={{
              "&::-webkit-scrollbar": {
                display: "none",
              },
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <Text
              fontSize={{ xs: 12 }}
              sx={{ whiteSpace: "nowrap", color: "grey.700" }}
            >
              {t("actions.viewBy")}
            </Text>
            <FilterSearchDocs queries={queries} onChange={onChangeQueries} />
          </Stack>
        </Box>
      </Stack>
    </>
  );
};

export default memo(Actions);

const Group_OPTIONS = [
  {
    label: "filter.filter.creator",
    value: DocGroupByEnum.CREATED_BY,
    icon: <NoneIcon></NoneIcon>,
  },
  {
    label: "filter.filter.project",
    value: DocGroupByEnum.PROJECT_ID,
    icon: <NoneIcon></NoneIcon>,
  },
];
const Filter_Options = [
  { label: "filter.filter.creator", value: 1 },
  { label: "filter.filter.lastEdited", value: 2 },
  { label: "filter.filter.name", value: 3 },
  { label: "filter.filter.project", value: 4 },
  { label: "filter.filter.projectStatus", value: 5 },
];
