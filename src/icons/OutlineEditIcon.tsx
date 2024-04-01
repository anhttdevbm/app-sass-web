import { memo } from "react";
import { SvgIcon, SvgIconProps } from "@mui/material";

const OutlineEditIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M1.934 16.973a.906.906 0 0 1-.907-.907V4.816c0-.5.406-.906.907-.906h7.734a.5.5 0 1 0 0-1H1.934A1.906 1.906 0 0 0 .027 4.816v11.25c0 1.053.854 1.907 1.907 1.907h11.25a1.906 1.906 0 0 0 1.906-1.907V8.332a.5.5 0 1 0-1 0v7.734c0 .5-.406.907-.906.907H1.934Z" fill="#0575E6"/><path fill-rule="evenodd" clip-rule="evenodd" d="M6.472 11.528a.5.5 0 0 0 .452.136l2.486-.497a.5.5 0 0 0 .255-.136l7.955-7.955c.47-.47.47-1.232 0-1.702L16.626.38a1.203 1.203 0 0 0-1.702 0L6.97 8.335a.5.5 0 0 0-.136.255l-.497 2.486a.5.5 0 0 0 .136.452Zm8.519-9.8.64-.641c.08-.08.208-.08.288 0l.994.994c.08.08.08.208 0 .287l-.64.641-1.282-1.281Zm.574 1.988-1.281-1.281-6.5 6.5-.32 1.602 1.601-.32 6.5-6.5Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
};

export default memo(OutlineEditIcon);
