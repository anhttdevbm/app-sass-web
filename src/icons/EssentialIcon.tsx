import { memo } from "react";
import { SvgIcon, SvgIconProps } from "@mui/material";

const EssentialIcon = (props: SvgIconProps) => {
    return (
        <SvgIcon
            viewBox="0 0 16 16"
            fill="none"
            fontSize="inherit"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.625 13.75H9.375C12.5 13.75 13.75 12.5 13.75 9.375V5.625C13.75 2.5 12.5 1.25 9.375 1.25H5.625C2.5 1.25 1.25 2.5 1.25 5.625V9.375C1.25 12.5 2.5 13.75 5.625 13.75Z" stroke="#212529" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M9.99852 7.5H10.0041" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M7.49657 7.5H7.50218" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M4.99657 7.5H5.00218" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>

        </SvgIcon>
    );
};

export default memo(EssentialIcon);
