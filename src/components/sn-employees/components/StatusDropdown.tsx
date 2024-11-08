import { ExpandMore } from "@mui/icons-material";
import {
    InputAdornment,
    MenuItem,
    SxProps,
    TextField,
    Typography,
} from "@mui/material";
import TextStatus from "components/TextStatus";
import { PayStatus } from "constant/enums";
import { NS_COMMON } from "constant/index";
import { useTranslations } from "next-intl";
import { PAYMENT_OPTIONS } from "../Actions";
import { COLOR_STATUS } from "../helpers";

const StatusDropdown = (props: {
    value: PayStatus;
    onChange: (value: PayStatus) => void;
    sx?: SxProps;
}) => {
    const commonT = useTranslations(NS_COMMON);

    return (
        <TextField
            select
            size="small"
            SelectProps={{
                displayEmpty: true,
                startAdornment: (
                    <InputAdornment position="start">
                        <Typography sx={{ color: "grey.600", fontWeight: 600 }}>
                            {commonT("status")}:
                        </Typography>
                    </InputAdornment>
                ),
                IconComponent: (_props) => <ExpandMore {..._props} />,
            }}
            value={props.value}
            onChange={(e) => props.onChange(e.target.value as unknown as PayStatus)}
            sx={{
                "& .MuiOutlinedInput-root": {
                    "& .MuiOutlinedInput-notchedOutline": {
                        borderRadius: "2rem",
                    },
                },
                ...props.sx,
            }}
        >
            <MenuItem value="">{commonT("all")}</MenuItem>
            {PAYMENT_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                    <TextStatus color={COLOR_STATUS[option.value]} text={""}>
                        {commonT(option.label)}
                    </TextStatus>
                </MenuItem>
            ))}
        </TextField>
    );
};

export default StatusDropdown;
