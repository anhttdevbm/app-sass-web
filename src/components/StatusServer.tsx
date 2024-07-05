import { CircularProgress } from "@mui/material";
import { memo } from "react";
import { Text } from "./shared";

type StatusServerProps = {
  isFetching?: boolean;
  error?: string;
  children: React.ReactNode;
  noData?: boolean;
  isIdle?: boolean;
};

const StatusServer = (props: StatusServerProps) => {
  const { isFetching, error, children, noData, isIdle = true } = props;
  if (isFetching) {
    return (
      <CircularProgress
        color="primary"
        size={24}
        sx={{ mx: "auto", alignSelf: "center" }}
      />
    );
  }

  if (error) {
    return (
      <Text variant="body2" textAlign="center" p={3} fontWeight={600}>
        {error}
      </Text>
    );
  }

  if (noData && isIdle) return null;

  if (noData && !isIdle)
    return (
      <Text variant="body2" textAlign="center" p={3} fontWeight={600}>
        No data
      </Text>
    );

  return children;
};

export default memo(StatusServer);
