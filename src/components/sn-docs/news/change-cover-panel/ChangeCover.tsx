import React, { useContext, useState } from "react";
// import { ReactComponent as UnsplashIcon } from "../../assets/icons/unsplash-logo.svg";
import styles from "./changeCover.module.scss";
import Upload from "./Upload";
import CoverLink from "./CoverLink";
import Unsplash from "./Unsplash";
import { useDispatch } from "react-redux";
import { ThemeContext } from "../context/ThemeContext";
import { useAppSelector } from "store/hooks";
import UnsplashIcon from "../asset/icons/UnsplashIcon";

type ChangeCoverProps = {
  open: boolean;
  onClose: () => void;
};

const ChangeCover: React.FC<ChangeCoverProps> = ({ open, onClose }) => {
  const { theme } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState("gallery");
  const pageInfo = useAppSelector((state) => state.doc.pageInfo);
  const dispatch = useDispatch();

  if (!open) return null;

  const handleRemove = () => {
    const pageData = {
      pageId: pageInfo!.id,
      url: "",
      verticalPosition: 0,
    };

    // mutateUpdatePageCover(pageData, {
    //   onSuccess: async () => {
    //     const updatedPage: PageState = {
    //       ...pageInfo!,
    //       coverPicture: {
    //         ...pageInfo!.coverPicture,
    //         url: "",
    //         verticalPosition: 0,
    //       },
    //     };

    //     dispatch(setPage(updatedPage));
    //   },
    // });
  };

  return (
    <>
      <div
        className={`${styles.change_cover_background} ${styles[theme]}`}
        onClick={onClose}
      >
        <div
          className={`${styles.change_cover}`}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className={`${styles.header}`}>
            <div className={`${styles.left_header}`}>
              <div
                className={`${styles.tab} ${
                  activeTab === "gallery" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("gallery")}
              >
                <p>Gallery</p>
              </div>
              <div
                className={`${styles.tab} ${
                  activeTab === "upload" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("upload")}
              >
                <p>Upload</p>
              </div>
              <div
                className={`${styles.tab} ${
                  activeTab === "link" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("link")}
              >
                <p>Link</p>
              </div>
              <div
                className={`${styles.tab} ${
                  activeTab === "unsplash" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("unsplash")}
              >
                <p className={`${styles.unsplash}`}>
                  <UnsplashIcon />
                  Unsplash
                </p>
              </div>
            </div>
            <div className={`${styles.right_header}`}>
              <div className={`${styles.tab} `} onClick={handleRemove}>
                <p>Remove</p>
              </div>
            </div>
          </div>
          <div className={`${styles.body}`}>
            {(() => {
              if (activeTab === "gallery") {
                return <div></div>;
              } else if (activeTab === "upload") {
                return <Upload />;
              } else if (activeTab === "link") {
                return <CoverLink />;
              } else {
                return <Unsplash />;
              }
            })()}
          </div>
        </div>
      </div>
      ;
    </>
  );
};

export default ChangeCover;
