import { memo } from "react";
import Box from "@mui/material/Box";
import SvgIcon from "@mui/material/SvgIcon";

const SvgProcessRing = memo(function SvgProcessRing({ size }: {
  size: number
}) {
  return (
    <SvgIcon
      width="240"
      height="240"
      viewBox="0 0 240 240"
      sx={{
        "&": {
          "--circumfence": 690,
          "--gradient-stop-1": "#2AF598",
          "--gradient-stop-2": "#009EFD",
          "--bg-color": "#D9F0FD",
          display: "block",
          fontSize: size,
        },
        "& circle#ring": {
          stroke: "url(#mainGradient)",
          transform: "rotate(-90deg)",
          transformOrigin: "120px 120px",
          strokeDasharray: "var(--circumfence)",
          strokeDashoffset: "calc((100 - var(--percentage, 100)) / 100 * var(--circumfence))",
          opacity: "var(--ring-opacity, 1)",
        }
      }}
    >
      <defs>
        <linearGradient id="mainGradient" x1="0" x2="0" y1="0" y2="1">
          <stop stopColor="var(--gradient-stop-1)" offset="0%"/>
          <stop stopColor="var(--gradient-stop-2)" offset="100%"/>
        </linearGradient>
      </defs>
      <circle id="bg" cx="120" cy="120" r="120" strokeWidth="0" strokeLinecap="round" fill="var(--bg-color)" fillOpacity="20%"></circle>
      <circle id="ring" cx="120" cy="120" r="110" strokeWidth="20" strokeLinecap="round" fill="none"></circle>
    </SvgIcon>
  )
})

const ProcessRing = ({ size, percentage, children }) => {
  return (
    <Box position="relative" width={size} height={size}>
      <Box position="absolute" top={0} left={0} zIndex={10} sx={{ "--percentage": percentage }}>
        <SvgProcessRing size={size}/>
      </Box>
      <Box position="absolute" width={size} height={size} display="flex" justifyContent="center" alignItems="center" zIndex={100}>
        { children }
      </Box>
    </Box>
  )
}

export default ProcessRing;
