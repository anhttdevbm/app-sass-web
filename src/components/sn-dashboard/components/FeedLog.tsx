/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Box,
    CircularProgress,
    Divider,
    Link,
    Stack,
    Typography
} from "@mui/material";
import Avatar from "components/Avatar";
import TASK_ACTION from "components/sn-time-tracking/components/Constants/Enums/TaskAction.enum";
import { NS_TIME_TRACKING } from "constant/index";
import dayjs from "dayjs";
import useTheme from "hooks/useTheme";
import _ from "lodash";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { WorkLogItem } from "store/timeTracking/reducer";
import { useGetMyTimeSheet } from "store/timeTracking/selectors";

interface IProps {
    events: any[];
    onClick(action: "create" | "edit", item?: any): void;
}


interface ITimeLogStructure {
    id: string;
    user_id: string;
    user: any;
    project_id: string;
    project: any;
    task_id: string;
    task_name: string;
    task_number: string;
    created_time: string;
    action: string;
}


const FeedLog: React.FC = ({ }) => {
    const isGetLoading: any = false;
    const [timeLogs, setTimeLogs] = useState<WorkLogItem[]>([]);
    const { workLog, onGetWorkLog } = useGetMyTimeSheet();
    const { isDarkMode } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    const [filters, setFilters] = useState({
        search_key: "",
        date: dayjs().format("YYYY-MM-DD"),
    });
    const timeT = useTranslations(NS_TIME_TRACKING);

    const taskActionStrings = {
        [TASK_ACTION.CREATE_TASK_LIST]: timeT("timeLog.createTL"),
        [TASK_ACTION.MOVE_TASK]: timeT("timeLog.moveT"),
        [TASK_ACTION.UPDATE_INACTIVE_TASK_LIST]: timeT("timeLog.upITL"),
        [TASK_ACTION.UPDATE_TASK_LIST]: timeT("timeLog.upTL"),
        [TASK_ACTION.UPDATE_TASK]: timeT("timeLog.upT"),
        [TASK_ACTION.UPDATE_SUB_TASK]: timeT("timeLog.upST"),
        [TASK_ACTION.UPDATE_INACTIVE_TASK]: timeT("timeLog.upIT"),
        [TASK_ACTION.UPDATE_INACTIVE_SUB_TASK]: timeT("timeLog.upIST"),
        [TASK_ACTION.CREATE_TASK]: timeT("timeLog.creT"),
        [TASK_ACTION.CREATE_SUB_TASK]: timeT("timeLog.creST"),
    };

    useEffect(() => {
        onGetWorkLog(filters);
    }, []);

    useEffect(() => {
        if (workLog?.data?.length) {
            setTimeLogs(workLog.data);
        } else {
            setTimeLogs([]);
        }
    }, [workLog]);

    const getTaskActionString = (action: string) => {
        return taskActionStrings[action as keyof typeof taskActionStrings] || "";
    };

    const _renderItem = useCallback(() => {
        if (_.isEmpty(timeLogs) && !isGetLoading)
            return (
                <Typography
                    sx={{
                        fontSize: "14px",
                        lineHeight: "18px",
                        fontWeight: 400,
                        color: "#666666",
                    }}
                >
                    No data were found
                </Typography>
            );
        return _.map(timeLogs, (timeLog: ITimeLogStructure, index: number) => {
            return (
                <Box key={timeLog?.id || index}>
                    <Stack direction="row" alignItems="center" padding="10px 0">
                        <Stack
                            direction="column"
                            sx={{
                                padding: "0 7px",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: "16px",
                                    lineHeight: "18px",
                                    fontWeight: 600,
                                    color: "#666666",
                                    textAlign: "center",
                                }}
                            >
                                {dayjs(timeLog?.created_time).format("HH:mm")}
                            </Typography>
                        </Stack>
                        <Box
                            sx={{
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                backgroundColor: "#1BC5BD",
                                margin: "0 8px 0 15px",
                            }}
                        />
                        <Avatar src={timeLog?.user?.avatar} size={32} />
                        <Stack direction="column">
                            <Typography
                                sx={{
                                    fontSize: "14px",
                                    lineHeight: "18px",
                                    fontWeight: 600,
                                    color: "#666666",
                                }}
                            >
                                <Link
                                    sx={{
                                        color: isDarkMode ? "common.white" : "#212121",
                                        textDecoration: "none",
                                        marginRight: "8px",
                                    }}
                                >
                                    {timeLog?.user?.fullname}
                                </Link>
                                {getTaskActionString(timeLog.action)}
                                <Typography
                                    component="span"
                                    sx={{
                                        color: "#3699FF",
                                        textDecoration: "none",
                                        margin: "0 6px",
                                    }}
                                >
                                    {`${timeLog?.task_number ? `#${timeLog.task_number}` : ""} ${timeLog?.task_name ? "-" : ""
                                        } ${timeLog?.task_name}`}
                                </Typography>
                                in {timeLog?.project?.name}
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: "12px",
                                    color: isDarkMode ? "common.white" : "#212121",
                                }}
                            >
                                {timeLog?.user?.position?.name}
                            </Typography>
                        </Stack>
                    </Stack>
                    <Divider sx={{ margin: "0" }} />
                </Box>
            );
        });
    }, [timeLogs]);


    return (
        <Stack direction="column">
            <Stack
                sx={{
                    width: 1,
                    height: `calc(100vh - 300px)`,
                    overflow: "auto",
                    position: "relative",
                }}
            >
                {isGetLoading && (
                    <Box
                        sx={{
                            position: "absolute",
                            width: 1,
                            height: 1,
                            top: 0,
                            left: 0,
                            backgroundColor: " rgba(0, 0, 0, 0.1)",
                            webkitTapHighlightColor: "transparent",
                        }}
                    >
                        <Stack
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                height: 1,
                                width: 1,
                            }}
                        >
                            <CircularProgress />
                        </Stack>
                    </Box>
                )}
                {_renderItem()}
            </Stack>
        </Stack>
    );
}

export default FeedLog;