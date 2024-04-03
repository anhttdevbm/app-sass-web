import { memo } from "react";
import { SvgIcon, SvgIconProps } from "@mui/material";

const NewCalendarIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon
      width="24"
      height="20"
      viewBox="0 0 24 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M19.195 2.558v-.796c0-.912-.741-1.653-1.652-1.653-.911 0-1.652.742-1.653 1.653v.796H8.11v-.796C8.11.851 7.369.11 6.457.11c-.91 0-1.652.74-1.652 1.652v.796H1.722C.772 2.558 0 3.331 0 4.28v13.888c0 .95.772 1.723 1.722 1.723h20.556c.95 0 1.722-.773 1.722-1.723V4.28c0-.95-.773-1.722-1.723-1.722h-3.082ZM16.173 4.42a1.652 1.652 0 0 0 3.022-.923V3.46h3.082c.453 0 .82.368.82.82v1.655H.903V4.28c0-.452.368-.82.82-.82h3.083v.037c0 .91.741 1.652 1.652 1.652h.03A1.654 1.654 0 0 0 8.11 3.497V3.46h7.78v.036c0 .342.104.66.283.924Zm2.12-1.414v.508a.751.751 0 0 1-1.5-.017V1.762a.751.751 0 0 1 1.5 0v1.244ZM6.457 4.247a.747.747 0 0 0 .53-.22.748.748 0 0 0 .22-.53V1.762a.751.751 0 0 0-1.501 0V3.497c0 .413.337.75.75.75ZM.901 6.837v11.331c0 .453.368.82.82.82h20.555c.453 0 .82-.367.82-.82V6.838H.903Z"
        fill="#4D4D4D"
      />
    </SvgIcon>
  );
};

NewCalendarIcon.displayName = "CalendarIcon";

export default memo(NewCalendarIcon);
