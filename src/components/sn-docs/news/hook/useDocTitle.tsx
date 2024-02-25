import useDebounce from "hooks/useDebounce";
import { useEffect, useState } from "react";
import { useUpdateDocMutation } from "store/docs/api";
import { changeTitle } from "store/docs/reducer";
import { useAppDispatch, useAppSelector } from "store/hooks";

const useTitle = ({ title, handleTitleChange, setIsProjectIdChanged }) => {
  // return a textarea element for the title
  return (
    <input
      id="unique_title"
      defaultValue={title}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        handleTitleChange(event);
        setIsProjectIdChanged(false);
      }}
      placeholder="Enter title"
    />
  );
};

export default function useDocTitle() {
  const currentId = useAppSelector((state) => state.doc.id);
  const [updateDoc] = useUpdateDocMutation();
  const { title } = useAppSelector((state) => state.doc);
  const dispatch = useAppDispatch();
  const [handleTitleUpdate] = useDebounce((value: string) => {
    updateDoc({ id: currentId as string, payload: { name: value } });
  }, 1000);
  const [isProjectIdChanged, setIsProjectIdChanged] = useState(false);

  const [docTitle, setDocTitle] = useState(title);
  const onUpdate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isProjectIdChanged) {
      setDocTitle(e.target.value);
      await handleTitleUpdate(e.target.value);
    }
  };

  useEffect(() => {
    setIsProjectIdChanged(true);
  }, [currentId]);

  // create textArea for docTitle
  const titleElement = useTitle({
    title: docTitle,
    setIsProjectIdChanged: setIsProjectIdChanged,
    handleTitleChange: onUpdate,
  });

  return titleElement;
}
