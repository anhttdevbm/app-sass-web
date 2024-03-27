import { KeyboardEventHandler, memo, useId, useMemo } from "react";
import {
  ButtonBase,
  CircularProgress,
  ListSubheader,
  MenuItem,
  Stack,
  inputBaseClasses,
  selectClasses,
} from "@mui/material";
import { Option } from "constant/types";
import ChevronIcon from "icons/ChevronIcon";
import { Search } from "components/Filters";
import { debounce, uuid } from "utils/index";
import Avatar from "components/Avatar";
import UserPlaceholderImage from "public/images/img-user-placeholder.webp";
import { useTranslations } from "next-intl";
import { NS_COMMON, NS_SALES } from "constant/index";
import useToggle from "hooks/useToggle";
import { SearchProps } from "components/Filters/Search";
import Image from "next/image";
import { Input, InputProps, Text } from "components/shared";
import { StatusCell } from "components/Table";
import { COLOR_BILL_TYPE } from "components/sn-sales-detail/helpers";

export type SelectProps = InputProps & {
  options: Option[];
  hasAll?: boolean;
  pending?: boolean;
  showPlaceholder?: boolean;
  onEndReached?: () => void;
  onChangeSearch?: (name: string, newValue?: string | number) => void;
  searchProps?: Partial<SearchProps> & {
    name?: string;
    placeholder?: string;
    value?: string | number;
  };
  defaultValue?: string;
  hasAvatar?: boolean;
  hasIcon?: boolean;
  showSubText?: boolean;
  onOpen?: Function;
};

const ID_PLACEHOLDER = uuid();
const ID_PENDING = uuid();

const CustomLabelSelect = (props: SelectProps) => {
  const {
    options,
    hasAll,
    placeholder,
    value,
    pending,
    showPlaceholder,
    onEndReached,
    onChangeSearch,
    searchProps,
    onChange: onChangeProp,
    hasAvatar,
    showSubText = true,
    hasIcon,
    defaultValue,
    ...rest
  } = props;

  const commonT = useTranslations(NS_COMMON);

  const [isShow, onOpen, onClose] = useToggle(false);

  const hasValue = useMemo(
    () => options.some((option) => option.value === value),
    [options, value],
  );

  const optionList = useMemo(() => {
    if (hasAll || placeholder) {
      return [
        {
          label: hasAll && hasValue ? commonT("all") : placeholder,
          value: ID_PLACEHOLDER,
          hasAvatar: false,
        },
        ...options,
      ];
    }
    return options;
  }, [hasAll, placeholder, options, hasValue, commonT]) as unknown as Option[];

  const onOpenSelect = () => {
    props?.onOpen && props.onOpen();
    onOpen();
  };

  const onChange = (event) => {
    if (event.target.value === ID_PLACEHOLDER) {
      event.target.value = undefined;
      onChangeProp && onChangeProp(event);
    } else {
      onChangeProp && onChangeProp(event);
    }
  };

  const onKeyDown = (event) => {
    if (!["Enter", "Escape"].includes(event.key)) {
      event.stopPropagation();
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onScroll = debounce((event: any) => {
    const { scrollTop, clientHeight, scrollHeight } = event.target;

    if (scrollTop + clientHeight >= scrollHeight - WRONG_NUMBER) {
      onEndReached && onEndReached();
    }
  }, 250);

  return (
    <Input
      select
      defaultValue={defaultValue}
      SelectProps={{
        IconComponent: () => <ChevronIcon onClick={onOpen} />,
        open: isShow,
        onOpen: onOpenSelect,
        onClose,
        MenuProps: {
          PaperProps: {
            onScroll,
          },
          MenuListProps: {
            sx: {
              maxHeight: 300,
            },
          },
        },
      }}
      rootSx={defaultSx.input}
      value={hasValue ? value : showPlaceholder ? ID_PLACEHOLDER : defaultValue}
      onChange={onChange}
      {...rest}
    >
      {!!onChangeSearch && isShow && (
        <ListSubheader>
          <Search
            fullWidth
            sx={{ mt: 1 }}
            name="email"
            onChange={onChangeSearch}
            emitWhenEnter
            search={searchProps?.value}
            onKeyDown={onKeyDown}
            {...searchProps}
          />
        </ListSubheader>
      )}
      {optionList.map((option) => (
        <MenuItem
          sx={{
            ...defaultSx.item,

            display:
              (!hasValue && option.value === ID_PLACEHOLDER) ||
              value === ID_PLACEHOLDER
                ? "none"
                : undefined,
            // [`& td`]: {
            //   width: "100%!important",
            //   minWidth: "auto!important",
            //   maxWidth: "auto!important",
            // },
          }}
          key={option.value}
          value={option.value}
        >
          <Stack direction="row" alignItems="start" spacing={1} width="100%">
            {option.value !== ID_PLACEHOLDER && hasAvatar && (
              <Avatar src={option?.avatar ?? UserPlaceholderImage} size={24} />
            )}
            {hasIcon && !!option?.icon && (
              <Image
                src={option.icon as string}
                width={18}
                height={18}
                alt="icon"
              />
            )}
            <StatusCell
              sx={{
                [`&.MuiTableCell-body`]: {
                  borderBottom: "none",
                  height: "fit-content",
                },
                [`&.MuiTableCell-root`]: {
                  display: "flex",
                  borderBottom: "none",
                  alignItems: "center",
                  justifyContent: "start",
                  padding: 0,
                  width: "100%!important",
                  minWidth: "auto!important",
                  maxWidth: "auto!important",
                },
                [`&.MuiSvgIcon-root`]: {
                  display: "none",
                },
                width: "100%",
              }}
              textProps={{
                sx: {
                  fontSize: 12,
                  lineHeight: "20px",
                  px: 2,
                  width: "100%",
                },
              }}
              text={option.label}
              color={COLOR_BILL_TYPE[option.value]}
              namespace={NS_SALES}
            />
          </Stack>
        </MenuItem>
      ))}

      {pending && (
        <MenuItem sx={defaultSx.item} value={ID_PENDING}>
          <CircularProgress size={20} sx={{ mx: "auto" }} color="primary" />
        </MenuItem>
      )}
    </Input>
  );
};

export default memo(CustomLabelSelect);

const defaultSx = {
  input: {
    cursor: "pointer",
    "&:hover > svg": {
      color: "primary.main",
    },
    width: "100%",
    border: "none",
    padding: 0,

    backgroundColor: "none",
    [`&.${inputBaseClasses.focused} > svg`]: {
      color: "primary.main",
    },
    [`& .MuiStack-root`]: {
      width: "100%",
    },

    [`& svg`]: {
      display: "none",
    },
    // "& > svg": {
    //   fontSize: 24,
    //   color: "grey.400",
    // },
  },
  item: {
    fontSize: 14,
    color: "text.primary",
    lineHeight: "22px",
    // backgroundColor: "grey.50",
    "& > img": {
      mr: 1,
    },
    "&:hover": {
      backgroundColor: "primary.main",
      "& svg": {
        color: "common.white",
      },
    },
  },
};

const WRONG_NUMBER = 10;
