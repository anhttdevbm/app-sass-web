"use client";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/js/plugins/link.min.js";
import "froala-editor/js/plugins/lists.min.js";
import "froala-editor/js/plugins/quote.min.js";
import "froala-editor/js/plugins/special_characters.min.js";

import { Box, Popover, Stack } from "@mui/material";
import { Button } from "components/shared";
import { replaceDescriptionBr } from "components/sn-project-detail/Tasks/helpers";
import { AN_ERROR_TRY_AGAIN, NS_COMMON } from "constant/index";
import CloseIcon from "icons/CloseIcon";
import { useTranslations } from "next-intl";
import { PropsWithChildren, useEffect, useRef, useState } from "react";
import FroalaEditorComponent from "react-froala-wysiwyg";
import { useSnackbar } from "store/app/selectors";
import { useTaskDetail } from "store/project/selectors";
import { getMessageErrorByAPI } from "utils/index";

type Description = PropsWithChildren<{
  taskId?: string;
  taskListId?: string;
  subTaskId?: string;
}>;

const Description = (props: Description) => {
  const { children = "--", taskId, taskListId, subTaskId } = props;
  const { onUpdateTask } = useTaskDetail();
  const ref = useRef<HTMLElement | null>(null);
  const [isOverflow, setIsOverflow] = useState<boolean>(false);
  const commonT = useTranslations(NS_COMMON);
  const [anchorEl, setAnchorEl] = useState<HTMLParagraphElement | null>(null);
  const [text, setText] = useState<string | undefined>(
    children == "--" ? "" : (children as string),
  );
  const [count, setCount] = useState(
    children?.toString().replace(/<[^>]+>/g, "").length || 0,
  );
  const { onAddSnackbar } = useSnackbar();

  const handleClick = (event: React.MouseEvent<HTMLParagraphElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  useEffect(() => {
    setIsOverflow((ref.current?.scrollHeight ?? 0) > 38);
  }, []);

  const onSubmit = async () => {
    try {
      if (!taskListId || !taskId) {
        throw AN_ERROR_TRY_AGAIN;
      }

      const data = { description: text };
      if (text) {
        data.description = replaceDescriptionBr(text);
      }
      const newData = await onUpdateTask(data, taskListId, taskId, subTaskId);
      if (newData) {
        onAddSnackbar(
          commonT("notification.success", { label: commonT("form.save") }),
          "success",
        );
      }
    } catch (error) {
      onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
    } finally {
      handleClose();
    }
  };

  return (
    <>
      <Box
        component="p"
        ref={ref}
        sx={{
          fontSize: 14,
          px: 2,
          m: 0,
          py: "3px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          width: "100%",
          whiteSpace: "nowrap",
          height: 30,
          cursor: "pointer",
          "& > p": {
            m: 0,
          },
          "& *": {
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "100%",
          },
        }}
        className="html"
        onClick={handleClick}
        dangerouslySetInnerHTML={{
          __html: (children as string) || "--",
        }}
      />

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        sx={{
          ".MuiPaper-root": {
            border: "1px solid  #ECECF3",
            borderRadius: "8px",
            boxShadow: "0px 4px 20px 0px rgba(33, 33, 33, 0.04)",

            ".fr-wrapper > div:not([class])": {
              display: "none",
            },
          },
        }}
      >
        <Box
          padding="44px 24px 24px"
          position="relative"
          width="100%"
          maxWidth="343px"
        >
          <Box
            position="absolute"
            top="12px"
            right="24px"
            sx={{ cursor: "pointer" }}
            onClick={handleClose}
          >
            <CloseIcon />
          </Box>
          <Box
            sx={{
              padding: "8px 20px",
              borderRadius: "4px",
              background: "#F7F7FD",
              resize: "vertical",
              overflow: "auto",
              color: "#333",
            }}
          >
            <FroalaEditorComponent
              tag="textarea"
              config={{
                placeholderText: "--",
                charCounterMax: 2000,
                toolbarInline: true,
                toolbarButtons: [
                  "bold",
                  "italic",
                  "underline",
                  "strikeThrough",
                  "formatUL",
                  "formatOL",
                  "insertLink",
                ],
                events: {
                  input: (inputEvent) => {
                    setCount(inputEvent.target.innerText.length);
                  },
                },
              }}
              model={text}
              onModelChange={(event) => setText(event)}
            />
          </Box>
          <Box
            display="flex"
            justifyContent="end"
            mt={5 / 8}
            sx={{
              color: "#999",
              fontSize: "12px",
              fontWeight: 400,
              lineHeight: "16px",
            }}
          >
            {count}/2000
          </Box>

          <Stack direction="row" alignItems="center" spacing={3} mt={14.5 / 8}>
            <Button
              onClick={handleClose}
              type="button"
              variant="primaryOutlined"
              size="small"
              sx={{ flex: 1 }}
            >
              {commonT("form.cancel")}
            </Button>
            <Button
              onClick={onSubmit}
              type="button"
              variant="primary"
              size="small"
              sx={{ flex: 1 }}
            >
              {commonT("form.save")}
            </Button>
          </Stack>
        </Box>
      </Popover>
    </>
  );
};

export default Description;
