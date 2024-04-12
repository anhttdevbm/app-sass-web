import { createContext, useContext } from "hooks/useNonOptionalContext";
import { UpdateUserInfoData } from "store/app/actions";
import { UserInfo } from "store/app/reducer";
import { EmployeeDetailPageProps } from ".";

export type EmployeeDetailContextType = EmployeeDetailPageProps & {
  employee: UserInfo;
  onGetProfile: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUpdateUserInfo: (data: UpdateUserInfoData) => Promise<any>;
}

const EmployeeDetailContext = createContext<EmployeeDetailContextType>();

export const useEmployeeDetailContext = () => useContext(EmployeeDetailContext);

export const EmployeeDetailContextProvider = EmployeeDetailContext.Provider;
