import { memo } from "react";
import { NS_COMMON, NS_PROJECT } from "constant/index";
import { useTranslations } from "next-intl";
import { useSnackbar } from "store/app/selectors";
import { getMessageErrorByAPI } from "utils/index";
import { useProjects } from "store/project/selectors";
import { Date } from "components/Filters"; // Import the necessary components
import Content from "components/sn-project-detail/Tasks/components/Content";

type DatePickerProps = {
    value?: string;
    id: string;
    rootSx?: object;
    labelName?: string;
};

const DatePicker = (props: DatePickerProps) => {
    const { value, id, labelName = "" } = props;

    const commonT = useTranslations(NS_COMMON);
    const projectT = useTranslations(NS_PROJECT);
    const { onUpdateProject } = useProjects();
    const { onAddSnackbar } = useSnackbar();

    const handleDatePicker = async (newDate, value) => {
        try {            
            await onUpdateProject(id, { [labelName]: value });
            onAddSnackbar(
                projectT("taskDetail.notification.dateSuccess"),
                "success",
            );
        } catch (error) {
            onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
        }
    };

    return (
        <Content
            sx={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                "* > p ": {
                    color: "unset",
                    fontWeight: "normal",
                },
            }}
        >
            <Date
                label={commonT("form.title.selectTime")}
                name={labelName} 
                onChange={(name, value) =>
                    handleDatePicker(name, value)
                }
                value={value}
                iconProps={{
                    sx: { fontSize: 16, display: "none" },
                }}
            />
        </Content>
    );
};

export default memo(DatePicker);
