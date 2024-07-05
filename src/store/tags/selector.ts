import { DataStatus } from "constant/enums";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { TagData, createTags, getTags } from "./actions";
import { useEffect, useMemo, useState } from "react";
import { Option } from "constant/types";

export const useFetchTags = () => {
  const { tags, tagsStatus, onGetTags } = useTags();

  useEffect(() => {
    if (tagsStatus === DataStatus.IDLE) {
      onGetTags();
    }
  }, [tagsStatus]);

  return {
    tags,
    tagsStatus,
  };
};

export const useTags = () => {
  const { tags, tagsError, tagsStatus, tagsTotal } = useAppSelector(
    (state) => state.tags,
    shallowEqual,
  );
  const dispatch = useAppDispatch();

  const isLoading = useMemo(
    () => tagsStatus === DataStatus.LOADING,
    [tagsStatus],
  );
  const isSucceeded = useMemo(
    () => tagsStatus === DataStatus.SUCCEEDED,
    [tagsStatus],
  );

  const onCreateTags = async (tag: TagData) => {
    return (await dispatch(createTags(tag))
      .unwrap()
      .then((res) => res)) as TagData;
  };

  const onGetTags = (name?: string) => {
    dispatch(getTags(name));
  };

  return {
    tags,
    tagsError,
    tagsStatus,
    onGetTags,
    isLoading,
    isSucceeded,
    onCreateTags,
    tagsTotal,
    dispatch,
  };
};

export const useTagOptions = () => {
  const [tagsOptions, setTagsOptions] = useState<Option[]>([]);
  const { tags, onGetTags, isLoading } = useTags();

  useFetchTags();

  const onSearchTags = (name: string) => {
    onGetTags(name);
  };
  useEffect(() => {
    if (tags.length > 0) {
      const options = tags.map((tag) => ({
        label: tag.name,
        value: tag.id,
      }));
      setTagsOptions(options);
    }
  }, [tags]);

  return {
    onSearchTags,
    tagsOptions,
    isTagLoading: isLoading,
  };
};
