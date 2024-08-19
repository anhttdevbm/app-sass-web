import { memo } from "react";
import { SvgIcon, SvgIconProps } from "@mui/material";

const ReplyIcon = (props: SvgIconProps) => {
    return (
             <svg width="18" height="13" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 13.1557V10.1557C15 9.19432 14.657 8.37066 13.971 7.68466C13.285 6.99866 12.4613 6.65566 11.5 6.65566H1.921L6.021 10.7557L5.308 11.4637L0 6.15566L5.308 0.847656L6.021 1.55566L1.921 5.65566H11.5C12.7427 5.65566 13.8033 6.09499 14.682 6.97366C15.5607 7.85232 16 8.91299 16 10.1557V13.1557H15Z" fill="white" />
            </svg>
    );
};

export default memo(ReplyIcon);
