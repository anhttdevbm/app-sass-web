import { Box, Stack, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { Text } from "components/shared";
import useSettingNotification from "queries/notificaiton/useSettingNotification";
import { userGetSettingNotification } from "queries/notificaiton/userGetSettingNotification";
import { memo, useEffect, useState } from "react";
import { useAuth, useSnackbar } from "store/app/selectors";

const SettingNotification = () => {
    const { settingNotification } = useSettingNotification()
    const { data: settingItem } = userGetSettingNotification()
    const { onAddSnackbar } = useSnackbar();
    const { user } = useAuth()

    const [projectNotifications, setProjectNotifications] = useState({
        project_updated_at: false,
        task_added_at: false,
        task_updated_at: false,
    });
    const [reminders, setReminders] = useState({
        due_date: false,
        one_day_before: false,
        two_day_before: false,
        one_week_before: false,

    });

    useEffect(() => {
        if (settingItem?.status == 200) {
            setProjectNotifications(settingItem?.data?.project[0])
            setReminders(settingItem?.data?.reminder[0])
        }
    }, [settingItem])

    const handleProjectChange = (event) => {
        setProjectNotifications({
            ...projectNotifications,
            [event.target.name]: event.target.checked,
        });

        const payload = {
            userId: user?.id,
            project: [
                {
                    ...projectNotifications,
                    [event.target.name]: event.target.checked,
                }
            ],
            reminder: [
                {
                    ...reminders,
                }
            ],
        }
        settingNotification.mutate(payload, {
            onSuccess: (data) => {
                onAddSnackbar(`${data?.data?.errorMessage ? data?.data?.errorMessage : "Update Success"}`, "success");
            },
            onError: (err) => {
                onAddSnackbar("update setting error!", "error");
            },
        });

    };


    const handleReminderChange = (event) => {
        setReminders({
            ...reminders,
            [event.target.name]: event.target.checked,
        });
        const payload = {
            userId: user?.id,
            project: [
                {
                    ...projectNotifications,
                }
            ],
            reminder: [
                {
                    ...reminders,
                    [event.target.name]: event.target.checked,
                }
            ],
        }
        settingNotification.mutate(payload, {
            onSuccess: (data) => {
                onAddSnackbar(`${data?.data?.errorMessage ? data?.data?.errorMessage : "Update Success"}`, "success");
            },
            onError: (err) => {
                onAddSnackbar("update setting error!", "error");
            },
        });
    };



    return (
        <Stack spacing={4}>
            <Box gap={1}>
                <Text fontSize={18}>Projects Notifications</Text>
                <Text mt={1} fontSize={12}>Set notification default to future project you are a member of</Text>

                <FormGroup>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={projectNotifications?.project_updated_at}
                                onChange={handleProjectChange}
                                name="project_updated_at"
                            />
                        }
                        label="Project update"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={projectNotifications?.task_added_at}
                                onChange={handleProjectChange}
                                name="task_added_at"
                            />
                        }
                        label="Tasks added"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={projectNotifications?.task_updated_at}
                                onChange={handleProjectChange}
                                name="task_updated_at"
                            />
                        }
                        label="Tasks update"
                    />
                </FormGroup>
            </Box>

            <Box gap={1}>
                <Text fontSize={18}>Reminder</Text>
                <Text mt={1} fontSize={12}>Set notification default to future to remind your task, deals...</Text>

                <FormGroup>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={reminders?.due_date}
                                onChange={handleReminderChange}
                                name="due_date"
                            />
                        }
                        label="Due date"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={reminders?.one_day_before}
                                onChange={handleReminderChange}
                                name="one_day_before"
                            />
                        }
                        label="1 day before due date"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={reminders?.two_day_before}
                                onChange={handleReminderChange}
                                name="two_day_before"
                            />
                        }
                        label="2 days before due date"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={reminders?.one_week_before}
                                onChange={handleReminderChange}
                                name="one_week_before"
                            />
                        }
                        label="1 week before due date"
                    />
                </FormGroup>
            </Box>
        </Stack>
    );
};

export default memo(SettingNotification);
