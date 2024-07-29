/* eslint-disable @typescript-eslint/no-empty-function */
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
import ConfirmDialog from "components/ConfirmDialog";
import { Text } from "components/shared";
import UpdateFormDoc, { IFormUpdateDoc } from "components/sn-docs/UpdateFormDoc";
import MoveTaskList from "components/sn-project-detail/Tasks/MoveTaskList";
import TaskListForm from "components/sn-project-detail/Tasks/TaskListForm";
import { DataAction } from "constant/enums";
import { NS_COMMON, NS_DOCS } from "constant/index";
import DuplicateIcon from "icons/DuplicateIcon";
import MoreDotIcon from "icons/MoreDotIcon";
import MoreIcon from "icons/MoreIcon";
import MoveArrowIcon from "icons/MoveArrowIcon";
import PencilIcon from "icons/PencilIcon";
import TrashIcon from "icons/TrashIcon";
import { useTranslations } from "next-intl";
import React, { useId, useState, useTransition } from "react";
import { useDispatch } from "react-redux";
import { useUpdateDocMutation } from "store/docs/api";
import { changeTitle } from "store/docs/reducer";
import { useDocs } from "store/docs/selectors";
enum Action {
  RENAME = 1,
  DUPLICATE,
  MOVE,
  DELETE,
}
const MorePoper = ({id, isParentDoc}:{id?: string, isParentDoc?: boolean}) => {
  const commonT = useTranslations(NS_COMMON);
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const docsT = useTranslations(NS_DOCS);

  const [type, setType] = useState<Action | undefined>();
  const [updateDoc] = useUpdateDocMutation();
  const dispatch = useDispatch()
  
  const onSetTType = (action?: Action) => {
    return () => {
      setAnchorEl(false);
      setType(action);
    };
  };

  const renameDoc = async(values: IFormUpdateDoc) => {
    if (values) {
      updateDoc({ id: id as string, payload: { name: values.name } });

      if(isParentDoc && values.name) {
        dispatch(changeTitle(values.name))
      }
    }
  }

  const deleteDoc = async () => {
    console.log('delete document')
  }

  return (
    <>
      <Box
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          cursor: "pointer",
          display: "flex",
          alignItems: "center"
        }}
      >
        <MoreDotIcon
          sx={{
            color: "grey.300",
          }}
          fontSize={"medium"}
        ></MoreDotIcon>
      </Box>
      <Popover
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        sx={{
          [`& .${popoverClasses.paper}`]: {
            backgroundImage: "none",
            minWidth: 150,
            maxWidth: 150,
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
          py={2}
          sx={{
            boxShadow: "2px 2px 24px rgba(0, 0, 0, 0.1)",
            border: "1px solid",
            borderTopWidth: 0,
            borderColor: "grey.100",
            borderRadius: 1,
          }}
        >
          <MenuList component={Box} sx={{ py: 0 }}>
            <MenuItem
              onClick={onSetTType(Action.RENAME)}
              component={ButtonBase}
              sx={sxConfig.item}
            >
              <PencilIcon sx={{ color: "grey.400" }} fontSize="medium" />
              <Text ml={2} variant="body2" color="grey.400">
                {commonT("rename")}
              </Text>
            </MenuItem>
            <MenuItem component={ButtonBase} sx={sxConfig.item}>
              <DuplicateIcon sx={{ color: "grey.400" }} fontSize="medium" />
              <Text ml={2} variant="body2" color="grey.400">
                {commonT("duplicate")}
              </Text>
            </MenuItem>
            <MenuItem
              onClick={onSetTType(Action.MOVE)}
              component={ButtonBase}
              sx={sxConfig.item}
            >
              <MoveArrowIcon sx={{ color: "grey.400" }} fontSize="medium" />
              <Text ml={2} variant="body2" color="grey.400">
                {commonT("move")}
              </Text>
            </MenuItem>
            <MenuItem
              onClick={onSetTType(Action.DELETE)}
              component={ButtonBase}
              sx={sxConfig.item}
            >
              <TrashIcon color="error" fontSize="medium" />
              <Text ml={2} variant="body2" color="error.main">
                {commonT("delete")}
              </Text>
            </MenuItem>
          </MenuList>
        </Stack>
      </Popover>

      {type === Action.RENAME && (
        <UpdateFormDoc
          open
          onClose={onSetTType()}
          type={DataAction.UPDATE}
          initialValues={{ name: "" }}
          onSubmit={renameDoc}
        />
       
      )}
      {type === Action.MOVE && (
        <MoveTaskList
          oldTaskListIds={["234224"]}
          taskIds={{
            ["23423"]: ["32423"],
          }}
          open
          onClose={onSetTType()}
        />
      )}
      {type === Action.DELETE && (
        <ConfirmDialog
          open
          onClose={onSetTType()}
          title={docsT("expandBtn.delete")}
          content={docsT("deleteConfirmDoc")}
          onSubmit={deleteDoc}
        />
      )}
    </>
  );
};

export default MorePoper;

const sxConfig = {
  item: {
    width: "100%",
    py: 1,
    px: 2,
  },
};
