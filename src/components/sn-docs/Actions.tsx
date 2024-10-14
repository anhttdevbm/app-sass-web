/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { DescriptionOutlined, FileOpenOutlined } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Box,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Stack,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { Search } from "components/Filters";
import { Text } from "components/shared";
import { inter } from "components/sn-time-tracking/CalendarTracking/CalendarTracking.styles";
import { DocGroupByEnum } from "constant/enums";
import { NS_COMMON, NS_DOCS } from "constant/index";
import useToggle from "hooks/useToggle";
import NoneIcon from "icons/NoneIcon";
import SearchIcon from "icons/SearchIcon";
import { ViewModuleIcon } from "icons/ViewModuleIcon";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next-intl/client";
import { useParams, useSearchParams } from "next/navigation";
import { memo, useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  changeTypeViewDoc,
  addGetDocsQueries,
  TypeViewListDoc,
} from "store/docs/reducer";
import { useDocs } from "store/docs/selectors";
import { getPath } from "utils/index";
import ButtonWithDropdown from "./ButtonWithDropdown";
import FilterSearchDocs from "./FilterSearchDocs/FilterSearchDocs";
import { GetDocQueries } from "./helpers";
import ImportForm from "./ImportForm";
import { useAppDispatch, useAppSelector } from "store/hooks";

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
        <ViewModuleIcon
          sx={{
            width: "20px",
            height: "20px",
          }}
        />
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
        <MenuIcon
          sx={{
            width: "24px",
            height: "22px",
          }}
        />
      </IconButton>
    </Stack>
  );
};

type ActionProps = {
  isProjectTabMode: boolean;
};

const Actions = ({ isProjectTabMode }: ActionProps) => {
  const commonT = useTranslations(NS_COMMON);
  const docsT = useTranslations(NS_DOCS);
  const { onCreateDoc, loading } = useDocs();
  const [isShowImportForm, onShowImportForm, onHideImportForm] = useToggle();
  const { getDocsQueries } = useAppSelector((state) => state.doc);
  const dispatch = useAppDispatch();

  const onChangeQueries = (queries: Partial<GetDocQueries>) => {
    let userIds: string | string[] = [];
    if (queries.user_id) {
      userIds = queries.user_id.split(",") || [];
    }
    dispatch(addGetDocsQueries(queries));
  };
  const { id } = useParams();

  const handleCreateDoc = () => {
    onCreateDoc(id as string);
  };

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
          justifyContent="space-between"
          width="100%"
          spacing={{ xs: 2, md: 0 }}
        >
          <Box display={{ xs: "none", md: "block", lg: "block" }}>
            <Search
              placeholder={docsT("filter.search", { name: "email" })}
              name="search_key"
              // onChange={onChangeQueries}
              value={getDocsQueries?.search_key}
              sx={{
                minWidth: 400,
                backgroundColor: "inherit",
                "& .MuiInputBase-root": {
                  borderColor: "1px solid #efefef",
                  borderRadius: "100px",
                },
              }}
              startNode={null}
              endNode={<SearchIcon sx={{ color: "dodgerblue" }} />}
              rootSx={{ borderRadius: "2rem" }}
            />
          </Box>
          <Stack
            direction="row"
            spacing={1}
            display="flex"
            justifyContent={{ xs: "space-between" }}
            width={{ xs: "100%", md: "auto", lg: "auto" }}
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
                    <MenuItem
                      onClick={() => {
                        handleCreateDoc();
                      }}
                    >
                      <ListItemIcon>
                        <DescriptionOutlined />
                      </ListItemIcon>
                      <ListItemText>
                        {docsT("addDropdown.newDocument")}
                      </ListItemText>
                    </MenuItem>
                    {/* <MenuItem>
                      <ListItemIcon>
                        <AIGradientIcon />
                      </ListItemIcon>
                      <ListItemText>
                        {docsT("addDropdown.aiGenerator")}
                      </ListItemText>
                    </MenuItem> */}

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
              sx={{
                whiteSpace: "nowrap",
                color: "neutral.700",
                fontWeight: 700,
                fontFamily: inter.style.fontFamily,
                fontSize: "13px",
              }}
            >
              View by:
            </Text>
            <FilterSearchDocs onChange={onChangeQueries} />
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
