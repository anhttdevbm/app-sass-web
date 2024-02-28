"use client";

import Tippy from "@tippyjs/react";
import { Editor } from "@tiptap/core";
import { useContext, useState } from "react";
import styles from "./textColorDropdown.module.scss";
import dropButtonTogglestyles from "./colorTypeToggle.module.scss";
import { ThemeContext } from "components/sn-docs/news/context/ThemeContext";
import DownIcon from "components/sn-docs/news/asset/icons/DownIcon";

export const TextColorDropdown = ({ editor }: { editor: Editor }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useContext(ThemeContext);

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
          <div className={`${styles.color_menu_dropdown}`}>COLOR</div>
          <div
            className={`${styles.color_dropdown_button}`}
            onClick={() => editor.chain().focus().setColor("black").run()}
          >
            <div className={`${styles.info}`}>
              <div className={`${styles.default}`}>A</div>
              <span className={`${styles.label}`}>Black</span>
            </div>
          </div>
          <div
            className={`${styles.color_dropdown_button}`}
            onClick={() => editor.chain().focus().setColor("white").run()}
          >
            <div className={`${styles.info}`}>
              <div className={`${styles.white}`}>A</div>
              <span className={`${styles.label}`}>White</span>
            </div>
          </div>

          <div
            className={`${styles.color_dropdown_button}`}
            onClick={() => editor.chain().focus().setColor("#898989").run()}
          >
            <div className={`${styles.info}`}>
              <div className={`${styles.gray}`}>A</div>
              <span className={`${styles.label}`}>Gray</span>
            </div>
          </div>

          <div
            className={`${styles.color_dropdown_button}`}
            onClick={() => editor.chain().focus().setColor("#976f5e").run()}
          >
            <div className={`${styles.info}`}>
              <div className={`${styles.brown}`}>A</div>
              <span className={`${styles.label}`}>Brown</span>
            </div>
          </div>

          <div
            className={`${styles.color_dropdown_button}`}
            onClick={() => editor.chain().focus().setColor("#c27a47").run()}
          >
            <div className={`${styles.info}`}>
              <div className={`${styles.orange}`}>A</div>
              <span className={`${styles.label}`}>Orange</span>
            </div>
          </div>

          <div
            className={`${styles.color_dropdown_button}`}
            onClick={() => editor.chain().focus().setColor("#ca9849").run()}
          >
            <div className={`${styles.info}`}>
              <div className={`${styles.yellow}`}>A</div>
              <span className={`${styles.label}`}>Yellow</span>
            </div>
          </div>

          <div
            className={`${styles.color_dropdown_button}`}
            onClick={() => editor.chain().focus().setColor("#4b8c67").run()}
          >
            <div className={`${styles.info}`}>
              <div className={`${styles.green}`}>A</div>
              <span className={`${styles.label}`}>Green</span>
            </div>
          </div>

          <div
            className={`${styles.color_dropdown_button}`}
            onClick={() => editor.chain().focus().setColor("#5c83c2").run()}
          >
            <div className={`${styles.info}`}>
              <div className={`${styles.blue}`}>A</div>
              <span className={`${styles.label}`}>Blue</span>
            </div>
          </div>

          <div
            className={`${styles.color_dropdown_button}`}
            onClick={() => editor.chain().focus().setColor("#835bac").run()}
          >
            <div className={`${styles.info}`}>
              <div className={`${styles.purple}`}>A</div>
              <span className={`${styles.label}`}>Purple</span>
            </div>
          </div>

          <div
            className={`${styles.color_dropdown_button}`}
            onClick={() => editor.chain().focus().setColor("#d15796").run()}
          >
            <div className={`${styles.info}`}>
              <div className={`${styles.pink}`}>A</div>
              <span className={`${styles.label}`}>Pink</span>
            </div>
          </div>

          <div
            className={`${styles.color_dropdown_button}`}
            onClick={() => {
              editor.chain().focus().setColor("#df5452").run();
            }}
          >
            <div className={`${styles.info}`}>
              <div className={`${styles.red}`}>A</div>
              <span className={`${styles.label}`}>Red</span>
            </div>
          </div>
        </div>
      }
    >
      <div
        className={`${dropButtonTogglestyles.color_toggle_dropdown}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <span>A</span>

          <span
            style={{
              backgroundColor: editor.getAttributes("textStyle").color,
              width: "100%",
              height: "0.2rem",
            }}
          ></span>
        </div>
      </div>
    </Tippy>
  );
};
