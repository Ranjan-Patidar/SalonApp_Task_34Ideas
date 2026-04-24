import { createSlice } from "@reduxjs/toolkit";

const offlineSlice = createSlice({
  name: "offline",
  initialState: { isOffline: false, queue: [] },
  reducers: {
    toggleOffline(state) { state.isOffline = !state.isOffline; },
    enqueue(state, { payload })  { state.queue.push(payload); },
    clearQueue(state)            { state.queue = []; },
  },
});

export const { toggleOffline, enqueue, clearQueue } = offlineSlice.actions;
export default offlineSlice.reducer;
