import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { Group, Message } from "../../types";

interface GroupState {
  myGroups: Group[] ;
  publicGroups: Group[] ;
  selectedGroup: Group | null;
  messages: Message[];
  openDrawer: boolean;
}

// Define the initial state using that type
const initialState: GroupState = {
  myGroups: [],
  publicGroups: [],
  selectedGroup: null,
  messages: [],
  openDrawer: false,
};

export const groupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {
    setMyGroups: (state, action: PayloadAction<{ myGroups: Group[] }>) => {
      state.myGroups = action.payload.myGroups;
    },
    setPublicGroups: (state, action: PayloadAction<{ publicGroups: any }>) => {
      state.publicGroups = action.payload.publicGroups;
    },
    setSelectedGroup: (
      state,
      action: PayloadAction<{ selectedGroup: any }>
    ) => {
      state.selectedGroup = action.payload.selectedGroup;
    },
    setMessages: (state, action: PayloadAction<{ messages: any }>) => {
      state.messages = action.payload.messages;
    },
    updateMessages: (state, action: PayloadAction<{ messages: any[] }>) => {
      state.messages = [...(state.messages || []), ...action.payload.messages];
    },
    toggleOpenDrawer: (state) => {
      state.openDrawer = !state.openDrawer;
    },
    
  },
});

export const {
  setMyGroups,
  setPublicGroups,
  setSelectedGroup,
  setMessages,
  updateMessages,
  toggleOpenDrawer,
} = groupSlice.actions;

export default groupSlice.reducer;
