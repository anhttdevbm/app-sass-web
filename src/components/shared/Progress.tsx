import { Box } from "@mui/material";
import LinearProgress, {
    linearProgressClasses,
} from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 22,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor:
            theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
    },
}));

export const Progress = (value) => {
    const displayValue = value > 100 ? 100 : value;
    const background = value > 100 
        ? "linear-gradient(90deg, #FF0000 0%, #FF8C00 50%, #FFD700 100%)"
        : "linear-gradient(90deg, #2AF598 0%, #009EFD 100%)";

    return (
        <Box sx={{ position: "relative" }}>
            <BorderLinearProgress
                sx={{
                    width: `${displayValue}%`,
                    ".MuiLinearProgress-bar": {
                        transform: "none!important",
                        background: background,
                        borderRadius: "100px",
                    },
                }}
                variant="determinate"
                value={100}
            />
            <Box
                sx={{
                    top: 0,
                    left: `${displayValue - 15}%`,
                    bottom: 0,
                    right: 0,
                    position: "absolute",
                    display: "flex",
                    color: "white",
                    fontSize: "13px",
                    fontWeight: 700
                }}
            >
                {displayValue}%
            </Box>
        </Box>
    );
};
