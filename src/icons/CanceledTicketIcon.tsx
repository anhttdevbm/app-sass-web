import { memo } from "react";
import { SvgIcon, SvgIconProps } from "@mui/material";

const CanceledTicketIcon = (props: SvgIconProps  & { colorCustom?: string }) => {
    return (
        <SvgIcon
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <svg width="25" height="24" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.8995 10.6432V14.2773C20.8995 17.4572 19.0777 18.8199 16.345 18.8199H7.2361C4.50342 18.8199 2.68164 17.4572 2.68164 14.2773V7.91763C2.68164 4.73779 4.50342 3.375 7.2361 3.375H11.7906" stroke={props.colorCustom ?? "inherit"} stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M7.23633 8.37109L10.0874 10.6424C11.0256 11.3874 12.565 11.3874 13.5033 10.6424" stroke={props.colorCustom ?? "inherit"} stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M18.603 2.75835L18.8581 3.2762C18.9856 3.53059 19.3044 3.76681 19.5868 3.82132L19.9329 3.87583C20.9713 4.04845 21.2173 4.81161 20.4703 5.56569L20.1515 5.88366C19.942 6.10171 19.8236 6.51964 19.8874 6.81036L19.9329 7.00116C20.2153 8.25493 19.5503 8.73644 18.4573 8.0823L18.2204 7.94602C17.9381 7.78249 17.4826 7.78249 17.2002 7.94602L16.9634 8.0823C15.8612 8.74552 15.1963 8.25493 15.4878 7.00116L15.5333 6.81036C15.5971 6.51964 15.4787 6.10171 15.2692 5.88366L14.9503 5.56569C14.2034 4.81161 14.4493 4.04845 15.4878 3.87583L15.8339 3.82132C16.1072 3.77589 16.4351 3.53059 16.5626 3.2762L16.8177 2.75835C17.3095 1.76805 18.1111 1.76805 18.603 2.75835Z" stroke={props.colorCustom ?? "inherit"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        </SvgIcon>
    );
};

export default memo(CanceledTicketIcon);
