import React, { memo } from 'react';
import SvgIcon from '@mui/material/SvgIcon';

const UnderlineIcon = (props) => {
    return (
        <SvgIcon {...props} viewBox="0 0 14 18" style={{ width: 14, height: 18 }}>
            <path d="M6.99967 13.5833C10.0338 13.5833 12.4997 11.1175 12.4997 8.08333V0.75H10.208V8.08333C10.208 9.8525 8.76884 11.2917 6.99967 11.2917C5.23051 11.2917 3.79134 9.8525 3.79134 8.08333V0.75H1.49967V8.08333C1.49967 11.1175 3.96551 13.5833 6.99967 13.5833ZM0.583008 15.4167V17.25H13.4163V15.4167H0.583008Z" fill="black" fillOpacity="0.54"/>
        </SvgIcon>
    );
};

export default memo(UnderlineIcon);