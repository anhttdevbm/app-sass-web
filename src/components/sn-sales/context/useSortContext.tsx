import { Dispatch, SetStateAction, createContext, useState } from "react";

export interface SortContextProps {
  orderDirection: "asc" | "desc";
  setOrderDirection: Dispatch<SetStateAction<"asc" | "desc">>;
  orderBy: string | null;
  setOrderBy: Dispatch<SetStateAction<string | null>>;
}

export const sortContext = createContext<SortContextProps | null>({
  orderDirection: "asc",
  setOrderDirection: () => {
    return;
  },
  orderBy: null,
  setOrderBy: () => {
    return;
  },
});

const SortProvider = ({ children }) => {
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<string | null>(null);
  return (
    <sortContext.Provider
      value={{ setOrderBy, setOrderDirection, orderBy, orderDirection }}
    >
      {children}
    </sortContext.Provider>
  );
};

export default SortProvider;
