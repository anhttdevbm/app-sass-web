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
    return (
        <Box sx={{ position: "relative" }}>
            <BorderLinearProgress
                sx={{
                    width: `${value}%`,
                    ".MuiLinearProgress-bar": {
                        transform: "none!important",
                        background: "linear-gradient(90deg, #2AF598 0%, #009EFD 100%)",
                        borderRadius: "100px",
                    },
                }}
                variant="determinate"
                value={100}
            />
            <Box
                sx={{
                    top: 0,
                    left: `${value - 15}%`,
                    bottom: 0,
                    right: 0,
                    position: "absolute",
                    display: "flex",
                    color: "white",
                    fontSize: "13px",
                    fontWeight: 700
                }}
            >
                {value}%
            </Box>
        </Box>
    );
};
