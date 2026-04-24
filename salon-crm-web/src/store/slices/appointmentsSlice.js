import { createSlice } from "@reduxjs/toolkit";
import { mockData, timeToMinutes, minutesToIso } from "../../data/mockData";

const overlap = (list, candidate) =>
  list.some((a) => {
    if (a.id === candidate.id || a.stylistId !== candidate.stylistId) return false;
    const aS = timeToMinutes(a.start);
    const aE = timeToMinutes(a.end);
    const cS = timeToMinutes(candidate.start);
    const cE = timeToMinutes(candidate.end);
    return cS < aE && cE > aS;
  });

const appointmentsSlice = createSlice({
  name: "appointments",
  initialState: {
    list: mockData.appointments,
    dragInfo: null,    
    lastRejected: null, 
  },
  reducers: {
    setDragInfo(state, { payload }) { state.dragInfo = payload; },
    clearDragInfo(state)            { state.dragInfo = null; state.lastRejected = null; },

    moveAppointment(state, { payload: { id, newStylistId, newStartMin } }) {
      const appt = state.list.find((a) => a.id === id);
      if (!appt) return;
      const dur  = timeToMinutes(appt.end) - timeToMinutes(appt.start);
      const candidate = {
        ...appt,
        stylistId: newStylistId,
        start:     minutesToIso(newStartMin),
        end:       minutesToIso(newStartMin + dur),
      };
      if (overlap(state.list, candidate)) {
        state.lastRejected = id;
        return;
      }
      state.list = state.list.map((a) => {
        if (a.id === id) {
          const { _pending, ...rest } = a;
          return { ...rest, stylistId: newStylistId, start: candidate.start, end: candidate.end };
        }
        return a;
      });
      state.dragInfo = null;
    },

    applyOptimisticMove(state, { payload: { id, newStylistId, newStartMin } }) {
      const appt = state.list.find((a) => a.id === id);
      if (!appt) return;
      const dur = timeToMinutes(appt.end) - timeToMinutes(appt.start);
      state.list = state.list.map((a) =>
        a.id === id
          ? { ...a, stylistId: newStylistId, start: minutesToIso(newStartMin), end: minutesToIso(newStartMin + dur), _pending: true }
          : a
      );
    },
    confirmPendingMove(state, { payload: id }) {
      state.list = state.list.map((a) => (a.id === id ? { ...a, _pending: false } : a));
    },
    revertMove(state, { payload: { id, origStylistId, origStart, origEnd } }) {
      state.list = state.list.map((a) =>
        a.id === id ? { ...a, stylistId: origStylistId, start: origStart, end: origEnd, _pending: false } : a
      );
    },
  },
});

export const { setDragInfo, clearDragInfo, moveAppointment, applyOptimisticMove, confirmPendingMove, revertMove } = appointmentsSlice.actions;
export default appointmentsSlice.reducer;
