/**
 * SalonCRM — React Native CLI
 * Senior Frontend Assessment: Track B (Mobile Agenda)
 *
 * Architecture:
 *  - Redux Toolkit for state (user, appointments, offline queue)
 *  - PermissionGate component for RBAC (no role-string checks in UI)
 *  - SectionList for the vertical agenda (custom, no calendar libraries)
 *  - Long-press → BottomSheet → reschedule with conflict Alert
 *  - Offline queue with optimistic UI
 */

import React from 'react';
import {Provider} from 'react-redux';
import {store} from './src/store';
import AgendaScreen from './src/screens/AgendaScreen';

const App = () => (
  <Provider store={store}>
    <AgendaScreen />
  </Provider>
);

export default App;
