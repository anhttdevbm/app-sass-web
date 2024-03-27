import { Stack } from "@mui/material";
import React from "react";
import CommentEditor from "./CommentEditor";
import Comments from "./Comments";
import { Text } from "components/shared";
import { NS_SALES } from "constant/index";
import { useTranslations } from "next-intl";

const CommentSection = () => {
  const salesT = useTranslations(NS_SALES);

  return (
    <Stack>
      <Text color="text.main" mb={3} variant="h5" textTransform="uppercase">
        {salesT("detail.comment.title")}
      </Text>
      <CommentEditor />
      <Comments />
    </Stack>
  );
};

export default CommentSection;
