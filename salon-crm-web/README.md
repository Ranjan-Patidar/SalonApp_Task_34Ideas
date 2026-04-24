# SalonCRM Web — Senior Frontend Assessment (Track A)

React + Vite application implementing the Salon CRM horizontal scheduler dashboard.

## How to Run

```bash
cd salon-crm-web
npm install
npm run dev        # http://localhost:5173
npm run build      # production build
```

## Features

### Track A — Horizontal Scheduler Grid (No external calendar libraries)
- **Y-Axis**: Stylist rows (John, Jane, Mike, Sara)
- **X-Axis**: 30-minute time slots from 9:00 AM → 5:00 PM
- Appointments rendered as **absolutely-positioned overlays** — width = duration × slot width
- **Drag & Drop** via native HTML5 Drag API (manager only, gated by PermissionGate)
- **Overlap validation** in Redux — drop rejected if slot occupied, card snaps back with shake animation
- Cross-stylist moves supported

### RBAC — Permission Gate System
```jsx
// No if (role === 'manager') anywhere in the UI:
<PermissionGate permission="appt.move">
  <DragHandle />
</PermissionGate>
```
- `usePermission(perm)` hook — subscribes only to permissions array
- `<PermissionGate permission="..." fallback={<DisabledState />}>`
- Switch roles live — UI reacts instantly (manager → stylist → receptionist)

### Compound Component Pattern — AppointmentCard
```jsx
<AppointmentCard id="a1">
  <AppointmentCard.Status />
  <AppointmentCard.Header />
  <AppointmentCard.Details />
  <PermissionGate permission="appt.move">
    <AppointmentCard.Actions />
  </PermissionGate>
</AppointmentCard>
```

### Offline Queue System (Advanced)
- "Simulate Offline" toggle (manager only)
- Moves made offline → **optimistic UI** + queued in Redux `offlineSlice`
- "Go Online & Sync" replays the queue against real backend state
- Optimistic cards pulse with CSS animation

### Performance — No unnecessary re-renders
- `StylistRow` wrapped in `React.memo` — updating John's appointment **does NOT re-render Jane's row**
- `useSelector` scoped per stylist: `list.filter(a => a.stylistId === stylist.id)`
- `useCallback` on all drag event handlers

## Project Structure

```
src/
├── store/
│   ├── index.js
│   └── slices/
│       ├── userSlice.js          Role switching + permissions
│       ├── appointmentsSlice.js  CRUD, drag state, overlap check, optimistic
│       └── offlineSlice.js       Offline toggle + pending queue
├── hooks/
│   └── usePermission.js          usePermission(perm) + usePermissionCheck()
├── components/
│   ├── PermissionGate/           Generic RBAC wrapper
│   ├── AppointmentCard/          Compound component (Header/Details/Status/Actions)
│   ├── Scheduler/
│   │   ├── constants.js          SLOT_W, ROW_H, STYLIST_COL_W
│   │   ├── TimeSlotHeader.jsx    Sticky top header row
│   │   ├── StylistRow.jsx        Memoized per-stylist row (D&D, overlays)
│   │   └── SchedulerGrid.jsx     Root grid component
│   └── OfflineBar/               Offline indicator + sync button
└── data/
    └── mockData.js               Mock API, time slot generators
```

## RBAC Architecture

Permissions live as a string array on `currentUser.permissions` in Redux.
Both `PermissionGate` and `usePermission` subscribe **only** to that array —
no role-string comparisons anywhere in the UI tree.
When the role switches, every gate re-renders reactively with zero boilerplate.
