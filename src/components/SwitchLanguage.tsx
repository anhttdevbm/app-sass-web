import {
  Switch as MuiSwitch,
  Stack,
  StackProps,
  switchClasses,
  SxProps,
  Select,
  MenuItem,
} from "@mui/material";
import { Locale } from "constant/types";
import { useLocale } from "next-intl";
import { useRouter } from "next-intl/client";
import { memo, useRef } from "react";
import Link from "./Link";
import useQueryParams from "hooks/useQueryParams";
import { useTranslations } from "next-intl";
import { NS_COMMON } from "constant/index";

const SwitchLanguage = (props: StackProps) => {
  const { replace } = useRouter();
  const { fullPath } = useQueryParams();
  const locale = useLocale() as Locale;
  const linkRef = useRef<HTMLLinkElement | null>(null);
  const commonT = useTranslations(NS_COMMON);

  const onChangeValue = () => {
    if (linkRef?.current?.href) {
      replace(linkRef.current.href);
    }
  };

  const langData = [
    {
      img: "/images/img-usa-flag.png",
      alt: "USA Flag",
      content: commonT("i18n.en"),
      value: "en",
    },
    {
      img: "/images/img-vn-flag.png",
      alt: "Vietnamese Flag",
      content: commonT("i18n.vn"),
      value: "vi",
    }
  ];

  return (
    <Stack {...props}>
      <Select
        value={locale}
        onChange={onChangeValue}
        sx={{
          ...defaultSx,
          boxShadow: "none",
          ".MuiOutlinedInput-notchedOutline": { border: "0 !important" },
        }}
      >
        {langData.map((item) => (
          <MenuItem
            value={item.value}
            key={item.value}
            sx={{ "* > p": { marginY: "8px" } }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={item.img}
                alt={item.alt}
                style={{ marginRight: "5px", width: "24px", height: "24px" }}
              />
              <p>{item.content}</p>
            </div>
          </MenuItem>
        ))}
      </Select>
      <Link
        ref={linkRef}
        href={fullPath}
        locale={locale === "vi" ? "en" : "vi"}
        sx={{ display: "none" }}
      />
    </Stack>
  );
};

export default memo(SwitchLanguage);

const defaultSx = {
  width: 162,
  height: 28,
  p: 0,
  borderRadius: 4,
  boxSizing: "border-box",
  [`&.${switchClasses.sizeSmall}`]: {
    height: 24,
    width: 48,
    [`& .${switchClasses.thumb}`]: {
      width: 20,
      height: 20,
    },
    [`& .${switchClasses.switchBase}`]: {
      [`&.${switchClasses.checked}`]: {
        left: 10,
      },
    },
  },
  [`& .${switchClasses.switchBase}`]: {
    p: 0,
    top: 2,
    left: 2,
    [`&.${switchClasses.disabled}`]: {
      opacity: 0.25,
    },
    [`&.${switchClasses.checked}`]: {
      top: 2,
      left: 14,
      [`&+.${switchClasses.track}`]: {
        borderColor: "grey.50",
        opacity: 1,
        backgroundColor: "grey.50",
      },
      [`&.${switchClasses.disabled}+.${switchClasses.track}`]: {
        opacity: 0.7,
      },
      [`& .${switchClasses.thumb}`]: {
        "&:before": {
          background: `url('/images/img-vn-flag.png') no-repeat center center`,
          backgroundSize: "cover",
        },
        "&:after": {
          content: "'VN'",
          left: -22,
        },
      },
    },
  },
  [`& .${switchClasses.track}`]: {
    border: "1px solid",
    borderColor: "grey.50",
    opacity: 1,
    backgroundColor: "grey.50",
    borderRadius: 4,
  },
  [`& .${switchClasses.thumb}`]: {
    width: 24,
    height: 24,
    backgroundColor: "grey.300",
    border: "1px solid",
    borderColor: "grey.300",
    borderRadius: "50%",
    boxSizing: "border-box",
    "&:before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      background: `url('/images/img-usa-flag.png') no-repeat center center`,
      backgroundSize: "cover",
    },
    "&:after": {
      content: "'ENG'",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 26,
      top: 0,
      fontSize: 14,
      color: "text.primary",
      fontWeight: 600,
    },
  },
};
