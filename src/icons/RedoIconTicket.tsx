import React, { memo } from 'react';
import SvgIcon from '@mui/material/SvgIcon';

const RedoIconTicket = (props) => {
    return (
        <SvgIcon {...props} viewBox="0 0 20 9" style={{ width: 20, height: 9 }}>
            <path d="M15.8671 3.71797C14.1713 2.24214 11.9713 1.33464 9.54211 1.33464C5.27961 1.33464 1.67711 4.11214 0.412109 7.95297L2.57544 8.66797C3.53794 5.7438 6.28794 3.6263 9.54211 3.6263C11.3296 3.6263 12.9613 4.2863 14.2354 5.34964L10.9171 8.66797H19.1671V0.417969L15.8671 3.71797Z" fill="black" fillOpacity="0.54"/>
        </SvgIcon>
    );
};

export default memo(RedoIconTicket);