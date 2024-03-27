/* eslint-disable react/display-name */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { stopPrevent } from "../../utils/eventModifier";
import styles from "./commandList.module.scss";
import { ThemeContext } from "../../../context/ThemeContext";
import { Box } from "@mui/material";
import Hg1Icon from "./asset/icons/Hg1Icon";
import H2Icon from "./asset/icons/H2Icon";
import H3Icon from "./asset/icons/H3Icon";
import H4Icon from "./asset/icons/H4Icon";
import BulletListIcon from "./asset/icons/BulletListIcon";
import NumberListIcon from "./asset/icons/NumberListIcon";
import TodoListIcon from "./asset/icons/TodoListIcon";
import TableIcon from "./asset/icons/TableIcon";
import CodeBlockIcon from "./asset/icons/CodeBlockIcon";
import QuoteIcon from "./asset/icons/QuoteIcon";
import VideoIcon from "./asset/icons/VideoIcon";
import FileIcon from "./asset/icons/FileIcon";
import ImageIcon from "./asset/icons/ImageIcon";
import DividerIcon from "./asset/icons/DividerIcon";

interface CommandListProps {
  items: any[];
  command: (...args: any[]) => any;
  editor: any;
  range: any;
}

export const CommandList = React.forwardRef(
  ({ items, command, editor, range }: CommandListProps, ref) => {
    console.log("🚀 ~ file: CommandList.tsx:35 ~ props:", range);
    const { theme } = useContext(ThemeContext);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      setSelectedIndex(0);
    }, [items]);

    useEffect(() => {
      scrollSelectedItemIntoView();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedIndex]);

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }: { event: KeyboardEvent }) => {
        if (event.key === "ArrowUp") {
          stopPrevent(event);
          upHandler();
          return true;
        }

        if (event.key === "ArrowDown") {
          stopPrevent(event);
          downHandler();
          return true;
        }

        if (event.key === "Enter") {
          stopPrevent(event);
          enterHandler();
          return true;
        }

        return false;
      },
    }));

    const upHandler = () => {
      setSelectedIndex((selectedIndex + items.length - 1) % items.length);
    };

    const downHandler = () => {
      setSelectedIndex((selectedIndex + 1) % items.length);
    };

    const enterHandler = () => {
      selectItem(selectedIndex);
    };

    const selectItem = (index: number) => {
      const item = items[index];

      if (item) setTimeout(() => command(item));
    };

    const scrollSelectedItemIntoView = () => {
      const container = scrollContainerRef.current;
      const selectedItem = container?.querySelector(
        // `.${styles.item}:nth-child(${selectedIndex + 1})`
        `.${styles.item}:nth-child(${selectedIndex + 2})`,
      );

      if (container && selectedItem) {
        const containerRect = container.getBoundingClientRect();
        const selectedItemRect = selectedItem.getBoundingClientRect();

        if (selectedItemRect.bottom > containerRect.bottom) {
          // Scroll down
          container.scrollTop += selectedItemRect.bottom - containerRect.bottom;
        } else if (selectedItemRect.top < containerRect.top) {
          // Scroll up
          container.scrollTop -= containerRect.top - selectedItemRect.top;
        }
      }
    };

    return (
      <div
        className={`${styles.items} ${styles[theme]}`}
        ref={scrollContainerRef}
      >
        <div
          onClick={() => {
            editor
              .chain()
              .focus()
              .deleteRange(range)
              .setNode("heading", { level: 1 })
              .run();
          }}
          className={`
         ${styles.item}`}
        >
          <Box
            sx={{
              display: "flex",
              justifyContentL: "center",
              alignItems: "center",
              background: "#F7F7FD",
              padding: "12px",
              borderRadius: "4px",
            }}
          >
            <Hg1Icon></Hg1Icon>
          </Box>
          <div className={`${styles.info}`}>
            <div className={`${styles.title}`}>Heading 1</div>
          </div>
        </div>

        <div
          onClick={() => {
            editor
              .chain()
              .focus()
              .deleteRange(range)
              .setNode("heading", { level: 2 })
              .run();
          }}
          className={`
         ${styles.item}`}
        >
          <Box
            sx={{
              display: "flex",
              justifyContentL: "center",
              alignItems: "center",
              background: "#F7F7FD",
              padding: "12px",
              borderRadius: "4px",
            }}
          >
            <H2Icon></H2Icon>
          </Box>
          <div className={`${styles.info}`}>
            <div className={`${styles.title}`}>Heading 2</div>
          </div>
        </div>

        <div
          onClick={() => {
            editor
              .chain()
              .focus()
              .deleteRange(range)
              .setNode("heading", { level: 3 })
              .run();
          }}
          className={`
         ${styles.item}`}
        >
          <Box
            sx={{
              display: "flex",
              justifyContentL: "center",
              alignItems: "center",
              background: "#F7F7FD",
              padding: "12px",
              borderRadius: "4px",
            }}
          >
            <H3Icon></H3Icon>
          </Box>
          <div className={`${styles.info}`}>
            <div className={`${styles.title}`}>Heading 3</div>
          </div>
        </div>

        <div
          onClick={() => {
            editor
              .chain()
              .focus()
              .deleteRange(range)
              .setNode("heading", { level: 4 })
              .run();
          }}
          className={`
         ${styles.item}`}
        >
          <Box
            sx={{
              display: "flex",
              justifyContentL: "center",
              alignItems: "center",
              background: "#F7F7FD",
              padding: "12px",
              borderRadius: "4px",
            }}
          >
            <H4Icon></H4Icon>
          </Box>
          <div className={`${styles.info}`}>
            <div className={`${styles.title}`}>Heading 4</div>
          </div>
        </div>

        <div
          onClick={() => {
            editor.chain().focus().deleteRange(range).toggleBulletList().run();
          }}
          className={`
         ${styles.item}`}
        >
          <Box
            sx={{
              display: "flex",
              justifyContentL: "center",
              alignItems: "center",
              background: "#F7F7FD",
              padding: "12px",
              borderRadius: "4px",
            }}
          >
            <BulletListIcon></BulletListIcon>
          </Box>
          <div className={`${styles.info}`}>
            <div className={`${styles.title}`}>Bullet list</div>
          </div>
        </div>

        <div
          onClick={() => {
            editor.chain().focus().deleteRange(range).toggleOrderedList().run();
          }}
          className={`
         ${styles.item}`}
        >
          <Box
            sx={{
              display: "flex",
              justifyContentL: "center",
              alignItems: "center",
              background: "#F7F7FD",
              padding: "12px",
              borderRadius: "4px",
            }}
          >
            <NumberListIcon></NumberListIcon>
          </Box>
          <div className={`${styles.info}`}>
            <div className={`${styles.title}`}>Numbered list</div>
          </div>
        </div>

        <div
          onClick={() => {
            editor.chain().focus().deleteRange(range).toggleTaskList().run();
          }}
          className={`
         ${styles.item}`}
        >
          <Box
            sx={{
              display: "flex",
              justifyContentL: "center",
              alignItems: "center",
              background: "#F7F7FD",
              padding: "12px",
              borderRadius: "4px",
            }}
          >
            <TodoListIcon></TodoListIcon>
          </Box>
          <div className={`${styles.info}`}>
            <div className={`${styles.title}`}>To do list</div>
          </div>
        </div>

        <div
          onClick={() => {
            editor
              .chain()
              .deleteRange(range)
              .insertTable({ rows: 1, cols: 2, withHeaderRow: false })
              .run();
          }}
          className={`
         ${styles.item}`}
        >
          <Box
            sx={{
              display: "flex",
              justifyContentL: "center",
              alignItems: "center",
              background: "#F7F7FD",
              padding: "12px",
              borderRadius: "4px",
            }}
          >
            <TableIcon></TableIcon>
          </Box>
          <div className={`${styles.info}`}>
            <div className={`${styles.title}`}>Table</div>
          </div>
        </div>

        <div
          onClick={() => {
            editor.chain().focus().deleteRange(range).toggleCode().run();
          }}
          className={`
         ${styles.item}`}
        >
          <Box
            sx={{
              display: "flex",
              justifyContentL: "center",
              alignItems: "center",
              background: "#F7F7FD",
              padding: "12px",
              borderRadius: "4px",
            }}
          >
            <CodeBlockIcon></CodeBlockIcon>
          </Box>
          <div className={`${styles.info}`}>
            <div className={`${styles.title}`}>Code block</div>
          </div>
        </div>
        <div
          onClick={() => {
            editor.chain().focus().deleteRange(range).setHorizontalRule().run();
          }}
          className={`
         ${styles.item}`}
        >
          <Box
            sx={{
              display: "flex",
              justifyContentL: "center",
              alignItems: "center",
              background: "#F7F7FD",
              padding: "12px",
              borderRadius: "4px",
            }}
          >
            <DividerIcon></DividerIcon>
          </Box>
          <div className={`${styles.info}`}>
            <div className={`${styles.title}`}>Divider</div>
          </div>
        </div>
        <div
          onClick={() => {
            editor.chain().focus().deleteRange(range).toggleBlockquote().run();
          }}
          className={`
         ${styles.item}`}
        >
          <Box
            sx={{
              display: "flex",
              justifyContentL: "center",
              alignItems: "center",
              background: "#F7F7FD",
              padding: "12px",
              borderRadius: "4px",
            }}
          >
            <QuoteIcon></QuoteIcon>
          </Box>
          <div className={`${styles.info}`}>
            <div className={`${styles.title}`}>Quote</div>
          </div>
        </div>
        <div
          className={`
         ${styles.item}`}
        >
          <Box
            sx={{
              display: "flex",
              justifyContentL: "center",
              alignItems: "center",
              background: "#F7F7FD",
              padding: "12px",
              borderRadius: "4px",
            }}
          >
            <ImageIcon></ImageIcon>
          </Box>
          <div className={`${styles.info}`}>
            <div className={`${styles.title}`}>Image</div>
          </div>
        </div>
        <div
          className={`
         ${styles.item}`}
        >
          <Box
            sx={{
              display: "flex",
              justifyContentL: "center",
              alignItems: "center",
              background: "#F7F7FD",
              padding: "12px",
              borderRadius: "4px",
            }}
          >
            <VideoIcon></VideoIcon>
          </Box>
          <div className={`${styles.info}`}>
            <div className={`${styles.title}`}>Video</div>
          </div>
        </div>
        <div
          className={`
         ${styles.item}`}
        >
          <Box
            sx={{
              display: "flex",
              justifyContentL: "center",
              alignItems: "center",
              background: "#F7F7FD",
              padding: "12px",
              borderRadius: "4px",
            }}
          >
            <FileIcon></FileIcon>
          </Box>
          <div className={`${styles.info}`}>
            <div className={`${styles.title}`}>File</div>
          </div>
        </div>

        {/* {items.length ? (
          <>
            {items.map((item, index) => {
              return (
                <div
                  className={`
                  ${styles.item}`}
                  key={item.title}
                  onClick={() => selectItem(index)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  onKeyDown={(e) => {
                    e.code === "Enter" && selectItem(index);
                  }}
                  tabIndex={0}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContentL: "center",
                      alignItems: "center",
                      background: "#F7F7FD",
                      padding: "12px",
                      borderRadius: "4px",
                    }}
                  >
                    <Hg1Icon></Hg1Icon>
                  </Box>
                  <div className={`${styles.info}`}>
                    <div className={`${styles.title}`}>{item.title}</div>
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <div className={`${styles.item}`}>
            <div className={`${styles.no_result}`}>No result</div>
          </div>
        )} */}
      </div>
    );
  },
);
