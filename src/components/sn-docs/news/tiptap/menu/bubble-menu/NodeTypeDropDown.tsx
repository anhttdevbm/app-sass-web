"use client";
/* eslint-disable @next/next/no-img-element */
import Tippy from "@tippyjs/react";
import { Editor } from "@tiptap/core";
import { useContext, useState } from "react";
// import {ReactComponent as DownIcon } from "../../../asset/icons/down-expand.svg";
import textImg from "../../../asset/images/bubble-menu/en-US.png";
import headerImg from "../../../asset/images/bubble-menu/header.57a7576a.png";
import subHeaderImg from "../../../asset/images/bubble-menu/subheader.9aab4769.png";
import subSubHeaderImg from "../../../asset/images/bubble-menu/subsubheader.d0ed0bb3.png";
import numberedImg from "../../../asset/images/bubble-menu/numbered-list.0406affe.png";
import bulletImg from "../../../asset/images/bubble-menu/bulleted-list.0e87e917.png";
import toDoImg from "../../../asset/images/bubble-menu/to-do.f8d20542.png";
import { ThemeContext } from "../../../context/ThemeContext";
import styles from "./nodeTypeDropDown.module.scss";
import toggleButtonStyles from "./nodeTypeToggle.module.scss";

const NodeTypeDropDown = ({ editor }: { editor: Editor }) => {
  const { theme } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);

  // const buttonText = () => {
  //   if (editor.isActive("heading", { level: 1 })) {
  //     return "Heading 1";
  //   }
  //   if (editor.isActive("heading", { level: 2 })) {
  //     return "Heading 2";
  //   }
  //   if (editor.isActive("heading", { level: 3 })) {
  //     return "Heading 3";
  //   }
  //   if (editor.isActive("orderedList")) {
  //     return "Number List";
  //   }
  //   if (editor.isActive("bulletList")) {
  //     return "Bullet List";
  //   }
  //   return "Normal Text";
  // };

  const isOnlyParagraph =
    !editor.isActive("bulletList") &&
    !editor.isActive("orderedList") &&
    !editor.isActive("heading");

  return (
    <Tippy
      appendTo={document.body}
      trigger="click"
      interactive
      animation="shift-toward-subtle"
      placement="bottom-start"
      content={
        <div className={`${styles.bubble_menu}  ${styles[theme]}`}>
          <div
            className={`${styles.bubble_dropdown_item}`}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
          >
            <div className={`${styles.bubble_dropdown_button}`}>
              <div className={`${styles.info}`}>
                <span className={`${styles.bubble_dropdown_button_label}`}>
                  Heading 1
                </span>
              </div>
            </div>
          </div>
          <div
            className={`${styles.bubble_dropdown_item}`}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            <div className={`${styles.bubble_dropdown_button}`}>
              <div className={`${styles.info}`}>
                <img
                  src={subHeaderImg as unknown as string}
                  alt="Heading 2"
                  width="24"
                  height="24"
                />
                <span className={`${styles.bubble_dropdown_button_label}`}>
                  Heading 2
                </span>
              </div>
              {editor.isActive("heading", { level: 2 }) && (
                <div className={`${styles.icon}`}>&#10003;</div>
              )}
            </div>
          </div>
          <div
            className={`${styles.bubble_dropdown_item}`}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
          >
            <div className={`${styles.bubble_dropdown_button}`}>
              <div className={`${styles.info}`}>
                <img
                  src={subSubHeaderImg as unknown as string}
                  alt="Heading 3"
                  width="24"
                  height="24"
                />
                <span className={`${styles.bubble_dropdown_button_label}`}>
                  Heading 3
                </span>
              </div>
              {editor.isActive("heading", { level: 3 }) && (
                <div className={`${styles.icon}`}>&#10003;</div>
              )}
            </div>
          </div>
          <div
            className={`${styles.bubble_dropdown_item}`}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <div className={`${styles.bubble_dropdown_button}`}>
              <div className={`${styles.info}`}>
                <img
                  src={numberedImg as unknown as string}
                  alt="Numbered List"
                  width="24"
                  height="24"
                />
                <span className={`${styles.bubble_dropdown_button_label}`}>
                  Numbered List
                </span>
              </div>
              {editor.isActive("orderedList") && (
                <div className={`${styles.icon}`}>&#10003;</div>
              )}
            </div>
          </div>
          <div
            className={`${styles.bubble_dropdown_item}`}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <div className={`${styles.bubble_dropdown_button}`}>
              <div className={`${styles.info}`}>
                <img
                  src={bulletImg as unknown as string}
                  alt="Bulleted List"
                  width="24"
                  height="24"
                />
                <span className={`${styles.bubble_dropdown_button_label}`}>
                  Bulleted List
                </span>
              </div>
              {editor.isActive("bulletList") && (
                <div className={`${styles.icon}`}>&#10003;</div>
              )}
            </div>
          </div>
          <div
            className={`${styles.bubble_dropdown_item}`}
            onClick={() => editor.chain().focus().toggleTaskList().run()}
          >
            <div className={`${styles.bubble_dropdown_button}`}>
              <div className={`${styles.info}`}>
                <img
                  src={toDoImg as unknown as string}
                  alt="Task List"
                  width="24"
                  height="24"
                />
                <span className={`${styles.bubble_dropdown_button_label}`}>
                  Task List
                </span>
              </div>
              {editor.isActive("taskList") && (
                <div className={`${styles.icon}`}>&#10003;</div>
              )}
            </div>
          </div>
        </div>
      }
    >
      <div
        className={`${toggleButtonStyles.bubble_toggle_dropdown} ${toggleButtonStyles[theme]}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">Node</span>
        <div className={`${toggleButtonStyles.icon}`}>{/* <DownIcon /> */}</div>
      </div>
    </Tippy>
  );
};

export default NodeTypeDropDown;
