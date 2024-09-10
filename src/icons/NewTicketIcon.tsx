import { memo } from "react";
import { SvgIcon, SvgIconProps } from "@mui/material";

const NewTicketIcon = (props: SvgIconProps  & {colorCustom?: string}) => {
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
                <path d="M18.4581 8.7513V12.918C18.4581 15.8346 16.7871 17.0846 14.2806 17.0846H5.92556C3.41905 17.0846 1.74805 15.8346 1.74805 12.918V7.08464C1.74805 4.16797 3.41905 2.91797 5.92556 2.91797H11.7741" stroke={props.colorCustom ?? "inherit"} stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M5.92383 7.5L8.53896 9.58333C9.39952 10.2667 10.8115 10.2667 11.6721 9.58333L12.658 8.8" stroke={props.colorCustom ?? "inherit"} stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M16.3681 6.66667C17.5216 6.66667 18.4568 5.73393 18.4568 4.58333C18.4568 3.43274 17.5216 2.5 16.3681 2.5C15.2145 2.5 14.2793 3.43274 14.2793 4.58333C14.2793 5.73393 15.2145 6.66667 16.3681 6.66667Z" stroke={props.colorCustom ?? "inherit"} stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
            </svg>


        </SvgIcon>
    );
};

export default memo(NewTicketIcon);
