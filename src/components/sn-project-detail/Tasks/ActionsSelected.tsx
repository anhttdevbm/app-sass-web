import { memo, useMemo, useState } from "react";
import {
  Stack,
  SvgIcon,
  SvgIconProps,
  Button,
  Theme,
  Typography,
  selectClasses,
} from "@mui/material";
import { IconButton, Text } from "components/shared";
import { useTranslations } from "next-intl";
import { NS_COMMON, NS_PROJECT, STATUS_OPTIONS } from "constant/index";
import { formatNumber, getMessageErrorByAPI } from "utils/index";
import {
  AssignerFilter,
  MoreList,
  MoreActionList,
  Selected,
} from "./components";
import { Date, Dropdown } from "components/Filters";
import { useSnackbar } from "store/app/selectors";
import { useTaskDetail } from "store/project/selectors";
import { TaskData } from "store/project/actions";
import CloseIcon from "icons/CloseIcon";
import useTheme from "hooks/useTheme";
import MultiTaskAiForm from "./MultiTaskAiForm";

type ActionsSelectedProps = {
  selectedList: Selected[];
  onReset: () => void;
};

const ActionsSelected = (props: ActionsSelectedProps) => {
  const { selectedList, onReset } = props;
  const commonT = useTranslations(NS_COMMON);
  const projectT = useTranslations(NS_PROJECT);
  const { onUpdateTask } = useTaskDetail();

  const { onAddSnackbar } = useSnackbar();

  const { isDarkMode } = useTheme();
  const [isShow, setIsShow] = useState(false);

  const statusOptions = useMemo(
    () =>
      STATUS_OPTIONS.map((item) => ({ ...item, label: commonT(item.label) })),
    [commonT],
  );

  const onChange = (name: string, value) => {
    onUpdateTasks({ [name]: value }, name);
  };

  const onUpdateTasks = async (data: Partial<TaskData>, name: string) => {
    try {
      const selectedTasks = selectedList.filter((item) => item?.taskId);
      for (const item of selectedTasks) {
        await onUpdateTask(
          data,
          item.taskListId as string,
          item.taskId as string,
          item?.subTaskId,
        );
      }
      onAddSnackbar(
        projectT("detailTasks.notification.actionTaskSuccess", {
          label: projectT(`detailTasks.keys.${name}`),
        }),
        "success",
      );
    } catch (error) {
      onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
    }
  };

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      alignItems="center"
      justifyContent="space-between"
      bgcolor={isDarkMode ? "background.default" : "primary.light"}
      px={1.5}
      py={{ xs: 1, md: 0.75 }}
      position="relative"
      borderRadius="1rem"
      // top={{ xs: 209, md: 80 }}
      // zIndex={12}
    >
      <Stack
        direction="row"
        alignItems={{ md: "center" }}
        width="100%"
        justifyContent={{ xs: "space-between", md: "flex-start" }}
        spacing={1}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Text variant="h6" color="grey.400" whiteSpace="nowrap">
            {projectT("detailTasks.selectedCount", {
              value: formatNumber(selectedList.length),
            })}
          </Text>
          <IconButton
            noPadding
            onClick={onReset}
            tooltip={projectT("detailTasks.resetSelected")}
          >
            <CloseIcon sx={{ color: "grey.400", fontSize: 18 }} />
          </IconButton>
        </Stack>

        <MoreList sx={{ display: { xs: "flex", md: "none" } }} {...props} />
      </Stack>
      <Stack
        direction="row"
        alignItems="center"
        spacing={{ md: 3 }}
        width="100%"
        justifyContent={{ xs: "space-between", md: "flex-end" }}
        display={{ xs: "grid", md: "flex" }}
        gridTemplateColumns={{ xs: "repeat(2, 1fr)", md: "unset" }}
      >
        <Button
          sx={{
            textTransform: "none",
          }}
          onClick={() => setIsShow(true)}
        >
          <Stack direction="row" alignItems="center" gap={1}>
            <AiBotGradientIcon sx={{ fontSize: 14 }} />
            <Typography
              whiteSpace="nowrap"
              fontSize={14}
              sx={{
                background:
                  "linear-gradient(in hsl longer hue 90deg, red 0 0);",
                color: "transparent",
                backgroundClip: "text",
              }}
            >
              AI Assistant
            </Typography>
          </Stack>
        </Button>
        {isShow && <MultiTaskAiForm open onClose={() => setIsShow(false)} />}
        <AssignerFilter
          onChange={onChange}
          hasAvatar
          name="owner"
          disabled={!selectedList.length}
          rootSx={{
            width: "fit-content",
            "& >svg": { fontSize: 16 },
            px: "0px!important",
            [`& .${selectClasses.outlined}`]: {
              pr: "0!important",
              mr: ({ spacing }: { spacing: Theme["spacing"] }) =>
                `${spacing(4)}!important`,
              "& .sub": {
                display: "none",
              },
            },
          }}
        />
        <Date
          label={commonT("form.title.startDate")}
          name="start_date"
          onChange={onChange}
          disabled={!selectedList.length}
          iconProps={{
            sx: {
              fontSize: 16,
            },
          }}
          textProps={{
            fontWeight: 400,
          }}
        />
        <Date
          label={commonT("form.title.dueDate")}
          name="end_date"
          onChange={onChange}
          disabled={!selectedList.length}
          iconProps={{
            sx: {
              fontSize: 16,
            },
          }}
          textProps={{
            fontWeight: 400,
          }}
        />
        <Dropdown
          placeholder={commonT("status")}
          options={statusOptions}
          name="status"
          onChange={onChange}
          disabled={!selectedList.length}
          rootSx={{
            width: "fit-content",
            "& >svg": { fontSize: 16 },
            ".text-option": {
              fontWeight: 400,
            },
            px: "0px!important",
            [`& .${selectClasses.outlined}`]: {
              pr: "0!important",
              mr: ({ spacing }: { spacing: Theme["spacing"] }) =>
                `${spacing(4)}!important`,
              "& .sub": {
                display: "none",
              },
            },
          }}
        />
        <MoreActionList
          sx={{ display: { xs: "none", md: "flex" } }}
          {...props}
        />
        {/* <MoreList sx={{ display: { xs: "none", md: "flex" } }} {...props} /> */}
      </Stack>
    </Stack>
  );
};

export default memo(ActionsSelected);

const AiBotGradientIcon = (props: SvgIconProps) => (
  <SvgIcon
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_856_143837)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.33229 1.38193C7.9139 1.38193 7.57429 1.72143 7.57429 2.1405C7.57429 2.55956 7.9139 2.89906 8.33229 2.89906C8.75091 2.89906 9.0907 2.55938 9.0907 2.1405C9.0907 1.72161 8.75091 1.38193 8.33229 1.38193ZM6.41501 2.1405C6.41501 1.08171 7.27312 0.222656 8.33229 0.222656C9.39139 0.222656 10.25 1.08152 10.25 2.1405C10.25 3.04011 9.63036 3.79531 8.79456 4.00224V5.81929C10.0963 5.82025 11.1292 5.82793 11.9357 5.88954C12.8463 5.9591 13.5826 6.10216 14.1188 6.4708C14.7003 6.87059 14.949 7.46122 15.0622 8.16138C15.1696 8.826 15.1695 9.68906 15.1695 10.7445V10.8475C15.1695 11.903 15.1696 12.766 15.0622 13.4306C14.949 14.1308 14.7003 14.7215 14.1188 15.1213C13.5826 15.4899 12.8463 15.633 11.9357 15.7025C11.0142 15.7729 9.79714 15.7729 8.22108 15.7729H8.1667C6.59069 15.7729 5.37361 15.7729 4.45206 15.7025C3.54153 15.633 2.80522 15.4899 2.26902 15.1213C1.68751 14.7215 1.43879 14.1308 1.32563 13.4306C1.21821 12.766 1.21824 11.903 1.21826 10.8475V10.7446C1.21824 9.68906 1.21821 8.826 1.32563 8.16138C1.43879 7.46122 1.68751 6.87059 2.26902 6.4708C2.80522 6.10216 3.54153 5.9591 4.45206 5.88954C5.26726 5.82728 6.31371 5.82009 7.6353 5.81927V3.92767C6.92091 3.64866 6.41501 2.95346 6.41501 2.1405ZM2.47006 8.34638C2.37934 8.90771 2.37754 9.67635 2.37754 10.7961C2.37754 11.9158 2.37934 12.6844 2.47006 13.2457C2.55677 13.7823 2.70779 14.0161 2.92579 14.166C3.18909 14.347 3.65203 14.4788 4.54037 14.5467C5.41241 14.6133 6.58512 14.6137 8.1939 14.6137C9.80265 14.6137 10.9754 14.6133 11.8475 14.5467C12.7358 14.4788 13.1987 14.347 13.462 14.166C13.68 14.0161 13.831 13.7823 13.9178 13.2457C14.0085 12.6844 14.0103 11.9158 14.0103 10.7961C14.0103 9.67635 14.0085 8.90771 13.9178 8.34638C13.831 7.80982 13.68 7.57596 13.462 7.4261C13.1987 7.24508 12.7358 7.11331 11.8475 7.04545C10.9754 6.97884 9.80265 6.97843 8.1939 6.97843C6.58512 6.97843 5.41241 6.97884 4.54037 7.04545C3.65203 7.11331 3.18909 7.24508 2.92579 7.4261C2.70779 7.57596 2.55677 7.80982 2.47006 8.34638ZM5.81644 8.21766C6.13657 8.21766 6.39608 8.47718 6.39608 8.7973V9.19705C6.39608 9.51717 6.13657 9.77669 5.81644 9.77669C5.49631 9.77669 5.2368 9.51717 5.2368 9.19705V8.7973C5.2368 8.47718 5.49631 8.21766 5.81644 8.21766ZM10.6134 8.21766C10.9335 8.21766 11.1931 8.47718 11.1931 8.7973V9.19705C11.1931 9.51717 10.9335 9.77669 10.6134 9.77669C10.2933 9.77669 10.0338 9.51717 10.0338 9.19705V8.7973C10.0338 8.47718 10.2933 8.21766 10.6134 8.21766ZM5.77458 11.5964C5.99487 11.3642 6.36175 11.3544 6.59403 11.5747C7.49907 12.4331 8.89594 12.4243 9.79426 11.5743C10.0268 11.3543 10.3936 11.3643 10.6137 11.5969C10.8337 11.8294 10.8235 12.1963 10.591 12.4163C9.24964 13.6857 7.15245 13.7021 5.79628 12.4158C5.56401 12.1956 5.55429 11.8287 5.77458 11.5964Z"
        fill="#99D25F"
      />
    </g>
    <defs>
      <clipPath id="clip0_856_143837">
        <rect
          width="15.99"
          height="15.99"
          fill="white"
          transform="translate(0 0.00390625)"
        />
      </clipPath>
    </defs>
  </SvgIcon>
);
