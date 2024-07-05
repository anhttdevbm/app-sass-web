import { Open_Sans } from "next/font/google";

export const openSans = Open_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Arial", "sans-serif"],
});

const typography = {
  fontFamily: openSans.style.fontFamily,
  h1: {
    fontWeight: 700,
    fontSize: 40,
    lineHeight: 1.25,
  },
  h2: {
    fontWeight: 700,
    fontSize: 32,
    lineHeight: 1.1875,
  },
  h3: {
    fontWeight: 700,
    fontSize: 24,
    lineHeight: 1.25,
  },
  h4: {
    fontWeight: 600,
    fontSize: 20,
    lineHeight: 1.2,
  },
  h5: {
    fontWeight: 600,
    fontSize: 16,
    lineHeight: 1.25,
  },
  h6: {
    fontSize: 14,
    lineHeight: "18px",
    fontWeight: 600,
  },
  body1: {
    fontSize: 16,
  },
  body2: {
    fontSize: 14,
  },
  subtitle1: {
    fontSize: 20,
  },
  subtitle2: {
    fontSize: 17,
  },
  caption: {
    fontSize: 12,
  },
  overline: {
    fontSize: 18,
  },
};

export default typography;
