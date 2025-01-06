import { Box, Stack } from "@mui/material";
import { client, Endpoint } from "api";
import Avatar from "components/Avatar";
import { Text } from "components/shared";
import { API_URL, DATE_TIME_FORMAT_SLASH } from "constant/index";
import { memo } from "react";
import { useQuery } from "react-query";
import { ActivityTaskLog } from "store/project/reducer";
import { formatDate } from "utils/index";

type ActivitiesProps = {
  task_id: string;
  subtask_id?: string;
};

const Activities = (props: ActivitiesProps) => {
  const { task_id, subtask_id } = props;

  // handle func get data task from task_id or subtask_id
  const { data, isLoading } = useQuery(
    ["task", task_id, subtask_id],
    async () => {
      const params = subtask_id ? { subtask_id } : { task_id };

      const response = await client.get(
        Endpoint.TASKS_LOG,
        params,
        API_URL
      );
      console.log("this is id task", task_id);
      console.log("this is id subtask", subtask_id);

      console.log("data task log nè", response.data.data);

      return response.data.data;
    },
    {
      enabled: !!task_id,
    }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }
  const activities = Array.isArray(data) ? data : [];


  return (
    <Stack>
      {activities.map((item) => (
        <Item key={item.id} {...item} />
      ))}
    </Stack>
  );
};

export default memo(Activities);



const Item = (props: ActivityTaskLog) => {
  const { created_time, user, action, task } = props;
  console.log("this is item", props);

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
        {formatDate(created_time, DATE_TIME_FORMAT_SLASH)}
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
        <Avatar size={32} src={user?.avatar} />
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
          {task?.task_name}
        </Text>
        {/* in
        <Text noWrap component="span" variant="inherit" mx={0.75}>
          {project.name}
        </Text> */}
      </Text>
    </Stack>
  );
};
