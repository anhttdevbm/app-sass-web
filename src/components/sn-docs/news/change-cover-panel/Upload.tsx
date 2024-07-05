import React, { useContext } from "react";
import styles from "./upload.module.scss";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useDispatch } from "react-redux";
import { ThemeContext } from "../context/ThemeContext";
import { uuid } from "utils/index";
import { storage } from "../config/firebase";
import { PageState, setPage } from "store/docs/reducer";
import { useAppSelector } from "store/hooks";

const Upload = () => {
  const id = uuid();
  const { theme } = useContext(ThemeContext);
  const pageInfo = useAppSelector((state) => state.doc.pageInfo);
  const dispatch = useDispatch();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedImage = e.target.files?.[0];

    if (selectedImage === null) return;

    const imageRef = ref(storage, `images/${selectedImage?.name + id}`);

    uploadBytes(imageRef, selectedImage!).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        const pageData = {
          pageId: pageInfo!.id,
          url,
          verticalPosition: 0,
        };
        const updatedPage: PageState = {
          ...pageInfo!,
          coverPicture: {
            ...pageInfo!.coverPicture,
            url,
          },
        };

        dispatch(setPage(updatedPage));
      });
    });
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
