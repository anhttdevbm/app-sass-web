import { memo, useMemo } from "react";
import Input, { InputProps } from "./Input";
import { InputAdornment } from "@mui/material";
import ChevronIcon from "icons/ChevronIcon";

type InputNumberProps = Omit<InputProps, "name" | "onChange"> & {
  numberType?: "integer" | "float";
  negative?: boolean;
  name: string;
  onChange: (name: string, newValue?: string | number) => void;
};

const InputNumber = (props: InputNumberProps) => {
  const {
    value,
    inputProps,
    onChange,
    numberType = "float",
    negative,
    name,
    onBlur: onBlurProps,
    ...rest
  } = props;

  const onChangeValue = (newValue?: string | number) => {
    let parsedValue = newValue ? newValue.toString() : "";
    if (
      parsedValue &&
      (numberType !== "integer" || !parsedValue.includes("."))
    ) {
      parsedValue = parsedValue.replace(/,/g, "");
      if (!isNaN(Number(parsedValue))) {
        if (parsedValue?.slice(0, 2) === "00") {
          // Avoid 000.x
          parsedValue = parsedValue.slice(1);
        }
        if (Number(newValue) >= 1 && (parsedValue[0] ?? "") === "0") {
          // Remove 0 to avoid 0123.444 => 123.444
          parsedValue = parsedValue?.slice(1);
        }
        if (Number(parsedValue) === Infinity) {
          parsedValue = "";
        }
        onChange(name, parsedValue);
      }
      // Handle negative
      if (negative && parsedValue === "-") {
        onChange(name, parsedValue);
      }
    } else {
      onChange(name, newValue);
    }
  };

  const valueFormatted = useMemo(() => {
    if (value === undefined) return value;
    const valueParsed =
      value === null
        ? ""
        : typeof value === "number"
        ? value.toString()
        : value;
    const arraySplit = valueParsed.split(".");
    const integer = arraySplit[0];
    const decimal = arraySplit[1] ?? "";
    return (
      valueWithCommas(integer) + (arraySplit.length === 2 ? "." : "") + decimal
    );
  }, [value]);

  const onAdd = (num: number) => {
    return () => {
      // handle negative
      if(!negative && num < 0 && !value) return

      const newValue =
        (!value && value != 0) ||
        isNaN(typeof value === "string" ? Number(value) : value)
          ? 1
          : Number(value) + num;
      onChange(name, newValue);
    };
  };

  const onBlur = (event) => {
    const numberable = Boolean(value || (value !== "" && value == 0));
    const newValue = numberable ? Number(value) : undefined;
    onChange(name, newValue);
    onBlurProps && onBlurProps(event);
  };

  return (
    <Input
      value={valueFormatted}
      inputProps={{
        onBlur,
        ...inputProps,
      }}
      onChangeValue={onChangeValue}
      name={name}
      {...rest}
      endNode={
        <InputAdornment sx={sxConfigs.adornment} position="end">
          <ChevronIcon
            onClick={onAdd(1)}
            sx={{ ...sxConfigs.icon, transform: "rotate(180deg)" }}
          />
          <ChevronIcon onClick={onAdd(-1)} sx={sxConfigs.icon} />
        </InputAdornment>
      }
    />
  );
};

export default memo(InputNumber);

const sxConfigs = {
  adornment: {
    flexDirection: "column",
    height: "100%",
    ml: 0,
  },
  icon: {
    color: "grey.400",
    cursor: "pointer",
    fontSize: 16,
    "&:hover": {
      color: "primary.main",
    },
  },
};

const valueWithCommas = (value: string | number) => {
  value = typeof value === "number" ? value.toString() : value;
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
