/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import PlusIcon from "icons/PlusIcon";
import { Button, Text } from "components/shared";
import { Dropdown, Search } from "components/Filters";
import { getPath } from "utils/index";
import { memo, useEffect, useMemo, useState } from "react";
import { NS_COMMON, NS_COMPANY, NS_DOCS } from "constant/index";
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
import ButtonWithDropdown from "./ButtonWithDropdown";
import AIGradientIcon from "icons/AIGradientIcon";
import useToggle from "hooks/useToggle";
import ImportForm from "./ImportForm";
import { DescriptionOutlined, FileOpenOutlined } from "@mui/icons-material";

function convertStringToArray(inputString) {
  let idArray = inputString.split(",");

  let resultArray = idArray.map((id) => {
    return { id: id, name: "" };
  });

  return resultArray;
}

const ChangeViewListDoc = () => {
  const [typeViewListDoc, setTypeViewListDoc] =
    useState<TypeViewListDoc>("basicViewListDoc");
  const dispatch = useDispatch();

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
  const companyT = useTranslations(NS_COMPANY);
  const commonT = useTranslations(NS_COMMON);
  const docsT = useTranslations(NS_DOCS);
  const { filters, onCreateDoc, loading } = useDocs();
  const { perm } = useAppSelector((state) => state.doc);
  const pathname = usePathname();
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const [isShowImportForm, onShowImportForm, onHideImportForm] = useToggle();
  const [queries, setQueries] = useState<any>({});
  const grOptions = useMemo(
    () => Group_OPTIONS.map((item) => ({ ...item, label: docsT(item.label) })),
    [companyT],
  );

  const onChangeQueries = (name: string, value: any) => {
    setQueries((prevQueries) => ({ ...prevQueries, [name]: value }));
    onSearch();
  };
  const { id } = useParams();

  const handleCreateDoc = () => {
    onCreateDoc(id as string);
    // if (id && id !== undefined && isProjectTabMode) {
    // }
  };

  const onSearch = () => {
    let newQueries = {
      ...queries,
      page: 1,
      group_by: DocGroupByEnum.PROJECT_ID,
    };

    if (queries?.user_id?.length > 0) {
      const newListId = queries?.user_id?.map((person) => `${person.id}`);

      newQueries = {
        ...queries,
        user_id: newListId.join(","),
      };
    }
    const path = getPath(pathname, newQueries);
    console.log("New path", { path });
    push(path);
  };

  useEffect(() => {
    let newFilter = filters;

    if (filters?.user_id) {
      newFilter = {
        ...filters,
        user_id: convertStringToArray(filters?.user_id),
      };
    }

    setQueries(newFilter);
  }, [filters]);

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
          <Box display={{ xs: "none" }}>
            <Search
              placeholder={docsT("filter.search", { name: "email" })}
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
            justifyContent={{ xs: "space-between" }}
            spacing={1}
            width={{ xs: "100%" }}
          >
            <ChangeViewListDoc />

            <ButtonWithDropdown
              text={commonT("form.add")}
              onClick={handleCreateDoc}
              disabled={!!loading}
            >
              {(handleClose) => (
                <Paper>
                  <MenuList>
                    <MenuItem>
                      <ListItemIcon>
                        <AIGradientIcon />
                      </ListItemIcon>
                      <ListItemText>
                        {docsT("addDropdown.aiGenerator")}
                      </ListItemText>
                    </MenuItem>
                    <MenuItem>
                      <ListItemIcon>
                        <DescriptionOutlined />
                      </ListItemIcon>
                      <ListItemText>
                        {docsT("addDropdown.newDocument")}
                      </ListItemText>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleClose();
                        onShowImportForm();
                      }}
                    >
                      <ListItemIcon>
                        <FileOpenOutlined />
                      </ListItemIcon>
                      <ListItemText>{docsT("addDropdown.import")}</ListItemText>
                    </MenuItem>
                  </MenuList>
                </Paper>
              )}
            </ButtonWithDropdown>
          </Stack>
        </Stack>
        <Box
          bgcolor="background.default"
          borderRadius="2rem"
          overflow={{ xs: "auto" }}
          border="1px solid lightgrey"
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
            <Text
              sx={{ whiteSpace: "nowrap", color: "grey.700", fontWeight: 600 }}
            >
              View by:
            </Text>
            <FilterSearchDocs queries={queries} onChange={onChangeQueries} />
          </Stack>
        </Box>
      </Stack>
      <ImportForm open={isShowImportForm} onClose={onHideImportForm} />
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
