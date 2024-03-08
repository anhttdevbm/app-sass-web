import { memo } from "react";
import { SvgIcon, SvgIconProps } from "@mui/material";

const FolderIcon = (props: SvgIconProps) => {
  return (
    <svg
      width="21"
      height="20"
      viewBox="0 0 21 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18.3917 11.918L18.0584 16.0846C17.9334 17.3596 17.8334 18.3346 15.575 18.3346H5.09171C2.83337 18.3346 2.73337 17.3596 2.60837 16.0846L2.27504 11.918C2.20837 11.2263 2.42504 10.5846 2.81671 10.093C2.82504 10.0846 2.82504 10.0846 2.83337 10.0763C3.29171 9.51797 3.98337 9.16797 4.75837 9.16797H15.9084C16.6834 9.16797 17.3667 9.51797 17.8167 10.0596C17.825 10.068 17.8334 10.0763 17.8334 10.0846C18.2417 10.5763 18.4667 11.218 18.3917 11.918Z"
        stroke="#1BC5BD"
        strokeWidth="1.5"
        strokeMiterlimit="10"
      />
      <path
        d="M3.25006 9.52474V5.23307C3.25006 2.39974 3.95839 1.69141 6.79173 1.69141H7.85006C8.9084 1.69141 9.15006 2.00807 9.55006 2.54141L10.6084 3.95807C10.8751 4.30807 11.0334 4.52474 11.7417 4.52474H13.8667C16.7001 4.52474 17.4084 5.23307 17.4084 8.06641V9.55807"
        stroke="#1BC5BD"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.19171 14.168H12.475"
        stroke="#1BC5BD"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default memo(FolderIcon);
