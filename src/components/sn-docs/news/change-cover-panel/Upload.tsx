import React, { useContext } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "store/hooks";
import { uuid } from "utils/index";
import { ThemeContext } from "../context/ThemeContext";
import styles from "./upload.module.scss";

const Upload = () => {
  const id = uuid();
  const { theme } = useContext(ThemeContext);
  const pageInfo = useAppSelector((state) => state.doc.pageInfo);
  const dispatch = useDispatch();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedImage = e.target.files?.[0];

    if (selectedImage === null) return;


  };

  return (
    <div className={`${styles.container} ${styles[theme]}`}>
      <label htmlFor="file-upload" className={`${styles.file_upload}`}>
        Upload file
      </label>
      <input id="file-upload" type="file" onChange={handleFileUpload} />
      <p>Images wider that 1500 pixels work best.</p>
      <p>The maximum size per file is 5MB.</p>
    </div>
  );
};

export default Upload;
