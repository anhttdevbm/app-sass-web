/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import _ from "lodash";
import React, { memo, useCallback, useEffect, useState } from "react";
import { useAppSelector } from "store/hooks";
import { useDispatch } from "react-redux";
import { useProjects } from "store/project/selectors";
import { Text } from "components/shared";
import {
  Box,
  ButtonBase,
  MenuItem,
  MenuList,
  Popover,
  Stack,
  popoverClasses,
} from "@mui/material";
import { Project } from "store/project/reducer";
import { changeProjectId } from "store/docs/reducer";
import Avatar from "components/Avatar";
import { Search } from "components/Filters";

const SelectProjectInDoc = () => {
  const { project_id } = useAppSelector((state) => state.doc);
  const dispatch = useDispatch();
  const { items: projects, onGetProjects } = useProjects();
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const [projectActive, setProjectActive] = useState<Project | null>(null);
  const handleClose = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    const active = projects.find((e) => e.id === project_id);
    setProjectActive(active || null);
  }, [projects]);

  useEffect(() => {
    onGetProjects({ pageSize: -1, pageIndex: 0 });
  }, []);

  const handleSelect = useCallback((e: Project) => {
    dispatch(changeProjectId(e.id));
    setProjectActive(e);
    handleClose();
  }, []);

  const [searchKey, setSearchKey] = useState("");

  return (
    <>
      <Text
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          cursor: "pointer",
          color: {
            xs: "common.white",
            sm: "common.black"
          },
        }}
      >
        {projectActive?.name || "No Project"}
      </Text>
      <Popover
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        sx={{
          [`& .${popoverClasses.paper}`]: {
            backgroundImage: "none",
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
          pb={2}
          sx={{
            width: 250,
            boxShadow: "2px 2px 24px rgba(0, 0, 0, 0.1)",
            border: "1px solid",
            borderTopWidth: 0,
            borderColor: "grey.100",
            borderRadius: 1,
          }}
        >
          <Search
            name="project-search"
            onChange={(name: any, searchValue: string | undefined) => {
              setSearchKey(searchValue || "");
            }}
            value={searchKey}
          />
          <MenuList component={Box} sx={{ py: 0 }}>
            {projects
              .filter((e) =>
                e.name.toLowerCase().includes(searchKey.toLowerCase()),
              )
              .map((e) => (
                <MenuItem
                  onClick={() => handleSelect(e)}
                  key={e.id}
                  component={ButtonBase}
                  sx={sxConfig.item}
                >
                  <Avatar size={32} src={e.avatar?.link} />

                  <Text ml={2} variant="body2" color="grey.400">
                    {e.name}
                  </Text>
                </MenuItem>
              ))}
          </MenuList>
        </Stack>
      </Popover>
    </>
  );
};

const sxConfig = {
  item: {
    width: "100%",
    py: 1,
    px: 2,
  },
};

export default memo(SelectProjectInDoc);
