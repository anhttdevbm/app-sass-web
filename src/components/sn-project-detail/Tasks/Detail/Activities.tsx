import { memo } from "react";
import { Box, Stack } from "@mui/material";
import { Text } from "components/shared";
import { formatDate } from "utils/index";
import { DATE_TIME_FORMAT_SLASH } from "constant/index";
import { ActivityTask } from "store/project/reducer";
import Avatar from "components/Avatar";

type ActivitiesProps = {};

const Activities = (props: ActivitiesProps) => {
  return (
    <Stack>
      {DATA.map((item) => (
        <Item key={item.id} {...item} />
      ))}
    </Stack>
  );
};

export default memo(Activities);
const DATA = [
  {
    id: "1",
    action: "create task",
    user: { fullname: "Hheheh" },
    task: { name: "Task 01" },
    project: { name: "Project 01" },
    time: "2023-05-27T16:46:06.705Z",
  },
] as ActivityTask[];

const Item = (props: ActivityTask) => {
  const { time, user, action, task, project } = props;

  return (
    <Stack
      direction="row"
      alignItems="center"
      borderBottom="1px solid"
      borderColor="grey.100"
      py={{ xs: 1, sm: 1.25 }}
      px={{ xs: 1, sm: 1.75 }}
      spacing={{ xs: 1.25, sm: 2 }}
    >
      <Text textAlign="center" variant="caption" color="grey.400" width={64}>
        {formatDate(time, DATE_TIME_FORMAT_SLASH)}
      </Text>
      <Box
        sx={{
          width: 8,
          minWidth: 8,
          height: 8,
          borderRadius: "50%",
          bgcolor: "secondary.main",
        }}
      />
      <Stack direction="row" alignItems="center" spacing={1}>
        <Avatar size={32} src={user?.avatar?.link} />
        <Stack>
          <Text variant="body2">{user?.fullname ?? "--"}</Text>
          <Text variant="caption" color="grey.400">
            {user.email}
          </Text>
        </Stack>
      </Stack>
      <Text variant="h6" color="grey.400" sx={{ wordBreak: "break-all" }}>
        {action}
        <Text
          noWrap
          component="span"
          variant="inherit"
          color="primary.main"
          mx={0.75}
        >
          {task.name}
        </Text>
        in
        <Text noWrap component="span" variant="inherit" mx={0.75}>
          {project.name}
        </Text>
      </Text>
    </Stack>
  );
};
