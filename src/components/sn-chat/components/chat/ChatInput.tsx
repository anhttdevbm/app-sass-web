"use client";

import Box from "@mui/material/Box";
import ChatEditor from "./ChatEditor";
import { memo, useEffect, useRef, useState } from "react";

interface ChatInputProps {
  isLoading: boolean;
  initalMessage?: string;
  files?: File[];
  onEnterMessage: (message: string) => void;
  onChangeFiles?: (file: File[]) => void;
  onResize?: (num?: number) => void;
  wrapperInputSx?: any;
}
const ChatInput = ({
  isLoading,
  initalMessage,
  files,
  onEnterMessage,
  onChangeFiles,
  onResize,
  wrapperInputSx,
}: ChatInputProps) => {
  const [bodyElement, setBodyElement] = useState(null);
  const resizeObserver = useRef(
    new ResizeObserver((entries) => onResize?.(entries[0].target.clientHeight)),
  );

  useEffect(() => {
    const currentElement = bodyElement;
    const currentObserver = resizeObserver.current;
    if (currentElement) {
      currentObserver.observe(currentElement);
    }
    return () => {
      if (currentElement) {
        currentObserver.unobserve(currentElement);
      }
    };
  }, [bodyElement]);

  return (
    <Box
      ref={setBodyElement}
      sx={{
        width: "100%",
        bottom: "1rem",
        ...(wrapperInputSx ? { ...wrapperInputSx } : {}),
      }}
    >
      <Box
        sx={{
          position: "relative",
          outline: "1px solid #e1e1e1",
          display: "initial",
        }}
      >
        <ChatEditor
          isLoading={isLoading}
          initalValue={initalMessage}
          files={files}
          onEnterText={onEnterMessage}
          onChangeFiles={onChangeFiles}
        />
      </Box>
    </Box>
  );
};

export default memo(ChatInput);
