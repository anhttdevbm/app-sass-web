import { memo } from "react";
import { SvgIcon, SvgIconProps } from "@mui/material";

const ResolvedTicketIcon = (props: SvgIconProps & { colorCustom?: string }) => {
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
                <path d="M22.709 11.5V15.5C22.709 19 20.709 20.5 17.709 20.5H7.70898C4.70898 20.5 2.70898 19 2.70898 15.5V8.5C2.70898 5 4.70898 3.5 7.70898 3.5H12.709" stroke={props.colorCustom ?? "inherit"} stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M7.70898 9L10.839 11.5C11.869 12.32 13.559 12.32 14.589 11.5" stroke={props.colorCustom ?? "inherit"} stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M20.1882 2.82141L20.4682 3.3914C20.6082 3.6714 20.9582 3.9314 21.2682 3.9914L21.6482 4.0514C22.7882 4.2414 23.0582 5.0814 22.2382 5.9114L21.8882 6.26139C21.6582 6.50139 21.5282 6.9614 21.5982 7.2814L21.6482 7.4914C21.9582 8.8714 21.2282 9.40139 20.0282 8.68139L19.7682 8.5314C19.4582 8.3514 18.9582 8.3514 18.6482 8.5314L18.3882 8.68139C17.1782 9.41139 16.4482 8.8714 16.7682 7.4914L16.8182 7.2814C16.8882 6.9614 16.7582 6.50139 16.5282 6.26139L16.1782 5.9114C15.3582 5.0814 15.6282 4.2414 16.7682 4.0514L17.1482 3.9914C17.4482 3.9414 17.8082 3.6714 17.9482 3.3914L18.2282 2.82141C18.7682 1.73141 19.6482 1.73141 20.1882 2.82141Z" stroke={props.colorCustom ?? "inherit"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>





        </SvgIcon>
    );
};

export default memo(ResolvedTicketIcon);
