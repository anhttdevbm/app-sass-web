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
import UpdateFormDoc, {
  IFormUpdateDoc,
} from "components/sn-docs/UpdateFormDoc";
import MoveTaskList from "components/sn-project-detail/Tasks/MoveTaskList";
import { DataAction } from "constant/enums";
import { NS_COMMON, NS_DOCS } from "constant/index";
import DuplicateIcon from "icons/DuplicateIcon";
import MoreDotIcon from "icons/MoreDotIcon";
import TrashIcon from "icons/TrashIcon";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useDeleteDocMutation, useUpdateDocMutation } from "store/docs/api";
import { changeTitle } from "store/docs/reducer";
enum Action {
  RENAME = 1,
  DUPLICATE,
  MOVE,
  DELETE,
}
const MorePoper = ({
  id,
  isParentDoc,
}: {
  id?: string;
  isParentDoc?: boolean;
}) => {
  const commonT = useTranslations(NS_COMMON);
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const handleClose = (e) => {
    e.stopPropagation();
    setAnchorEl(null);
  };
  const docsT = useTranslations(NS_DOCS);

  const [type, setType] = useState<Action | undefined>();
  const [updateDoc] = useUpdateDocMutation();
  const [deleteDoc] = useDeleteDocMutation();
  const dispatch = useDispatch();

  const onSetTType = (action?: Action) => {
    setAnchorEl(false);
    setType(action);
  };

  const renameDoc = async (values: IFormUpdateDoc) => {
    if (values) {
      updateDoc({ id: id as string, payload: { name: values.name } });

      if (isParentDoc && values.name) {
        dispatch(changeTitle(values.name));
      }
    }
  };

  const onDeleteDoc = async () => {
    id && deleteDoc(id);
  };

  return (
    <>
      <Box
        onClick={(e) => {
          e.stopPropagation();
          setAnchorEl(e.currentTarget);
        }}
        sx={{
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
        }}
      >
        <MoreDotIcon
          sx={{
            color: "grey.300",
          }}
          fontSize={"medium"}
        />
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
            <MenuItem component={ButtonBase} sx={sxConfig.item}>
              <DuplicateIcon sx={{ color: "grey.400" }} fontSize="medium" />
              <Text ml={2} variant="body2" color="grey.400">
                {commonT("duplicate")}
              </Text>
            </MenuItem>
            <MenuItem
              // onClick={onSetTType(Action.DELETE)}
              component={ButtonBase}
              sx={sxConfig.item}
            >
              <DuplicateIcon sx={{ color: "grey.400" }} fontSize="medium" />
              <Text ml={2} variant="body2" color="grey.400">
                {docsT("extendBtn.convertToDoc")}
              </Text>
            </MenuItem>
            <MenuItem
              onClick={(e) => {
                e.stopPropagation();
                onSetTType(Action.DELETE);
              }}
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
          onClose={() => onSetTType()}
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
          onClose={() => onSetTType()}
        />
      )}
      {type === Action.DELETE && (
        <ConfirmDialog
          open
          onClose={() => onSetTType()}
          title={docsT("extendBtn.delete")}
          content={docsT("deleteConfirmDoc")}
          onSubmit={onDeleteDoc}
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
