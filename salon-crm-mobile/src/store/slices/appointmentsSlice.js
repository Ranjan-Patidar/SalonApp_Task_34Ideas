import {createSlice} from '@reduxjs/toolkit';
import {mockData, timeToMinutes, minutesToIso} from '../../data/mockData';

const hasOverlap = (list, candidate) =>
  list.some(a => {
    if (a.id === candidate.id || a.stylistId !== candidate.stylistId) {return false;}
    const aS = timeToMinutes(a.start);
    const aE = timeToMinutes(a.end);
    const cS = timeToMinutes(candidate.start);
    const cE = timeToMinutes(candidate.end);
    return cS < aE && cE > aS;
  });

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState: {list: mockData.appointments},
  reducers: {
    moveAppointment(state, {payload: {id, newStylistId, newStartMin}}) {
      const appt = state.list.find(a => a.id === id);
      if (!appt) {return;}
      const dur = timeToMinutes(appt.end) - timeToMinutes(appt.start);
      const candidate = {
        ...appt,
        stylistId: newStylistId,
        start: minutesToIso(newStartMin),
        end:   minutesToIso(newStartMin + dur),
      };
      if (hasOverlap(state.list, candidate)) {
        // Signal conflict — caller should show Alert; we reject the move
        state.lastConflict = id;
        return;
      }
      state.lastConflict = null;
      state.list = state.list.map(a =>
        a.id === id
          ? {...a, stylistId: newStylistId, start: candidate.start, end: candidate.end, _pending: false}
          : a,
      );
    },

    // Optimistic update (offline queue)
    applyOptimisticMove(state, {payload: {id, newStylistId, newStartMin}}) {
      const appt = state.list.find(a => a.id === id);
      if (!appt) {return;}
      const dur = timeToMinutes(appt.end) - timeToMinutes(appt.start);
      state.list = state.list.map(a =>
        a.id === id
          ? {
              ...a,
              stylistId: newStylistId,
              start: minutesToIso(newStartMin),
              end:   minutesToIso(newStartMin + dur),
              _pending: true,
            }
          : a,
      );
    },

    confirmPending(state, {payload: id}) {
      state.list = state.list.map(a =>
        a.id === id ? {...a, _pending: false} : a,
      );
    },

    revertMove(state, {payload: {id, origStylistId, origStart, origEnd}}) {
      state.list = state.list.map(a =>
        a.id === id
          ? {...a, stylistId: origStylistId, start: origStart, end: origEnd, _pending: false}
          : a,
      );
    },

    clearConflict(state) {
      state.lastConflict = null;
    },
  },
});

export const {
  moveAppointment,
  applyOptimisticMove,
  confirmPending,
  revertMove,
  clearConflict,
} = appointmentsSlice.actions;
export default appointmentsSlice.reducer;
