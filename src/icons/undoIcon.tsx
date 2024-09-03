import React, { memo } from 'react';
import SvgIcon from '@mui/material/SvgIcon';

const UndoIcon = (props) => {
    return (
        <SvgIcon {...props} viewBox="0 0 20 9" style={{ width: 20, height: 9 }}>
            <path d="M10.458 1.33464C8.02884 1.33464 5.82884 2.24214 4.13301 3.71797L0.833008 0.417969V8.66797H9.08301L5.76467 5.34964C7.03884 4.2863 8.66134 3.6263 10.458 3.6263C13.703 3.6263 16.4622 5.7438 17.4247 8.66797L19.5972 7.95297C18.323 4.11214 14.7205 1.33464 10.458 1.33464Z" fill="black" fillOpacity="0.54"/>
        </SvgIcon>
    );
};

export default memo(UndoIcon);