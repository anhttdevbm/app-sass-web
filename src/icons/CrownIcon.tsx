import { memo } from "react";
import { SvgIcon, SvgIconProps } from "@mui/material";

const CrownIcon = (props: SvgIconProps & { filled?: boolean }) => {
  const { filled, ...rest } = props;
  return (
    <SvgIcon
      viewBox="0 0 24 24"
      fill="none"
      fontSize="inherit"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      {filled ? (
        <>
          <path
            d="M17 22H7C6.59 22 6.25 21.66 6.25 21.25C6.25 20.84 6.59 20.5 7 20.5H17C17.41 20.5 17.75 20.84 17.75 21.25C17.75 21.66 17.41 22 17 22Z"
            fill="currentColor"
          />
          <path
            d="M20.35 5.52004L16.35 8.38004C15.82 8.76004 15.06 8.53004 14.83 7.92004L12.94 2.88004C12.62 2.01004 11.39 2.01004 11.07 2.88004L9.17001 7.91004C8.94001 8.53004 8.19001 8.76004 7.66001 8.37004L3.66001 5.51004C2.86001 4.95004 1.80001 5.74004 2.13001 6.67004L6.29001 18.32C6.43001 18.72 6.81001 18.98 7.23001 18.98H16.76C17.18 18.98 17.56 18.71 17.7 18.32L21.86 6.67004C22.2 5.74004 21.14 4.95004 20.35 5.52004ZM14.5 14.75H9.50001C9.09001 14.75 8.75001 14.41 8.75001 14C8.75001 13.59 9.09001 13.25 9.50001 13.25H14.5C14.91 13.25 15.25 13.59 15.25 14C15.25 14.41 14.91 14.75 14.5 14.75Z"
            fill="currentColor"
          />
        </>
      ) : (
        <>
          <path
            d="M16.7002 18.9801H7.3002C6.8802 18.9801 6.4102 18.6501 6.2702 18.2501L2.1302 6.67011C1.5402 5.01011 2.2302 4.50011 3.6502 5.52011L7.5502 8.31011C8.2002 8.76011 8.9402 8.53011 9.2202 7.80011L10.9802 3.11011C11.5402 1.61011 12.4702 1.61011 13.0302 3.11011L14.7902 7.80011C15.0702 8.53011 15.8102 8.76011 16.4502 8.31011L20.1102 5.70011C21.6702 4.58011 22.4202 5.15011 21.7802 6.96011L17.7402 18.2701C17.5902 18.6501 17.1202 18.9801 16.7002 18.9801Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M6.5 22H17.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M9.5 14H14.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </>
      )}
    </SvgIcon>
  );
};

export default memo(CrownIcon);
