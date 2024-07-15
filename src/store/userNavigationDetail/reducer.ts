import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";

interface UserNavigationDetailState {
  username: string;
  avatar: string;
  isOpen: boolean;
}

interface RootState {
  userNavigationDetail: UserNavigationDetailState;
}
const initialState: UserNavigationDetailState = {
  username: "",
  avatar: "",
  isOpen: false,
};

const userNavigationDetail = createSlice({
  name: "user-navigation-detail",
  initialState,
  reducers: {
    setUserName: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    setAvatar: (state, action: PayloadAction<string>) => {
      state.avatar = action.payload;
    },
    setIsOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
  },
});

export const { setUserName, setAvatar, setIsOpen } =
  userNavigationDetail.actions;

export default userNavigationDetail.reducer;
