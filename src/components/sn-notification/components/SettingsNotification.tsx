import { Box, Stack, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { Text } from "components/shared";
import { memo, useState } from "react";

const SettingNotification = () => {
    const [projectNotifications, setProjectNotifications] = useState({
        projectUpdate: false,
        tasksAdded: false,
        tasksUpdate: false,
    });
    const [reminders, setReminders] = useState({
        dueDate: false,
        oneDayBefore: false,
        twoDaysBefore: false,
    });

    const handleProjectChange = (event) => {
        setProjectNotifications({
            ...projectNotifications,
            [event.target.name]: event.target.checked,
        });
    };

    const handleReminderChange = (event) => {
        setReminders({
            ...reminders,
            [event.target.name]: event.target.checked,
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
                                checked={projectNotifications.projectUpdate}
                                onChange={handleProjectChange}
                                name="projectUpdate"
                            />
                        }
                        label="Project update"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={projectNotifications.tasksAdded}
                                onChange={handleProjectChange}
                                name="tasksAdded"
                            />
                        }
                        label="Tasks added"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={projectNotifications.tasksUpdate}
                                onChange={handleProjectChange}
                                name="tasksUpdate"
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
                                checked={reminders.dueDate}
                                onChange={handleReminderChange}
                                name="dueDate"
                            />
                        }
                        label="Due date"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={reminders.oneDayBefore}
                                onChange={handleReminderChange}
                                name="oneDayBefore"
                            />
                        }
                        label="1 day before due date"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={reminders.twoDaysBefore}
                                onChange={handleReminderChange}
                                name="twoDaysBefore"
                            />
                        }
                        label="2 days before due date"
                    />
                </FormGroup>
            </Box>
        </Stack>
    );
};

export default memo(SettingNotification);
