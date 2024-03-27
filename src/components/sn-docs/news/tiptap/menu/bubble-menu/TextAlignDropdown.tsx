"use client";

import Tippy from "@tippyjs/react";
import { Editor } from "@tiptap/core";
import { useContext, useMemo, useState } from "react";
import styles from "./textColorDropdown.module.scss";
import dropButtonTogglestyles from "./colorTypeToggle.module.scss";
import { ThemeContext } from "components/sn-docs/news/context/ThemeContext";
import DownIcon from "components/sn-docs/news/asset/icons/DownIcon";
import {
  FormatAlignCenter,
  FormatAlignJustify,
  FormatAlignLeft,
  FormatAlignRight,
  FormatIndentDecrease,
  FormatIndentIncrease,
} from "@mui/icons-material";

export const TextAlignDropDown = ({ editor }: { editor: Editor }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useContext(ThemeContext);

  const isAlignleft = editor.isActive({ textAlign: "left" });
  const isAlignRight = editor.isActive({ textAlign: "right" });
  const isAlignCenter = editor.isActive({ textAlign: "center" });
  const isAlignJustify = editor.isActive({ textAlign: "justifiy" });

  const currentAlign = useMemo(() => {
    if (isAlignleft) return <FormatAlignLeft />;
    if (isAlignRight) return <FormatAlignRight />;
    if (isAlignCenter) return <FormatAlignCenter />;
    if (isAlignJustify) return <FormatAlignJustify />;
    return <FormatAlignLeft />;
  }, [isAlignleft, isAlignRight, isAlignCenter, isAlignJustify]);

  return (
    <Tippy
      appendTo={document.body}
      trigger="click"
      interactive
      animation="shift-toward-subtle"
      placement="bottom-start"
      offset={[0, 8]}
      zIndex={9999}
      content={
        <div className={`${styles.color_menu} ${styles[theme]}`}>
          <div className={`${styles.color_menu_dropdown}`}>TEXT ALIGN</div>

          <div
            className={`${styles.color_dropdown_button}`}
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
          >
            <div className={`${styles.info}`}>
              <FormatAlignLeft />
              <span className={`${styles.label}`}>Left</span>
            </div>
          </div>
          <div
            className={`${styles.color_dropdown_button}`}
            onClick={() => {
              alert("RIGHT!");
              editor.chain().focus().setTextAlign("right").run();
            }}
          >
            <div className={`${styles.info}`}>
              <FormatAlignRight />
              <span className={`${styles.label}`}>Right</span>
            </div>
          </div>

          <div
            className={`${styles.color_dropdown_button}`}
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
          >
            <div className={`${styles.info}`}>
              <FormatAlignCenter />
              <span className={`${styles.label}`}>Center</span>
            </div>
          </div>

          <div
            className={`${styles.color_dropdown_button}`}
            onClick={() =>
              editor.chain().focus().setTextAlign("justifiy").run()
            }
          >
            <div className={`${styles.info}`}>
              <FormatAlignJustify />
              <span className={`${styles.label}`}>Justify</span>
            </div>
          </div>
        </div>
      }
    >
      <div
        className={`${dropButtonTogglestyles.color_toggle_dropdown}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {currentAlign}
      </div>
    </Tippy>
  );
};
