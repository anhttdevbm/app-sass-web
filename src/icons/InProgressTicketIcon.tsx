import { memo } from "react";
import { SvgIcon, SvgIconProps } from "@mui/material";

const InProgressTicketIcon = (props: SvgIconProps  & {colorCustom?: string}) => {
    return (
        <SvgIcon
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <svg width="25" height="24" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.17578 7.08464C2.17578 4.16797 3.84679 2.91797 6.3533 2.91797H14.7083C17.2148 2.91797 18.8858 4.16797 18.8858 7.08464V12.918C18.8858 15.8346 17.2148 17.0846 14.7083 17.0846H6.3533"  stroke={props.colorCustom ?? "inherit"} stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M14.7066 7.5L12.0915 9.58333C11.2309 10.2667 9.8189 10.2667 8.95833 9.58333L6.35156 7.5"  stroke={props.colorCustom ?? "inherit"} stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M2.17578 13.75H7.1888"  stroke={props.colorCustom ?? "inherit"} stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M2.17578 10.418H4.68229"  stroke={props.colorCustom ?? "inherit"} stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
            </svg>



        </SvgIcon>
    );
};

export default memo(InProgressTicketIcon);
