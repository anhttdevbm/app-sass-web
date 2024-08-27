import { memo, useCallback, useEffect, useRef, useState } from "react";
import { IconButton, Input, InputProps } from "components/shared";
import SearchIcon from "icons/SearchIcon";
import useEventListener from "hooks/useEventListener";
import { useTranslations } from "next-intl";
import { NS_COMMON } from "constant/index";
import CircleCloseIcon from "icons/CircleCloseIcon";

export type SearchProps = Omit<InputProps, "name" | "onChange"> & {
  name: string;
  onChange?: (name: string, value?: string) => void;
  emitWhenEnter?: boolean;
  search?: string | number;
  hasClear?: boolean;
  onEnter?: (name, value?: string) => void;
};

const Search = (props: SearchProps) => {
  const {
    onChange,
    name,
    sx,
    value = "",
    emitWhenEnter,
    search,
    onEnter,
    hasClear = true,
    startNode = <SearchIcon />,
    endNode,
    onBlur: _onBlur,
    ...rest
  } = props;

  const commonT = useTranslations(NS_COMMON);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const prevTextRef = useRef<string | number | null>(value);

  const [text, setText] = useState<string | number | null>(value);

  const onEnterClicked = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== "Enter" || !emitWhenEnter) return;
      const searchValue = typeof text === "number" ? text.toString() : text;
      prevTextRef.current = searchValue;
      onChange && onChange(name, searchValue as string | undefined);
    },
    [name, onChange, text, emitWhenEnter],
  );

  useEventListener("keydown", onEnterClicked, inputRef?.current);

  const onChangeValue = (newValue?: string | number) => {
    setText(newValue ?? "");
    if (!emitWhenEnter) {
      onChange && onChange(name, `${newValue ?? ""}`);
    }
  };

  const onBlur = (e) => {
    if (prevTextRef.current != text && emitWhenEnter) {
      setText(prevTextRef.current);
    }
    _onBlur?.(e);
  };

  const onClear = (event) => {
    event.preventDefault();
    prevTextRef.current = "";
    setText("");
    onChange && onChange(name, "");
  };

  useEffect(() => {
    setText(value || search || "");
    if (!emitWhenEnter) return;
    prevTextRef.current = value || search || "";
  }, [value, emitWhenEnter, search]);

  return (
    <Input
      size="small"
      name={name}
      rootSx={{ height: 32, borderRadius: 1, backgroundColor: "transparent" }}
      sx={{
        height: 32,
        ...sx,
      }}
      InputProps={{
        onBlur,
      }}
      startNode={startNode}
      endNode={
        endNode
          ? endNode
          : !!value &&
            emitWhenEnter &&
            hasClear && (
              <IconButton onClick={onClear} noPadding size="small">
                <CircleCloseIcon />
              </IconButton>
            )
      }
      onKeyDown={(e) => {
        e.stopPropagation();
        if (e.key === "Enter") {
          onEnter && onEnter(name, text as string);
        }
      }}
      // placeholder={commonT("search")}
      placeholder={"USER"}
      onChangeValue={onChangeValue}
      value={text}
      {...rest}
    />
  );
};

export default memo(Search);
