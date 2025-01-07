import { SvgIcon, SvgIconProps } from "@mui/material";
import { memo } from "react";

const DuplicateItemIcon = (props: SvgIconProps) => {
    return (
        <SvgIcon
            viewBox="0 0 24 24"
            fill="none"
            fontSize="inherit"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path fillRule="evenodd" clipRule="evenodd" d="M6 4.25C6 3.00735 7.00736 2 8.25 2H18.75C19.9927 2 21 3.00736 21 4.25V17.75C21 18.9927 19.9927 20 18.75 20H18V20.75C18 21.9927 16.9927 23 15.75 23H5.25C4.00736 23 3 21.9927 3 20.75V7.25C3 6.00736 4.00736 5 5.25 5H6V4.25ZM7.5 5H15.75C16.9927 5 18 6.00736 18 7.25V18.5H18.75C19.1642 18.5 19.5 18.1642 19.5 17.75V4.25C19.5 3.83579 19.1642 3.5 18.75 3.5H8.25C7.83577 3.5 7.5 3.83579 7.5 4.25V5ZM4.5 7.25C4.5 6.83579 4.83578 6.5 5.25 6.5H15.75C16.1642 6.5 16.5 6.83579 16.5 7.25V20.75C16.5 21.1642 16.1642 21.5 15.75 21.5H5.25C4.83579 21.5 4.5 21.1642 4.5 20.75V7.25Z" fill="black" />
        </SvgIcon>
    );
};

export default memo(DuplicateItemIcon);
