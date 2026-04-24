# Salon CRM Application
A robust appointment scheduling application designed specifically for salon environments. This system features an interactive scheduler grid with drag-and-drop capabilities, offline-first interactions, and an advanced Role-Based Access Control (RBAC) system determining exactly what actions users can take based on their roles.

## Project Architecture
The application is built using modern frontend architecture utilizing a centralized state approach to ensure the UI stays synchronized seamlessly across components.

### Tech Stack
* **Framework:** React / Vite (Web) & React Native (Mobile)
* **State Management:** Redux Toolkit
* **Language:** JavaScript
* **Styling:** Vanilla CSS / Custom Theme Config (`theme.js`)
* 
### Directory Structure & Organization
* `src/components/`: Modular, reusable UI building blocks.
  * `Scheduler/`: Complex interactive grid components (`StylistRow`, `TimeSlotHeader`).
  * `AppointmentCard/`: Sub-components to compose dynamic appointment visuals.
  * `PermissionGate/`: Critical RBAC wrapper component.
* `src/store/slices/`: Segmented Redux logic.
  * `appointmentsSlice`: Manages appointment CRUD and resolving drag/drop conflicts logic.
  * `userSlice`: Stores the current authenticated user and their active role.
  * `offlineSlice`: Tracks network status and cues payload dispatches when offline.
* `src/hooks/`: Reusable logic pieces (e.g., `usePermission` hook for programmatic RBAC UI checks).
* `src/data/`: `mockData.js` simulating API responses containing seed tasks, user profiles, and role definitions.
* 
## How to Run the Web Project 
Follow these steps to run the application locally on your machine:
1. **Prerequisites**: Ensure you have Node.js (v16+ recommended) and `npm` installed.
2. **Install Dependencies**: Open the folder in your terminal and run:
   ```bash
   npm install
Start the Development Server: Wait for dependencies to finish, then execute:

 --->  npm run dev
 
- Access the App: Usually, Vite will serve the web application at http://localhost:5173.

## How to Run the Mobile App Project 
Follow these steps to run the application locally on your machine:
1. **Prerequisites**: Ensure you have Node.js (v16+ recommended) and `npm` installed.
2. **Install Dependencies**: Open the folder in your terminal and run:
   ```bash
   npm install
Start the Development Server: Wait for dependencies to finish, then execute:

  --->   npm run android

###################################################################################################################################################################
### Role-Based Access Control (RBAC) Architecture ###
To keep the application modular, secure, and extensible, we avoided hardcoding checks like if (user.role === 'manager') directly into the UI. Instead, we approached RBAC using Granular Action-Based Permissions.

1. Data-Level Role Mapping
Instead of relying on titles, every role is mapped to an exact list of actionable permissions via a central configuration matrix (e.g., appt.move, appt.create, staff.read). When a user switches roles, Redux automatically populates user.permissions with the corresponding security list.

2. The PermissionGate Component (UI Wrapper)
A centralized component was created to securely wrap parts of the screen. It reads the current Redux store and determines if a child component should be rendered.

Implementation: <PermissionGate permission="appt.move"> ... </PermissionGate>
If the user doesn't have the permission, the inner children are entirely stripped from the DOM. It also supports rendering a fallback UI, such as a "Read-only mode" banner when access is denied.

3. Programmatic Control (usePermission Hook)
Because not all UI states can be wrapped inside a DOM component, we exposed a custom React Hook usePermission("permission_name").

Implementation: This allows internal JS logic—like the drag-and-drop HTML5 event handlers (onDragStart, onDrop) inside the Scheduler grid—to halt their execution block and disable draggable visual styling directly if the user isn’t authorized.

Why This Approach?
-> Scalability: If the business decides a "Receptionist" should suddenly be allowed to move appointments, developers only need to add "appt.move" to the Receptionist's array in the configuration file. No UI code needs to be touched.
-> Security & Cleanliness: Avoids complex, deeply nested ternary operations in React (e.g., user === 'admin' || user === 'receptionist').
