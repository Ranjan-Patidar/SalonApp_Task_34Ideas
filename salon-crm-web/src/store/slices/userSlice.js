import { createSlice } from "@reduxjs/toolkit";
import { mockData } from "../../data/mockData";

const roleNames = {
  manager:      "Sarah (Manager)",
  receptionist: "Reena (Receptionist)",
  stylist:      "John (Stylist)",
};

const userSlice = createSlice({
  name: "user",
  initialState: { currentUser: mockData.currentUser },
  reducers: {
    switchRole(state, { payload: role }) {
      state.currentUser = {
        ...state.currentUser,
        role,
        name: roleNames[role] ?? role,
        permissions: mockData.roles[role]?.permissions ?? [],
      };
    },
  },
});

export const { switchRole } = userSlice.actions;
export default userSlice.reducer;
