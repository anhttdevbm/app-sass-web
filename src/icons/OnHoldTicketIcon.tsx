import { memo } from "react";
import { SvgIcon, SvgIconProps } from "@mui/material";

const OnHoldTicketIcon = (props: SvgIconProps  & {colorCustom?: string}) => {
    return (
        <SvgIcon
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.2664 11.5064V15.5038C22.2664 19.0015 20.2998 20.5005 17.3497 20.5005H7.51632C4.56629 20.5005 2.59961 19.0015 2.59961 15.5038V8.50843C2.59961 5.01073 4.56629 3.51172 7.51632 3.51172H12.433"  stroke={props.colorCustom ?? "inherit"} stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M7.51562 9.00781L10.5935 11.5062C11.6063 12.3256 13.2682 12.3256 14.281 11.5062"  stroke={props.colorCustom ?? "inherit"} stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M19.7873 2.83259L20.0627 3.4022C20.2003 3.68202 20.5445 3.94185 20.8493 4.00181L21.223 4.06177C22.344 4.25165 22.6095 5.09109 21.8032 5.92055L21.459 6.27031C21.2328 6.51015 21.105 6.96985 21.1739 7.28964L21.223 7.49951C21.5278 8.8786 20.81 9.40824 19.63 8.68871L19.3743 8.53882C19.0695 8.35894 18.5778 8.35894 18.273 8.53882L18.0173 8.68871C16.8275 9.41823 16.1096 8.8786 16.4243 7.49951L16.4735 7.28964C16.5423 6.96985 16.4145 6.51015 16.1883 6.27031L15.8441 5.92055C15.0378 5.09109 15.3033 4.25165 16.4243 4.06177L16.798 4.00181C17.093 3.95185 17.447 3.68202 17.5846 3.4022L17.86 2.83259C18.391 1.7433 19.2563 1.7433 19.7873 2.83259Z"  stroke={props.colorCustom ?? "inherit"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>




        </SvgIcon>
    );
};

export default memo(OnHoldTicketIcon);
