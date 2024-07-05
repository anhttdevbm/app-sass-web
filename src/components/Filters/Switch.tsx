import { memo, useMemo } from "react";
import {
  Switch as SwitchShared,
  SwitchProps as SwitchSharedProps,
} from "components/shared";

type SwitchProps = Omit<SwitchSharedProps, "onChange" | "value"> & {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (name: string, value: any) => void;
  value?: "true" | "false" | boolean;
};

const Switch = (props: SwitchProps) => {
  const { name, onChange, value: valueProp = false, ...rest } = props;

  const value = useMemo(() => {
    if (typeof valueProp === "boolean") return valueProp;
    return valueProp === "true";
  }, [valueProp]);

  const onChangeSwitch = (checked: boolean) => {
    onChange(name, checked);
  };
  return (
    <SwitchShared
      name={name}
      onChange={onChangeSwitch}
      value={value}
      labelProps={{
        whiteSpace: "nowrap",
      }}
      {...rest}
    />
  );
};

export default memo(Switch);
