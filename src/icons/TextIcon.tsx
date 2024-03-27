import useTheme from "hooks/useTheme";
import React from "react";

const TextIcon = ({ active }: { active: boolean }) => {
  const theme = useTheme();
  const inActiveColor = theme.isDarkMode ? "white" : "black";
  const activeColor = "#3699FF";
  const color = active ? activeColor : inActiveColor;

  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19.7751 8.59909C19.4334 8.59909 19.1501 8.31576 19.1501 7.97409V6.45742C19.1501 5.84909 18.6584 5.35742 18.0501 5.35742H5.9501C5.34176 5.35742 4.8501 5.84909 4.8501 6.45742V7.98242C4.8501 8.32409 4.56676 8.60742 4.2251 8.60742C3.88343 8.60742 3.6001 8.32409 3.6001 7.97409V6.45742C3.6001 5.15742 4.65843 4.10742 5.9501 4.10742H18.0501C19.3501 4.10742 20.4001 5.16576 20.4001 6.45742V7.98242C20.4001 8.32409 20.1251 8.59909 19.7751 8.59909Z"
        fill={color}
      />
      <path
        d="M12 19.8924C11.6583 19.8924 11.375 19.6091 11.375 19.2674V5.42578C11.375 5.08411 11.6583 4.80078 12 4.80078C12.3417 4.80078 12.625 5.08411 12.625 5.42578V19.2674C12.625 19.6174 12.3417 19.8924 12 19.8924Z"
        fill={color}
      />
      <path
        d="M15.2835 19.8926H8.7168C8.37513 19.8926 8.0918 19.6092 8.0918 19.2676C8.0918 18.9259 8.37513 18.6426 8.7168 18.6426H15.2835C15.6251 18.6426 15.9085 18.9259 15.9085 19.2676C15.9085 19.6092 15.6251 19.8926 15.2835 19.8926Z"
        fill={color}
      />
      {active && (
        <path
          d="M24 22H0V26H24V22Z"
          fill={color}
          mask="url(#path-1-inside-1_3336_59441)"
        />
      )}
    </svg>
  );
};

export default TextIcon;
