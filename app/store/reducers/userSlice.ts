import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// 定义用户状态接口
export interface UserState {
  isLoggedIn: boolean;
  twitter_full_profile: any | null;
}

export const initialState: UserState = {
  isLoggedIn: false,
  twitter_full_profile: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // 使用 PayloadAction 类型声明 `action.payload` 的内容
    updateIsLoggedIn: (state, action: PayloadAction<boolean>) => {
      if (action.payload) {
        state.isLoggedIn = action.payload;
      } else {
        state.isLoggedIn = false;
      }
    },
    updateTwitterFullProfile: (state, action: PayloadAction<any>) => {
      state.twitter_full_profile = {
        ...state.twitter_full_profile,
        ...action.payload,
      };

      console.log("action.payload", state.twitter_full_profile);
    },
  },
});

export const { updateIsLoggedIn, updateTwitterFullProfile } = userSlice.actions;

export default userSlice.reducer;
