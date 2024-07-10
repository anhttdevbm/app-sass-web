import { memo, useRef } from "react";
import { IconButton, IconButtonProps } from "components/shared";
import RefreshIcon from "icons/RefreshIcon";
import { useTranslations } from "next-intl";
import { NS_COMMON } from "constant/index";

type RefreshProps = IconButtonProps;

const Refresh = (props: RefreshProps) => {
  const { onClick, ...rest } = props;
  const t = useTranslations(NS_COMMON);

  const latestClickedRef = useRef<number | undefined>();

  const onRefresh = (event) => {
    if (
      latestClickedRef?.current &&
      Date.now() - latestClickedRef.current < 2000
    )
      return;
    latestClickedRef.current = Date.now();
    onClick && onClick(event);
  };

  return (
    <IconButton
      tooltip={t("filter.refresh")}
      noPadding
      onClick={onRefresh}
      {...rest}
    >
      <RefreshIcon
        sx={{
          fontSize: 20,
          color: "grey.300",
        }}
      />
    </IconButton>
  );
};

export default memo(Refresh);
