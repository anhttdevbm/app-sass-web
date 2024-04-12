import { memo } from "react";
import { IconButton, IconButtonProps } from "components/shared";
import CloseIcon from "icons/CloseIcon";
import { NS_COMMON } from "constant/index";
import { useTranslations } from "next-intl";

type ClearProps = IconButtonProps & {
  onClear?: () => void;
};

const Clear = (props: ClearProps) => {
  const { onClear, sx, ...rest } = props;
  const t = useTranslations(NS_COMMON);

  return (
    <IconButton
      tooltip={t("filter.clear")}
      sx={{ color: "grey.300", ...sx }}
      noPadding
      onClick={onClear}
      {...rest}
    >
      <CloseIcon sx={{ fontSize: 18 }} />
    </IconButton>
  );
};

export default memo(Clear);
