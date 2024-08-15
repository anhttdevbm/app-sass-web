import { memo } from "react";
import { SvgIcon, SvgIconProps } from "@mui/material";

const OpenTicketIcon = (props: SvgIconProps  & {colorCustom?: string}) => {
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
                <path d="M18.5851 9.58854V12.9219C18.5851 15.8385 16.9141 17.0885 14.4075 17.0885H6.05252C3.54601 17.0885 1.875 15.8385 1.875 12.9219V7.08854C1.875 4.17188 3.54601 2.92188 6.05252 2.92188H10.23" stroke={props.colorCustom ?? "inherit"} stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M6.05078 7.50391L8.66591 9.58724C9.52648 10.2706 10.9385 10.2706 11.799 9.58724" stroke={props.colorCustom ?? "inherit"} stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M16.4778 2.35312L16.7117 2.82812C16.8287 3.06145 17.1211 3.27812 17.3801 3.32812L17.6976 3.37812C18.6501 3.53645 18.8757 4.23646 18.1906 4.92812L17.8981 5.21978C17.706 5.41978 17.5974 5.80312 17.6558 6.06978L17.6976 6.24479C17.9566 7.39479 17.3467 7.83645 16.3441 7.23645L16.1269 7.11145C15.8679 6.96145 15.4501 6.96145 15.1911 7.11145L14.9739 7.23645C13.9629 7.84478 13.353 7.39479 13.6204 6.24479L13.6621 6.06978C13.7206 5.80312 13.612 5.41978 13.4198 5.21978L13.1274 4.92812C12.4423 4.23646 12.6679 3.53645 13.6204 3.37812L13.9378 3.32812C14.1885 3.28646 14.4893 3.06145 14.6062 2.82812L14.8402 2.35312C15.2914 1.44479 16.0266 1.44479 16.4778 2.35312Z" stroke={props.colorCustom ?? "inherit"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <circle cx="15.9277" cy="4.49219" r="4" fill="white" stroke={props.colorCustom ?? "inherit"} />
            </svg>



        </SvgIcon>
    );
};

export default memo(OpenTicketIcon);
