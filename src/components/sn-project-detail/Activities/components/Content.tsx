import { memo } from "react";
import { Stack } from "@mui/material";
import { Text } from "components/shared";

type ContentProps = {
  action: string;
  note?: string;
};

const Content = (props: ContentProps) => {
  const { action, note } = props;
  return (
    <Stack flex={3} alignItems="flex-start">
      <Text variant="h5" color="text.primary">
        {action}
      </Text>
      <Text variant="body2" color="grey.400" textAlign="left">
        {note}
      </Text>
    </Stack>
  );
};

export default memo(Content);
