/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import PlusIcon from "icons/PlusIcon";
import { Button, Text } from "components/shared";
import { Dropdown, Search } from "components/Filters";
import { getPath } from "utils/index";
import { memo, useEffect, useMemo, useState } from "react";
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
import FilterSearchDocs from "./FilterSearchDocs/FilterSearchDocs";
import { DocGroupByEnum } from "constant/enums";
import { useAppSelector } from "store/hooks";
import { useParams, useSearchParams } from "next/navigation";
import IconButton from "@mui/material/IconButton";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import MenuIcon from "@mui/icons-material/Menu";
import { useDispatch } from "react-redux";
import { changeTypeViewDoc, TypeViewListDoc } from "store/docs/reducer";
import SearchIcon from "icons/SearchIcon";
import BtnAdd from "./BtnAdd";
import AIGradientIcon from "icons/AIGradientIcon";
import useToggle from "hooks/useToggle";
import { DescriptionOutlined, FileOpenOutlined } from "@mui/icons-material";
import ArrowExport from "icons/ArrowExport";
import AddSquareIcon from "icons/AddSquareIcon";
import { TICKET_CREATE_PATH } from "constant/paths";
import { useSelector } from "react-redux";
import { selectSearchTicket, selectTicketListTicket } from "store/ticket/selectors";
import { setDataListTicket, setKeySearchTicket } from "store/ticket/actions";

function convertStringToArray(inputString) {
  let idArray = inputString.split(",");

  let resultArray = idArray.map((id) => {
    return { id: id, name: "" };
  });

  return resultArray;
}

const ChangeViewListDoc = () => {
  const [typeViewListDoc, setTypeViewListDoc] =
    useState<TypeViewListDoc>("kanbanViewListDoc");
  const dispatch = useDispatch();

  console.log("check", typeViewListDoc)

  const handleViewKanban = () => {
    dispatch(changeTypeViewDoc("kanbanViewListDoc"));
    setTypeViewListDoc("kanbanViewListDoc");
  };

  const handleViewBasic = () => {
    dispatch(changeTypeViewDoc("basicViewListDoc"));
    setTypeViewListDoc("basicViewListDoc");
  };

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <IconButton
        onClick={handleViewKanban}
        aria-label="view-kanban"
        sx={{
          backgroundColor:
            typeViewListDoc !== "kanbanViewListDoc"
              ? "common.white"
              : "#E9EBF3",
          boxShadow:
            typeViewListDoc !== "kanbanViewListDoc"
              ? "0px 4px 8px rgba(0, 0, 0, 0.1)"
              : "none",
        }}
      >
        <ViewModuleIcon />
      </IconButton>
      <IconButton
        onClick={handleViewBasic}
        aria-label="view-basic"
        sx={{
          backgroundColor:
            typeViewListDoc === "kanbanViewListDoc"
              ? "common.white"
              : "#E9EBF3",
          boxShadow:
            typeViewListDoc === "kanbanViewListDoc"
              ? "0px 4px 8px rgba(0, 0, 0, 0.1)"
              : "none",
        }}
      >
        <MenuIcon />
      </IconButton>
    </Stack>
  );
};

type ActionProps = {
  isProjectTabMode: boolean;
};

const Actions = ({ isProjectTabMode }: ActionProps) => {
  const data = useSelector(selectSearchTicket)
  const dispatch = useDispatch();
  const companyT = useTranslations(NS_COMPANY);
  const t = useTranslations(NS_TICKET);
  const commonT = useTranslations(NS_COMMON);
  const docsT = useTranslations(NS_DOCS);
  const pathname = usePathname();
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const [isShowImportForm, onShowImportForm, onHideImportForm] = useToggle();
  const [queries, setQueries] = useState<any>({});

  const onChangeQueries = (name: string, value: any) => {
    setQueries((prevQueries) => ({ ...prevQueries, [name]: value }));
    // onSearch();
  };
  const { id } = useParams();

  const onSearch = () => {
    let newQueries = {
      ...queries,
      page: 1,
      // group_by: DocGroupByEnum.PROJECT_ID,
    };

    const payload = {
      ...data , 
      keySearch : newQueries?.search_key,
      priority : newQueries?.priority?.priority ,
      assingn :newQueries?.assingn?.fullname ,
      ticketType : newQueries?.typeTicket?.typeTicket ,
    }
    dispatch(setKeySearchTicket(payload))
    console.log("ckech fiter", data)

  };


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
        py={1}
        zIndex={2}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent={{ md: "space-between" }}
          width="100%"
          spacing={{ xs: 2, md: 0 }}
        >
          <Box display={{ xs: "block" }}>
            <Search
              placeholder={"Tìm kiếm theo id"}
              name="search_key"
              onChange={onChangeQueries}
              value={queries?.search_key}
              sx={{ minWidth: 200 }}
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
            justifyContent={{ xs: "flex-end" }}
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
              <Text
                sx={{ display: { xs: "none", md: "block" } }}
                color="inherit"
              >
                {t("actions.createTicket")}
              </Text>
            </Button>
          </Stack>
        </Stack>
        <Box
          bgcolor="background.default"
          borderRadius="2rem"
          overflow={{ xs: "auto" }}
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
          >
            <Text sx={{ whiteSpace: "nowrap", color: "grey.700" }}>
              View by:
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
