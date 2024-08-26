import { memo } from "react";
import { SvgIcon, SvgIconProps } from "@mui/material";

const ClosedTicketIcon = (props: SvgIconProps  & { colorCustom?: string }) => {
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
                <path d="M22.5945 11.5064V15.5038C22.5945 19.0015 20.6116 20.5005 17.6373 20.5005H7.72285C4.74851 20.5005 2.76562 19.0015 2.76562 15.5038V8.50843C2.76562 5.01073 4.74851 3.51172 7.72285 3.51172H12.6801"stroke={props.colorCustom ?? "inherit"} stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M7.72266 9.00781L10.8259 11.5062C11.8471 12.3256 13.5226 12.3256 14.5438 11.5062"stroke={props.colorCustom ?? "inherit"} stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M20.0971 2.83259L20.3747 3.4022C20.5135 3.68202 20.8605 3.94185 21.1679 4.00181L21.5446 4.06177C22.6749 4.25165 22.9426 5.09109 22.1296 5.92055L21.7826 6.27031C21.5545 6.51015 21.4257 6.96985 21.4951 7.28964L21.5446 7.49951C21.852 8.8786 21.1282 9.40824 19.9385 8.68871L19.6807 8.53882C19.3734 8.35894 18.8776 8.35894 18.5703 8.53882L18.3125 8.68871C17.1129 9.41823 16.3891 8.8786 16.7064 7.49951L16.7559 7.28964C16.8253 6.96985 16.6965 6.51015 16.4684 6.27031L16.1214 5.92055C15.3084 5.09109 15.5761 4.25165 16.7064 4.06177L17.0831 4.00181C17.3806 3.95185 17.7375 3.68202 17.8763 3.4022L18.1539 2.83259C18.6892 1.7433 19.5617 1.7433 20.0971 2.83259Z"stroke={props.colorCustom ?? "inherit"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M24.2833 5.39644C24.2833 8.10565 22.1115 10.2929 19.4434 10.2929C16.7754 10.2929 14.6035 8.10565 14.6035 5.39644C14.6035 2.68723 16.7754 0.5 19.4434 0.5C22.1115 0.5 24.2833 2.68723 24.2833 5.39644Z" fill="white"stroke={props.colorCustom ?? "inherit"} />
            </svg>






        </SvgIcon>
    );
};

export default memo(ClosedTicketIcon);
