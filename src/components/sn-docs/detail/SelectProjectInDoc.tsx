/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  Box,
  ButtonBase,
  MenuItem,
  MenuList,
  Popover,
  Stack,
  popoverClasses,
} from "@mui/material";
import Avatar from "components/Avatar";
import { Search } from "components/Filters";
import { Text } from "components/shared";
import { inter } from "components/sn-time-tracking/CalendarTracking/CalendarTracking.styles";
import { memo, useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useUpdateDocMutation } from "store/docs/api";
import { changeProjectId } from "store/docs/reducer";
import { useAppSelector } from "store/hooks";
import { Project } from "store/project/reducer";
import { useProjects } from "store/project/selectors";
import ChangeProjectConfirm from "./LeftSlide/modal/ConfirmModal";
import ConfirmModal from "./LeftSlide/modal/ConfirmModal";

interface IProps {
  updateOnSelect?: boolean;
  currentProjectId?: string;
}

const SelectProjectInDoc = ({ updateOnSelect, currentProjectId }: IProps) => {
  const { id, docInfo, project_id } = useAppSelector((state) => state.doc);
  const dispatch = useDispatch();
  const { items: projects, onGetProjects } = useProjects();
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const [projectActive, setProjectActive] = useState<Project | null>(null);
  const [updateDoc] = useUpdateDocMutation();
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const active = projects.find((e) => e.id === currentProjectId);
    setProjectActive(active || null);
  }, [projects, currentProjectId]);

  useEffect(() => {
    onGetProjects({ pageSize: -1, pageIndex: 0 });
  }, []);

  const handleSelect = useCallback((e: Project) => {
    if (docInfo?.is_public) {
      updateOnSelect &&
        updateDoc({
          id,
          payload: {
            project_id: e.id,
          },
        });
    } else {
      setIsOpenConfirmModal(true);
    }
    dispatch(changeProjectId(e.id));
    setProjectActive(e);
    handleClose();
  }, []);

  const onConfirm = () => {
    console.log("pid", project_id);

    updateDoc({
      id,
      payload: {
        project_id,
      },
    });
    setIsOpenConfirmModal(false);
    handleClose();
  };

  const onCloseConfirm = () => {
    setIsOpenConfirmModal(false);
    dispatch(changeProjectId(""));
    setProjectActive(null);
  };

  const [searchKey, setSearchKey] = useState("");

  return (
    <>
      {isOpenConfirmModal && (
        <ConfirmModal
          onConfirm={onConfirm}
          onClose={onCloseConfirm}
          open={isOpenConfirmModal}
          title=" Change document access ?"
          content="This document will be viewed by all members in project"
        />
      )}
      <Box
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          cursor: "pointer",
          color: {
            xs: "common.white",
            sm: "common.black",
          },
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        {projectActive ? (
          <>
            <Avatar size={24} src={projectActive.avatar} />
            <Text
              component="span"
              color="neutral.800"
              sx={{
                fontSize: "16px",
                fontFamily: inter.style.fontFamily,
              }}
            >
              {projectActive.name}
            </Text>
          </>
        ) : (
          <Text
            component="span"
            color="neutral.800"
            sx={{
              fontSize: "16px",
              fontFamily: inter.style.fontFamily,
            }}
          >
            No Project
          </Text>
        )}
      </Box>
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
                  <Avatar size={24} src={e.avatar} />

                  <Text
                    component="span"
                    ml={2}
                    color="neutral.800"
                    sx={{
                      fontSize: "16px",
                      fontFamily: inter.style.fontFamily,
                    }}
                  >
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
