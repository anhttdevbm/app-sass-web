/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  ButtonBase,
  MenuItem,
  MenuList,
  Popover,
  Stack,
  popoverClasses,
} from "@mui/material";
import React, { memo, useEffect, useState } from "react";
import { FilterSearchDocsProps } from "./FilterSearchDocs";
import { Select, Text } from "components/shared";
import { useTranslations } from "next-intl";
import { NS_COMMON, NS_DOCS, NS_TIME_TRACKING } from "constant/index";
import { useFormik } from "formik";
import { useEmployeeOptions } from "store/company/selectors";
import TextFieldSelect, {
  IOptionStructure,
} from "components/shared/TextFieldSelect";
import _ from "lodash";
import { useProjects } from "store/project/selectors";
import ChevronIcon from "icons/ChevronIcon";

const FilterMemberProject = ({ onChange, queries }: FilterSearchDocsProps) => {
  const docsT = useTranslations(NS_DOCS);
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [currentProjectLabel, setCurrentProjectLabel] = useState<any>(null);

  const commonT = useTranslations(NS_COMMON);
  const { items: projects, onGetProjects } = useProjects();

  const timeT = useTranslations(NS_TIME_TRACKING);
  const [projectOptions, setProjectOptions] = useState<IOptionStructure[]>([]);

  useEffect(() => {
    onGetProjects({ pageSize: -1, pageIndex: 0 });
  }, []);

  useEffect(() => {
    if (!_.isEmpty(projects)) {
      const resolveProjects = _.map(projects, (project) => {
        return {
          label: project?.name,
          value: project?.id,
        };
      });
      setProjectOptions([
        {
          label: "None",
          value: "",
        },
        ...resolveProjects,
      ]);
    }
  }, [projects]);

  return (
    <>
      <MenuItem
        onClick={(e) => setAnchorEl(e.currentTarget)}
        component={ButtonBase}
        sx={sxConfig.item}
      >
        <Text variant="body2" color="grey.400">
          {currentProjectLabel
            ? currentProjectLabel
            : docsT("filter.filter.project")}
        </Text>
        <ChevronIcon fontSize="small"></ChevronIcon>
      </MenuItem>
      <Popover
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          [`& .${popoverClasses.paper}`]: {
            backgroundImage: "none",
            minWidth: 270,
            maxWidth: 270,
          },
        }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 1,
              mt: 0.5,
            },
          },
        }}
      >
        <Stack
          sx={{
            boxShadow: "2px 2px 24px rgba(0, 0, 0, 0.1)",
            border: "1px solid",
            borderTopWidth: 0,
            borderColor: "grey.100",
            borderRadius: 1,
          }}
        >
          {projectOptions.map((item) => {
            return (
              <MenuItem
                key={item.value}
                onClick={() => {
                  setCurrentProjectLabel(item.label);
                  onChange("project", item.value);
                  handleClose();
                  setSelectedItem(item.value);
                }}
                sx={{
                  backgroundColor:
                    item?.value === selectedItem ? "#dddddd" : "",
                }}
              >
                {item?.label}
              </MenuItem>
            );
          })}
          {/* <TextFieldSelect
            value={queries?.project}
            onChange={(e) => {
              onChange("project", e.target.value);
            }}
            options={projectOptions}
            label={timeT("modal.Project")}
            sx={{ flex: 1 }}
          /> */}
        </Stack>
      </Popover>
    </>
  );
};

export default memo(FilterMemberProject);
const sxConfig = {
  input: {
    height: 56,
  },
  item: {
    width: "100%",
    py: 1,
    px: 2,
  },
};
