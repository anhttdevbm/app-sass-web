"use client";

import {
  Avatar,
  Box,
  IconButton,
  InputAdornment,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Stack,
  SxProps,
  TextField,
  Typography,
} from "@mui/material";
import { Search, Switch } from "components/Filters";
import { Text } from "components/shared";
import TextStatus from "components/TextStatus";
import { DataAction } from "constant/enums";
import { NS_COMMON, NS_PROJECT } from "constant/index";
import { Option } from "constant/types";
import useToggle from "hooks/useToggle";
import AIGradientIcon from "icons/AIGradientIcon";
import FolderAddIcon from "icons/FolderAddIcon";
import SearchIcon from "icons/SearchIcon";
import _ from "lodash";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next-intl/client";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { memo, useEffect, useState } from "react";
import { useEmployeeOptions } from "store/company/selectors";
import { ProjectStatus } from "store/project/actions";
import { useProjects } from "store/project/selectors";
import { getPath } from "utils/index";
import AiForm from "./AiForm";
import ButtonWithDropdown from "./components/ButtonWithDropdown";
import {
  COLOR_STATUS,
  INITIAL_VALUES,
  STATUS_OPTIONS,
} from "./components/helpers";
import Form, { ProjectDataForm } from "./Form";
import useBreakpoint from "hooks/useBreakpoint";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

const Actions = () => {
  const { filters, onGetProjects, pageSize, onCreateProject } = useProjects();
  const { options: assignerOptions } = useEmployeeOptions();
  const commonT = useTranslations(NS_COMMON);
  const projectT = useTranslations(NS_PROJECT);
  const { isMdSmaller: isMobile } = useBreakpoint();

  const pathname = usePathname();
  const { push } = useRouter();
  const [isShow, onShow, onHide] = useToggle();
  const [isAiPopupVisible, setIsAiPopupVisible] = useState(false);

  const [queries, setQueries] = useState<Params>({});

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChangeQueries = (name: string, value: any) => {
    const newQueries = {
      ...queries,
      /**
       * Updates the value of a specific action based on the provided name and value.
       * If the name is "sort" and a value is provided, it sets the value to LATEST_VALUE.
       * If the name is "sort" and no value is provided, it sets the value to undefined.
       * If the name is "saved" and no value is provided, it sets the value to undefined.
       * Otherwise, it sets the value to the provided value.
       **/
      [name]:
        name === "sort" && value
          ? LATEST_VALUE
          : name === "sort"
          ? undefined
          : name === "saved" && !value
          ? undefined
          : value,
    };
    onSearch(newQueries);
  };

  const onSearch = (newQueries: Params) => {
    const path = getPath(pathname, newQueries);
    push(path);

    // onGetProjects({ ...newQueries, pageIndex: 1, pageSize });
  };

  const onClear = () => {
    const newQueries = { pageIndex: 1, pageSize };
    const path = getPath(pathname, newQueries);
    push(path);
    onGetProjects(newQueries);
  };

  const onRefresh = () => {
    onGetProjects({ ...filters, pageIndex: 1, pageSize });
  };

  useEffect(() => {
    setQueries(filters);
  }, [filters]);

  const [isShowMobileSearch, setIsShowMobileSearch] = useState(false);

  const NewProjectButton = () => (
    <ButtonWithDropdown text={commonT("createNew")} onClick={onShow}>
      {(handleClose) => (
        <Paper>
          <MenuList>
            <MenuItem
              onClick={() => {
                handleClose();
                setIsAiPopupVisible(true);
              }}
            >
              <ListItemIcon>
                <AIGradientIcon />
              </ListItemIcon>
              <ListItemText
                sx={{
                  background:
                    "linear-gradient(270deg, rgba(41,242,155,1) 0%, rgba(1,160,250,1) 100%)",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                Create with AI
              </ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClose();
                onShow();
              }}
            >
              <ListItemIcon>
                <FolderAddIcon sx={{ color: "transparent" }} />
              </ListItemIcon>
              <ListItemText>New Project</ListItemText>
            </MenuItem>
          </MenuList>
        </Paper>
      )}
    </ButtonWithDropdown>
  );

  return (
    <>
      {isMobile ? (
        <>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography>{projectT("list.title")}</Typography>
            {isShowMobileSearch ? (
              <Search
                placeholder={commonT("searchBy", {
                  name: projectT("list.key"),
                })}
                name="name"
                onChange={_.debounce(onChangeQueries, 400)}
                autoFocus
                onBlur={() => setIsShowMobileSearch(false)}
                value={queries?.["name"]}
                startNode={null}
                endNode={
                  <SearchIcon sx={{ fontSize: 16 }} htmlColor="dodgerblue" />
                }
                sx={{ display: "flex", pb: 2, marginBottom: 1.5 }}
                rootSx={{ borderRadius: "1.5rem" }}
              />
            ) : (
              <IconButton onClick={() => setIsShowMobileSearch(true)}>
                <SearchIcon sx={{ fontSize: 24 }} htmlColor="grey" />
              </IconButton>
            )}
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            py={1}
          >
            <StatusDropdown
              value={queries?.status ?? ""}
              onChange={(value) => onChangeQueries("status", value)}
            />

            <NewProjectButton />
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            py={2}
          >
            <Switch
              name="sort"
              onChange={onChangeQueries}
              size="small"
              reverse
              label={projectT("list.filter.recent")}
              value={queries?.sort === LATEST_VALUE}
            />
            <Switch
              name="saved"
              onChange={onChangeQueries}
              size="small"
              reverse
              label={projectT("list.filter.saved")}
              value={queries?.saved}
            />
          </Stack>
        </>
      ) : (
        <>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            borderBottom="1px solid"
            borderColor="grey.100"
            spacing={3}
            px={3}
            pt={1}
            pb={1}
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={3}
              borderRadius={1}
              justifyContent="flex-start"
              overflow="auto"
              width="100%"
            >
              <Switch
                name="sort"
                onChange={onChangeQueries}
                size="small"
                reverse
                label={projectT("list.filter.recent")}
                value={queries?.sort === LATEST_VALUE}
              />
              <Switch
                name="saved"
                onChange={onChangeQueries}
                size="small"
                reverse
                label={projectT("list.filter.saved")}
                value={queries?.saved}
              />

              <StatusDropdown
                value={queries?.status ?? ""}
                onChange={(value) => onChangeQueries("status", value)}
              />

              <AssignerDropdown
                value={queries?.owner ?? ""}
                options={assignerOptions}
                onChange={(value) => onChangeQueries("owner", value)}
              />
            </Stack>

            <NewProjectButton />
          </Stack>

          <Box
            sx={{
              py: 2,
              px: 3,
              marginBottom: 1.5,
            }}
            display="flex"
          >
            <Search
              placeholder={commonT("searchBy", { name: projectT("list.key") })}
              name="name"
              onChange={_.debounce(onChangeQueries, 400)}
              autoFocus
              value={queries?.["name"]}
              startNode={null}
              endNode={
                <SearchIcon sx={{ fontSize: 16 }} htmlColor="dodgerblue" />
              }
              sx={{ width: "35%" }}
              rootSx={{ borderRadius: "1.5rem" }}
            />
          </Box>
        </>
      )}

      {isShow && (
        <Form
          open
          onClose={onHide}
          type={DataAction.CREATE}
          initialValues={INITIAL_VALUES as unknown as ProjectDataForm}
          onSubmit={onCreateProject}
        />
      )}
      {isAiPopupVisible && (
        <AiForm isOpen onClose={() => setIsAiPopupVisible(false)} />
      )}
    </>
  );
};

export default memo(Actions);

const LATEST_VALUE = "updated_time=-1";

const StatusDropdown = (props: {
  value: ProjectStatus | "";
  onChange: (value: ProjectStatus | "") => void;
  sx?: SxProps;
}) => {
  const commonT = useTranslations(NS_COMMON);

  return (
    <TextField
      select
      size="small"
      SelectProps={{
        displayEmpty: true,
        startAdornment: (
          <InputAdornment position="start">
            <Typography sx={{ color: "grey.600" }}>
              {commonT("status")}:
            </Typography>
          </InputAdornment>
        ),
        IconComponent: (_props) => <ExpandMore {..._props} />,
      }}
      value={props.value}
      onChange={(e) => props.onChange(e.target.value as ProjectStatus | "")}
      sx={{
        "& .MuiOutlinedInput-root": {
          "& .MuiOutlinedInput-notchedOutline": {
            borderRadius: "2rem",
          },
        },
        ...props.sx,
      }}
    >
      <MenuItem value="">{commonT("all")}</MenuItem>
      {STATUS_OPTIONS.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          <TextStatus
            text={commonT(option.label)}
            color={COLOR_STATUS[option.value]}
          >
            {commonT(option.label)}
          </TextStatus>
        </MenuItem>
      ))}
    </TextField>
  );
};

const AssignerDropdown = (props: {
  value: Option | "";
  options: Option[];
  onChange: (value: string | "") => void;
  sx?: SxProps;
}) => {
  const commonT = useTranslations(NS_COMMON);

  return (
    <TextField
      select
      size="small"
      SelectProps={{
        displayEmpty: true,
        startAdornment: (
          <InputAdornment position="start">
            <Typography sx={{ color: "grey.600" }}>
              {commonT("assigner")}:
            </Typography>
          </InputAdornment>
        ),
      }}
      value={props.value}
      onChange={(e) => props.onChange(e.target.value)}
      sx={{
        "& .MuiOutlinedInput-root": {
          "& .MuiOutlinedInput-notchedOutline": {
            borderRadius: "2rem",
          },
        },
        ...props.sx,
      }}
    >
      <MenuItem value="">{commonT("all")}</MenuItem>
      {props.options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar
              alt={option.label}
              src={option.avatar}
              sx={{ width: 24, height: 24 }}
            />
            <Typography>{option.label}</Typography>
          </Box>
        </MenuItem>
      ))}
    </TextField>
  );
};
