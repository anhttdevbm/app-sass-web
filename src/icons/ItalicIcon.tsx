import React, { memo } from 'react';
import SvgIcon from '@mui/material/SvgIcon';

const ItalicIcon = (props) => {
    return (
        <SvgIcon {...props} viewBox="0 0 12 14" style={{ width: 12, height: 14 }}>
            <path d="M4.16667 0.667969V3.41797H6.1925L3.0575 10.7513H0.5V13.5013H7.83333V10.7513H5.8075L8.9425 3.41797H11.5V0.667969H4.16667Z" fill="black" fillOpacity="0.54"/>
        </SvgIcon>
    );
};

export default memo(ItalicIcon);