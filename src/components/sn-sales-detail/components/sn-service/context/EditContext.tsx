import { is } from "date-fns/locale";
import React, { ReactNode, createContext } from "react";

interface EditContextProps {
  isEdit: boolean;
  setEdit: (value: boolean) => void;
}

export const EditContext = createContext<EditContextProps>({
  isEdit: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setEdit: () => {},
});

export const EditProvider = ({ children }: { children: ReactNode }) => {
  const [isEdit, setIsEdit] = React.useState(false);
  return (
    <EditContext.Provider value={{ isEdit, setEdit: setIsEdit }}>
      {children}
    </EditContext.Provider>
  );
};
