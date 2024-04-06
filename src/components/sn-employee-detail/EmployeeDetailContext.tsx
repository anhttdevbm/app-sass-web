import { createContext } from "hooks/useNonOptionalContext";
import { UpdateUserInfoData } from "store/app/actions";
import { UserInfo } from "store/app/reducer";

export type EmployeeDetailContextType = {
  employee?: UserInfo;
  onGetProfile: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUpdateUserInfo: (data: UpdateUserInfoData) => Promise<any>;
}

export const EmployeeDetailContext = createContext<EmployeeDetailContextType>();