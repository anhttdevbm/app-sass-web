import { InputBaseProps } from "@mui/material";
import { Input, InputProps, Text, Tooltip } from "components/shared";
import React, { memo } from "react";
import {
  Controller,
  FieldValues,
  RegisterOptions,
  useFormContext,
  UseFormRegisterReturn,
} from "react-hook-form";
import CustomInput from "./CustomInput";

interface IProps {
  isEdit?: boolean;
  name: string;
  disabled?: boolean;
  control;
  value?: string | number;
  helperText?: string;
  inputProps?;
  toolTipText?: string;
  isRound?: boolean;
  type?: string;
  rules?: RegisterOptions<FieldValues>;
  required?: boolean;
}

const CustomDesktopInput = ({
  isEdit,
  name,
  control,
  inputProps,
  disabled,
  helperText,
  type = "string",
  toolTipText,
  isRound,
  value,
  rules,
  required,
}: IProps) => {
  const { register } = useFormContext();

  return (
    <div>
      {isEdit ? (
        // <Controller
        //   control={control}
        //   {...register(name)}
        //   render={({ field }) => (
        //     <Tooltip title={toolTipText}>
        //       <div>
        // {/* <Input
        //   InputLabelProps={{
        //     style: {
        //       pointerEvents: "none",
        //     },
        //   }}
        //   required={required}
        //   InputProps={inputProps}
        //   disabled={disabled}
        //   multiline={type === "number" ? false : true}
        //   maxRows={2}
        //   minRows={1}
        //   type={type}
        //   sx={{
        //     width: "100%",
        //   }}
        //   help erText={helperText}
        //   {...field}
        // /> */}
        <CustomInput
          control={control}
          register={register(name, {
            required: {
              value: required || false,
              message: "This field is required",
            },
          })}
          isRound={isRound}
          rules={rules}
          name={name}
          // InputLabelProps={{
          //   style: {
          //     pointerEvents: "none",
          //   },
          // }}
          // required={required}
          inputProps={inputProps}
          disabled={disabled}
          // multiline={type === "number" ? false : true}
          type={type}
          helperText={helperText}
          // {...field}
        />
      ) : (
        //       </div>
        //     </Tooltip>
        //   )}
        // />
        <Text
          variant="body2"
          sx={{
            pointerEvents: "none",
            display: "block",
            wordBreak: "break-word",
            height: "fit-content",
            boxSizing: "border-box",
          }}
        >
          {value}
        </Text>
      )}
    </div>
  );
};

export default CustomDesktopInput;
