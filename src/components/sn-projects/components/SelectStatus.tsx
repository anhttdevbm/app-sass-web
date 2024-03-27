import { memo, useState } from "react";
import { useProjects } from "store/project/selectors";
import { getMessageErrorByAPI } from "utils/index";
import { useSnackbar } from "store/app/selectors";
import { useTranslations } from "next-intl";
import { NS_COMMON, NS_PROJECT } from "constant/index";
import { StatusCell } from "components/Table";
import { COLOR_STATUS, TEXT_STATUS, STATUS_OPTIONS } from "./helpers";
import MenuItem from "@mui/material/MenuItem";
import TextStatus from "components/TextStatus";
import Popover from "@mui/material/Popover";
import useQueryParams from "hooks/useQueryParams";

import { ProjectStatus } from "store/project/actions";

type SelectStatusProps = {
  value?: ProjectStatus;
  id: string;
};

const SelectStatus = (props: SelectStatusProps) => {
  const { value, id } = props;
  const { onUpdateProject, onGetProjects } = useProjects();
  const { onAddSnackbar } = useSnackbar();
  const projectT = useTranslations(NS_PROJECT);
  const commonT = useTranslations(NS_COMMON);
  const [status, setStatus] = useState(value || ProjectStatus.ACTIVE);
  const [anchorEl, setAnchorEl] = useState(null);

  const onToggleStatus = async (newStatus) => {
    try {
      await onUpdateProject(id, { status: newStatus });
      setStatus(newStatus);
      onAddSnackbar(
        projectT("detail.notification.changeStatusSuccess"),
        "success",
      );
    } catch (error) {
      onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
    }
  };

  const handleChange = (event) => {
    const newStatus = event.target.value;
    onToggleStatus(newStatus);
  };

  const handleStatusCellClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <div
        onClick={handleStatusCellClick}
        style={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
        }}
      >
        <TextStatus
          text={TEXT_STATUS[status]}
          color={COLOR_STATUS[status]}
          width={93}
        />
      </div>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        {Object.keys(ProjectStatus).map((statusKey) => {
          const statusValue = ProjectStatus[statusKey] as ProjectStatus;
          return (
            <MenuItem
              key={statusValue}
              value={statusValue}
              onClick={() => {
                handleChange({ target: { value: statusValue } });
                handleClose();
              }}
              sx={{
                "& td": {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                },
              }}
            >
              <StatusCell
                text={TEXT_STATUS[statusValue]}
                color={COLOR_STATUS[statusValue]}
                width={90}
              />
            </MenuItem>
          );
        })}
      </Popover>
    </>
  );
};

export default memo(SelectStatus);
