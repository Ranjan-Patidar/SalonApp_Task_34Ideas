# SalonCRM Mobile — Senior Frontend Assessment (Track B)

React Native CLI application implementing the Salon CRM vertical agenda / timeline dashboard.

## How to Run

### Prerequisites
- Node.js 18+
- JDK 17+ (for Android)
- Android Studio + Android SDK / Xcode (for iOS)
- React Native CLI environment: https://reactnative.dev/docs/set-up-your-environment

```bash
cd salon-crm-mobile
npm install

# Android
npx react-native run-android

# iOS (macOS only)
cd ios && pod install && cd ..
npx react-native run-ios

# Metro bundler (separate terminal)
npx react-native start
```

## Features

### Track B — Vertical Agenda / Timeline (No external calendar libraries)
- **SectionList** with one section per stylist (sticky section headers)
- Each section shows **hourly time slots** (9 AM → 5 PM)
- Appointment slots show full card; empty slots show "Available" placeholder
- **Long-press** (600 ms) on any appointment → opens reschedule bottom sheet
- **Conflict detection** → `Alert.alert` fires if selected time overlaps existing booking
- **Animated bottom sheet** slides up via `Animated.spring`

### RBAC — Permission Gate System
```js
// No role-string checks anywhere:
<PermissionGate permission="appt.move">
  <RescheduleHandle />
</PermissionGate>
```
- `usePermission(perm)` — subscribes only to permissions array in Redux
- Switch roles live (Manager / Receptionist / Stylist)
- Drag hint and bottom sheet only appear for users with `appt.move`

### Offline Queue System (Advanced Challenge)
- "Simulate Offline / Go Online" toggle (manager only via PermissionGate)
- Offline move → **optimistic UI** (card updates immediately with ⏳ indicator)
- Queued in `offlineSlice.queue` as `{ type, payload, revert }`
- "Go Online" replays the queue against real state

### Performance — No unnecessary re-renders
- `AppointmentItem` wrapped in `React.memo`
- `EmptySlot` wrapped in `React.memo`
- `SectionHeader` wrapped in `React.memo`
- `sections` array memoized with `useMemo` — recomputes only when `allAppts` changes
- `renderItem`, `renderSectionHeader`, `keyExtractor` memoized with `useCallback`
- `useSelector` in `AgendaScreen` is scoped — no full-list subscriptions in leaf components

## Project Structure

```
src/
├── store/
│   ├── index.js
│   └── slices/
│       ├── userSlice.js          Role switching + permissions
│       ├── appointmentsSlice.js  CRUD, overlap guard, optimistic moves
│       └── offlineSlice.js       Offline toggle + pending queue
├── hooks/
│   └── usePermission.js          usePermission(perm)
├── components/
│   ├── PermissionGate.js         Generic RBAC wrapper
│   ├── AppointmentItem.js        Memoized card with long-press + Animated scale
│   ├── EmptySlot.js              Empty time slot placeholder
│   ├── BottomSheet.js            Slide-up modal with slot picker + conflict guard
│   ├── OfflineBar.js             Online/offline toggle + pending count
│   └── RoleSwitcher.js           Horizontal chip row to switch roles
├── screens/
│   └── AgendaScreen.js           Root screen: SectionList + sheet orchestration
└── data/
    └── mockData.js               Mock API, time generators, formatTime helpers
```

## RBAC Architecture

Permissions live as a string array on `currentUser.permissions` in Redux.
`PermissionGate` and `usePermission` subscribe **only** to that array —
no `if (role === 'manager')` exists anywhere in the UI.
Role switches propagate instantly to every gated component.
