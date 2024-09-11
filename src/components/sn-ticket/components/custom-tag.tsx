"use client";

import { Text } from "components/shared";
import React from "react";

type PropsTagIcon = {
  left: number;
  element: number;
  active: boolean;
  title: string;
  onClick: () => void;
};

const Tag = (props: PropsTagIcon) => {
  // Định nghĩa kiểu CSSProperties cho inline styles
  const tagStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    left: props.left,
  };

  const arrowStyle: React.CSSProperties = {
    content: '""',
    position: "absolute",
  };

  const containerTag: React.CSSProperties = {
    position: "relative",
    width: 126,
    height: 50,
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    flexShrink : 0
  };

  return (
    <>
      <div style={containerTag}>
        <div
          //  onClick={props?.onClick}
          style={tagStyle}
        >
          {props?.element == 1 && (
            <>
              <svg
                width="108"
                height="36"
                viewBox="0 0 108 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g filter="url(#filter0_d_8037_101601)">
                  <mask id="path-1-inside-1_8037_101601" fill="white">
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M2 5C2 2.79086 3.79086 1 6 1H89.3431C90.404 1 91.4214 1.42143 92.1716 2.17157L104.172 14.1716C105.734 15.7337 105.734 18.2663 104.172 19.8284L92.1716 31.8284C91.4214 32.5786 90.404 33 89.3431 33H6C3.79086 33 2 31.2091 2 29V5Z"
                    />
                  </mask>
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M2 5C2 2.79086 3.79086 1 6 1H89.3431C90.404 1 91.4214 1.42143 92.1716 2.17157L104.172 14.1716C105.734 15.7337 105.734 18.2663 104.172 19.8284L92.1716 31.8284C91.4214 32.5786 90.404 33 89.3431 33H6C3.79086 33 2 31.2091 2 29V5Z"
                    fill={props?.active ? "#14B9E5" : "white"}
                  />
                  <path
                    d="M104.172 14.1716L104.879 13.4645L104.172 14.1716ZM104.172 19.8284L103.464 19.1213L104.172 19.8284ZM92.1716 31.8284L91.4645 31.1213L92.1716 31.8284ZM92.1716 2.17157L92.8787 1.46447L92.1716 2.17157ZM89.3431 0H6V2H89.3431V0ZM91.4645 2.87868L103.464 14.8787L104.879 13.4645L92.8787 1.46447L91.4645 2.87868ZM103.464 14.8787C104.636 16.0503 104.636 17.9497 103.464 19.1213L104.879 20.5355C106.831 18.5829 106.831 15.4171 104.879 13.4645L103.464 14.8787ZM103.464 19.1213L91.4645 31.1213L92.8787 32.5355L104.879 20.5355L103.464 19.1213ZM6 34H89.3431V32H6V34ZM1 5V29H3V5H1ZM91.4645 31.1213C90.9019 31.6839 90.1388 32 89.3431 32V34C90.6692 34 91.941 33.4732 92.8787 32.5355L91.4645 31.1213ZM6 0C3.23858 0 1 2.23858 1 5H3C3 3.34315 4.34315 2 6 2V0ZM6 32C4.34315 32 3 30.6569 3 29H1C1 31.7614 3.23858 34 6 34V32ZM89.3431 2C90.1388 2 90.9019 2.31607 91.4645 2.87868L92.8787 1.46447C91.941 0.526784 90.6692 0 89.3431 0V2Z"
                    fill="#EFEFEF"
                    mask="url(#path-1-inside-1_8037_101601)"
                  />
                </g>
                <defs>
                  <filter
                    id="filter0_d_8037_101601"
                    x="0"
                    y="0"
                    width="107.343"
                    height="36"
                    filterUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB"
                  >
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset dy="1" />
                    <feGaussianBlur stdDeviation="1" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0.215686 0 0 0 0 0.254902 0 0 0 0 0.317647 0 0 0 0.08 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="BackgroundImageFix"
                      result="effect1_dropShadow_8037_101601"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect1_dropShadow_8037_101601"
                      result="shape"
                    />
                  </filter>
                </defs>
              </svg>
            </>
          )}

          {props?.element == 2 && (
            <svg
              width="126"
              height="36"
              viewBox="0 0 126 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g filter="url(#filter0_d_8037_98104)">
                <mask id="path-1-inside-1_8037_98104" fill="white">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M110.171 2.17157C109.421 1.42143 108.404 1 107.343 1H6.65646C3.09284 1 1.30817 5.30857 3.82803 7.82843L10.1712 14.1716C11.7333 15.7337 11.7333 18.2663 10.1712 19.8284L3.82803 26.1716C1.30817 28.6914 3.09283 33 6.65645 33H107.343C108.404 33 109.421 32.5786 110.171 31.8284L122.171 19.8284C123.733 18.2663 123.733 15.7337 122.171 14.1716L110.171 2.17157Z"
                  />
                </mask>
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M110.171 2.17157C109.421 1.42143 108.404 1 107.343 1H6.65646C3.09284 1 1.30817 5.30857 3.82803 7.82843L10.1712 14.1716C11.7333 15.7337 11.7333 18.2663 10.1712 19.8284L3.82803 26.1716C1.30817 28.6914 3.09283 33 6.65645 33H107.343C108.404 33 109.421 32.5786 110.171 31.8284L122.171 19.8284C123.733 18.2663 123.733 15.7337 122.171 14.1716L110.171 2.17157Z"
                  fill={props?.active ? "#14B9E5" : "white"}
                />
                <path
                  d="M10.1712 14.1716L9.46407 14.8787H9.46407L10.1712 14.1716ZM10.1712 19.8284L10.8783 20.5355L10.1712 19.8284ZM122.171 19.8284L121.464 19.1213L122.171 19.8284ZM122.171 14.1716L122.878 13.4645L122.171 14.1716ZM110.171 2.17157L110.878 1.46447L110.171 2.17157ZM110.171 31.8284L109.464 31.1213L110.171 31.8284ZM3.82803 7.82843L3.12092 8.53553L3.82803 7.82843ZM6.65646 2H107.343V0H6.65646V2ZM10.8783 13.4645L4.53514 7.12132L3.12092 8.53553L9.46407 14.8787L10.8783 13.4645ZM10.8783 20.5355C12.8309 18.5829 12.8309 15.4171 10.8783 13.4645L9.46407 14.8787C10.6356 16.0503 10.6356 17.9497 9.46407 19.1213L10.8783 20.5355ZM4.53514 26.8787L10.8783 20.5355L9.46407 19.1213L3.12092 25.4645L4.53514 26.8787ZM107.343 32H6.65645V34H107.343V32ZM121.464 19.1213L109.464 31.1213L110.878 32.5355L122.878 20.5355L121.464 19.1213ZM121.464 14.8787C122.636 16.0503 122.636 17.9497 121.464 19.1213L122.878 20.5355C124.831 18.5829 124.831 15.4171 122.878 13.4645L121.464 14.8787ZM109.464 2.87868L121.464 14.8787L122.878 13.4645L110.878 1.46447L109.464 2.87868ZM3.12092 25.4645C-0.0288978 28.6143 2.20192 34 6.65645 34V32C3.98374 32 2.64524 28.7686 4.53514 26.8787L3.12092 25.4645ZM107.343 2C108.138 2 108.901 2.31607 109.464 2.87868L110.878 1.46447C109.941 0.526784 108.669 0 107.343 0V2ZM107.343 34C108.669 34 109.941 33.4732 110.878 32.5355L109.464 31.1213C108.901 31.6839 108.138 32 107.343 32V34ZM6.65646 0C2.20193 0 -0.0289011 5.38571 3.12092 8.53553L4.53514 7.12132C2.64524 5.23143 3.98374 2 6.65646 2V0Z"
                  fill="#EFEFEF"
                  mask="url(#path-1-inside-1_8037_98104)"
                />
              </g>
              <defs>
                <filter
                  id="filter0_d_8037_98104"
                  x="0.648438"
                  y="0"
                  width="124.694"
                  height="36"
                  filterUnits="userSpaceOnUse"
                  color-interpolation-filters="sRGB"
                >
                  <feFlood flood-opacity="0" result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset dy="1" />
                  <feGaussianBlur stdDeviation="1" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0.215686 0 0 0 0 0.254902 0 0 0 0 0.317647 0 0 0 0.08 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_8037_98104"
                  />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow_8037_98104"
                    result="shape"
                  />
                </filter>
              </defs>
            </svg>
          )}

          {props?.element == 3 && (
            <svg
              width="61"
              height="36"
              viewBox="0 0 61 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g filter="url(#filter0_d_8037_98205)">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M3.82803 7.82843C1.30817 5.30857 3.09284 1 6.65646 1H54.9996C57.2087 1 58.9996 2.79086 58.9996 5V29C58.9996 31.2091 57.2087 33 54.9996 33H6.65646C3.09284 33 1.30817 28.6914 3.82803 26.1716L10.1712 19.8284C11.7333 18.2663 11.7333 15.7337 10.1712 14.1716L3.82803 7.82843Z"
                  fill={props?.active ? "#14B9E5" : "white"}
                />
              </g>
              <defs>
                <filter
                  id="filter0_d_8037_98205"
                  x="0.648438"
                  y="0"
                  width="60.3516"
                  height="36"
                  filterUnits="userSpaceOnUse"
                  color-interpolation-filters="sRGB"
                >
                  <feFlood flood-opacity="0" result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset dy="1" />
                  <feGaussianBlur stdDeviation="1" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0.215686 0 0 0 0 0.254902 0 0 0 0 0.317647 0 0 0 0.08 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_8037_98205"
                  />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow_8037_98205"
                    result="shape"
                  />
                </filter>
              </defs>
            </svg>
          )}
          <div style={arrowStyle}>
            <Text
              fontWeight={700}
              color={props?.active ? "#fff" : "#000"}
              sx={{ fontSize: 12 }}
            >
              {props?.title}
            </Text>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tag;
