"use client";

/* eslint-disable @next/next/no-img-element */
import React, { useContext } from "react";
import websiteImg from "../asset/images/profile/website.jpg";
import githubImg from "../asset/images/profile/github.jpg";
import twitterImg from "../asset/images/profile/twitter.jpg";
import linkedInImg from "../asset/images/profile/linkedin.jpg";
import cvImg from "../asset/images/profile/cv.jpg";
import styles from "../scss/projectInfo.module.scss";
import { ThemeContext } from "../../context/ThemeContext";

type ProjectInfoProps = {
  open: boolean;
  onClose: () => void;
};

const ProjectInfo: React.FC<ProjectInfoProps> = ({ open, onClose }) => {
  const { theme } = useContext(ThemeContext);

  if (!open) return null;

  return (
    <>
      <div
        className={`${styles.project_info_background} ${styles[theme]}`}
        onClick={onClose}
      >
        <div
          className={`${styles.project_info}`}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className={`${styles.title}`}>Engineer profile</div>
          <a
            href="https://shreyasmanolkar.com"
            target="blank"
            className={`${styles.tab}`}
          >
            <div className={`${styles.img}`}>
              <img src={websiteImg as unknown as string} alt="website" />
            </div>
            <div className={`${styles.info}`}>Shreyas Manolkar</div>
          </a>
          <a
            href="https://github.com/shreyasmanolkar"
            target="blank"
            className={`${styles.tab}`}
          >
            <div className={`${styles.img}`}>
              <img src={githubImg as unknown as string} alt="github" />
            </div>
            <div className={`${styles.info}`}>Git Hub</div>
          </a>
          <a
            href="https://twitter.com/ShreyasManolkar"
            target="blank"
            className={`${styles.tab}`}
          >
            <div className={`${styles.img}`}>
              <img src={twitterImg as unknown as string} alt="twitter" />
            </div>
            <div className={`${styles.info}`}>Twitter</div>
          </a>
          <a
            href="https://www.linkedin.com/in/shreyas-manolkar/"
            target="blank"
            className={`${styles.tab}`}
          >
            <div className={`${styles.img}`}>
              <img src={linkedInImg as unknown as string} alt="linkedIn" />
            </div>
            <div className={`${styles.info}`}>LinkedIn</div>
          </a>
          {/* TODO: update resume */}
          <a
            href="https://shreyasmanolkar.com/assets/Resume2.1.pdf"
            target="blank"
            className={`${styles.tab}`}
          >
            <div className={`${styles.img}`}>
              <img src={cvImg as unknown as string} alt="Curriculum vitae" />
            </div>
            <div className={`${styles.info}`}>Curriculum Vitae</div>
          </a>
        </div>
      </div>
    </>
  );
};

export default ProjectInfo;
