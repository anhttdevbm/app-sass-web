/* eslint-disable react/jsx-no-undef */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-explicit-any */
import DragIcon from "components/sn-docs/news/asset/icons/DragIcon";
import PlusIcon from "icons/PlusIcon";
import styles from "./dBlockNodeView.module.scss";
import {
  JSONContent,
  NodeViewContent,
  NodeViewProps,
  NodeViewWrapper,
  Content,
} from "@tiptap/react";
import { Text } from "components/shared";
import { ThemeContext } from "../../../context/ThemeContext";
import { useAppSelector } from "store/hooks";
import React, { useContext, useMemo, useRef, useState } from "react";
import {
  Box,
  ButtonBase,
  Divider,
  MenuItem,
  MenuList,
  Popover,
  Stack,
  popoverClasses,
} from "@mui/material";
import DuplicateIcon from "icons/DuplicateIcon";
import CopyLinkBlock from "icons/CopyLinkBlock";
import TextColorIcon from "icons/TextColorIcon";
import BgIcon from "icons/BgIcon";
import DeleteUserIcon from "icons/DeleteUserIcon";
import DeleteDocs from "icons/DeleteDocs";
import { ColorTypeDropDown } from "../../menu/bubble-menu/ColorTypeDropDown";
import CommentIcon from "icons/CommentIcon";
import ChangeIcon from "icons/ChangeIcon";
import { ChevronRight } from "@mui/icons-material";
import TextIcon from "icons/TextIcon";
import Hg1Icon from "../../menu/slash-menu/asset/icons/Hg1Icon";
import H2Icon from "../../menu/slash-menu/asset/icons/H2Icon";
import H3Icon from "../../menu/slash-menu/asset/icons/H3Icon";
import BulletList from "@tiptap/extension-bullet-list";
import BulletListIcon from "../../menu/slash-menu/asset/icons/BulletListIcon";
import NumberListIcon from "../../menu/slash-menu/asset/icons/NumberListIcon";
import TodoListIcon from "../../menu/slash-menu/asset/icons/TodoListIcon";
import QuoteIcon from "../../menu/slash-menu/asset/icons/QuoteIcon";
import CodeBlockIcon from "../../menu/slash-menu/asset/icons/CodeBlockIcon";

export const DBlockNodeView: React.FC<NodeViewProps> = ({
  node,
  getPos,
  editor,
  deleteNode,
}) => {
  const { theme } = useContext(ThemeContext);
  const pageInfo = useAppSelector((state) => state.doc.pageInfo);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );
  const [anchorElColor, setAnchorElColor] =
    React.useState<HTMLButtonElement | null>(null);
  const [anchorElTurnInto, setAnchorElTurnInto] =
    React.useState<HTMLButtonElement | null>(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const isTable = useMemo(() => {
    const { content } = node.content as any;

    return content[0].type.name === "table";
  }, [node.content]);

  const createNodeAfter = () => {
    const pos = getPos() + node.nodeSize;
    editor.commands.insertContentAt(pos, {
      type: "dBlock",
      content: [
        {
          type: "paragraph",
        },
      ],
    });
  };

  const onDuplicate = () => {};

  const TurnIntoOptions = [
    {
      icon: <TextIcon active={false} />,
      title: "Text",
      onClick: () => {
        const from = getPos();
        const to = getPos() + node.nodeSize;
        editor.chain().setTextSelection({ from, to }).toggleBold().run();
      },
    },
    {
      icon: <Hg1Icon></Hg1Icon>,
      title: "Heading 1",
      onClick: () => {
        const from = getPos();
        const to = getPos() + node.nodeSize;
        editor
          .chain()
          .setTextSelection({ from, to })
          .setHeading({ level: 1 })
          .run();
      },
    },
    {
      icon: <H2Icon />,
      title: "Heading 2",
      onClick: () => {
        const from = getPos();
        const to = getPos() + node.nodeSize;
        editor
          .chain()
          .setTextSelection({ from, to })
          .setHeading({ level: 2 })
          .run();
      },
    },
    {
      icon: <H3Icon />,
      title: "Heading 3",
      onClick: () => {
        const from = getPos();
        const to = getPos() + node.nodeSize;
        editor
          .chain()
          .setTextSelection({ from, to })
          .setHeading({ level: 3 })
          .run();
      },
    },
    {
      isBreakLine: true,
    },
    {
      icon: <BulletListIcon />,
      title: "Bullet list",
      onClick: () => {
        const from = getPos();
        const to = getPos() + node.nodeSize;
        editor.chain().setTextSelection({ from, to }).toggleBulletList().run();
      },
    },
    {
      icon: <NumberListIcon />,
      title: "Numbered list",
      onClick: () => {
        const from = getPos();
        const to = getPos() + node.nodeSize;
        editor.chain().setTextSelection({ from, to }).toggleOrderedList().run();
      },
    },
    {
      icon: <TodoListIcon />,
      title: "Todo list",
      onClick: () => {
        const from = getPos();
        const to = getPos() + node.nodeSize;
        editor.chain().setTextSelection({ from, to }).toggleTaskList().run();
      },
    },
    {
      icon: <QuoteIcon />,
      title: "Quote",
      onClick: () => {
        const from = getPos();
        const to = getPos() + node.nodeSize;
        editor.chain().setTextSelection({ from, to }).toggleBlockquote().run();
      },
    },
    {
      icon: <CodeBlockIcon />,
      title: "Code block",
      onClick: () => {
        const from = getPos();
        const to = getPos() + node.nodeSize;
        editor.chain().setTextSelection({ from, to }).toggleCode().run();
      },
    },
    // {
    // icon: <BulletList />,
    // title: "Bullet list",
    // onClick: () => {
    //   editor.chain().selectAll().setNodeType("bulletList").run();
    // },
    // },
  ];

  const fullWidth = pageInfo?.pageSettings?.fullWidth!;

  return (
    <>
      <NodeViewWrapper
        as="div"
        className={`${styles.dblock} ${styles[theme]} ${
          fullWidth ? styles.full_width : ""
        }`}
      >
        <section
          className={`${styles.wrapper_section}`}
          style={{
            position: "relative",
          }}
          aria-label="left-menu"
        >
          <Popover
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "center",
              horizontal: "right",
            }}
            sx={{
              [`& .${popoverClasses.paper}`]: {
                backgroundImage: "none",
                minWidth: 190,
                maxWidth: 190,
              },
            }}
            slotProps={{
              paper: {
                sx: {
                  borderRadius: 1,
                },
              },
            }}
          >
            <Stack
              sx={{
                boxShadow: "2px 2px 24px rgba(0, 0, 0, 0.1)",
                border: "1px solid",
                borderTopWidth: 0,
                borderColor: "grey.100",
                borderRadius: 1,
              }}
            >
              <MenuList component={Box}>
                <MenuItem
                  onClick={onDuplicate}
                  component={ButtonBase}
                  sx={sxConfig.item}
                >
                  <DuplicateIcon fontSize="medium"></DuplicateIcon>
                  <Text variant="body2" color="grey.400">
                    Duplicate
                  </Text>
                </MenuItem>
                <MenuItem component={ButtonBase} sx={sxConfig.item}>
                  <CopyLinkBlock></CopyLinkBlock>
                  <Text variant="body2" color="grey.400">
                    Copy link to block
                  </Text>
                </MenuItem>
                <MenuItem
                  onClick={(e) => setAnchorElColor(e.currentTarget)}
                  component={ButtonBase}
                  sx={sxConfig.item}
                >
                  <TextColorIcon></TextColorIcon>
                  <Text variant="body2" color="grey.400">
                    Text color
                  </Text>
                </MenuItem>
                <MenuItem component={ButtonBase} sx={sxConfig.item}>
                  <BgIcon></BgIcon>
                  <Text variant="body2" color="grey.400">
                    Background color
                  </Text>
                </MenuItem>
                <Divider />
                <MenuItem
                  // onClick={(e) => setAnchorElColor(e.currentTarget)}
                  component={ButtonBase}
                  sx={sxConfig.item}
                >
                  <CommentIcon></CommentIcon>
                  <Text variant="body2" color="grey.400">
                    Comment
                  </Text>
                </MenuItem>
                <Divider />
                <MenuItem
                  onClick={(e) => setAnchorElTurnInto(e.currentTarget)}
                  component={ButtonBase}
                  sx={sxConfig.item}
                >
                  <ChangeIcon></ChangeIcon>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      flexDirection: "row",
                      width: "100%",
                    }}
                  >
                    <Text variant="body2" color="grey.400">
                      Turn into
                    </Text>

                    <ChevronRight></ChevronRight>
                  </div>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    deleteNode();
                  }}
                  component={ButtonBase}
                  sx={sxConfig.item}
                >
                  <DeleteDocs></DeleteDocs>
                  <Text variant="body2" color="error.main">
                    Delete
                  </Text>
                </MenuItem>
              </MenuList>
            </Stack>
          </Popover>
          <Box
            sx={{
              display: {
                sm: "flex !important",
                xs: "none !important",
              },
            }}
            className={`${styles.icon}`}
            onClick={createNodeAfter}
          >
            <PlusIcon />
          </Box>
          <div
            onClick={handleClick}
            className={`${styles.icon}`}
            draggable
            data-drag-handle
          >
            <DragIcon />
          </div>
        </section>

        <NodeViewContent
          className={`${styles.dblock_view} ${
            isTable ? styles.margin_left : ""
          }`}
        />
        <Popover
          anchorEl={anchorElColor}
          open={Boolean(anchorElColor)}
          onClose={() => setAnchorElColor(null)}
          anchorOrigin={{
            vertical: "center",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "center",
            horizontal: "left",
          }}
          sx={{
            [`& .${popoverClasses.paper}`]: {
              backgroundImage: "none",
              minWidth: 190,
              maxWidth: 190,
            },
          }}
          slotProps={{
            paper: {
              sx: {
                borderRadius: 1,
              },
            },
          }}
        >
          <Stack
            py={2}
            sx={{
              boxShadow: "2px 2px 24px rgba(0, 0, 0, 0.1)",
              border: "1px solid",
              borderTopWidth: 0,
              borderColor: "grey.100",
              borderRadius: 1,
            }}
          ></Stack>
        </Popover>
        <Popover
          anchorEl={anchorElTurnInto}
          open={Boolean(anchorElTurnInto)}
          onClose={() => setAnchorElTurnInto(null)}
          anchorOrigin={{
            vertical: "center",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "center",
            horizontal: "left",
          }}
          sx={{
            [`& .${popoverClasses.paper}`]: {
              backgroundImage: "none",
              minWidth: 190,
              maxWidth: 190,
            },
          }}
          slotProps={{
            paper: {
              sx: {
                borderRadius: 1,
              },
            },
          }}
        >
          <Stack
            py={2}
            sx={{
              boxShadow: "2px 2px 24px rgba(0, 0, 0, 0.1)",
              border: "1px solid",
              borderTopWidth: 0,
              borderColor: "grey.100",
              borderRadius: 1,
            }}
          >
            {TurnIntoOptions.map((item, index) => {
              return item.isBreakLine ? (
                <Divider />
              ) : (
                <MenuItem
                  key={index}
                  onClick={item.onClick}
                  component={ButtonBase}
                  sx={sxConfig.item}
                >
                  {item.icon}
                  <Text variant="body2" color="grey.400">
                    {item.title}
                  </Text>
                </MenuItem>
              );
            })}
          </Stack>
        </Popover>
      </NodeViewWrapper>
    </>
  );
};

const sxConfig = {
  item: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    width: "100%",
    py: 1,
    px: 2,
  },
};
