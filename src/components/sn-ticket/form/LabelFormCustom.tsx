import { Typography } from "@mui/material";

interface LabelFormCustomProps {
  title: string;
  required?: boolean;
}
const LabelFormCustom = ({ title, required }: LabelFormCustomProps) => {
  return (
    <Typography
      sx={{
        fontSize: "13px",
        color: "#4D4D4D",
        fontWeight: 700,
        paddingBottom: "15px",
      }}
    >
      {title}
      {required && (
        <span style={{ fontSize: "13px", color: "#FF2C56" }}>*</span>
      )}
    </Typography>
  );
};
export default LabelFormCustom;
