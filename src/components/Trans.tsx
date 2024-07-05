import { memo, useMemo } from "react";
import { Stack } from "@mui/material";

type TransProps = {
  children: string;
};

const Trans = (props: TransProps) => {
  const { children } = props;

  const newChildren = useMemo(() => {
    const _children = children;

    if (_children.includes("<br/>")) {
      return (
        <>
          {_children.split("<br/>")[0]}
          <br />
          {_children.split("<br/>")[1]}
        </>
      );
    }
    return 1;
  }, [children]);

  return newChildren;
};

export default memo(Trans);
