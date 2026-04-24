import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { switchRole } from "./store/slices/userSlice";
import SchedulerGrid from "./components/Scheduler/SchedulerGrid";
import OfflineBar from "./components/OfflineBar";
import PermissionGate from "./components/PermissionGate";
import { Colors, FontSize, Strings, roleAccent } from "./theme";
import ManagerImg from "./assets/ManagerImg.jpg";
import ReceptionistImg from "./assets/ReceptionistImg.jpg";
import StylistImg from "./assets/StylistImg.jpg";
import SalonLogo from "./assets/SalonLogo.jpg";
import "./App.css";

const ROLES = [
  { key: "manager",      label: "Manager",     image: ManagerImg },
  { key: "receptionist", label: "Receptionist", image: ReceptionistImg },
  { key: "stylist",      label: "Stylist",      image: StylistImg },
];

const ALL_PERMS = ["appt.read","appt.move","appt.create","appt.delete","staff.read","staff.manage"];

const RoleSwitcher = () => {
  const dispatch = useDispatch();
  const { role } = useSelector((s) => s.user.currentUser);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ fontSize: FontSize.base, fontWeight: 700, color: Colors.textFaint, letterSpacing: "0.5px", marginRight: 2 }}>
        {Strings.roleLabel}
      </span>
      {ROLES.map((r) => {
        const accent = roleAccent(r.key);
        const active = role === r.key;
        return (
          <button
            key={r.key}
            onClick={() => dispatch(switchRole(r.key))}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "4px 12px 4px 4px", borderRadius: 20, fontSize: FontSize.md, fontWeight: 700,
              cursor: "pointer", border: "2px solid",
              borderColor: active ? accent : Colors.border,
              background:  active ? accent : Colors.white,
              color:       active ? Colors.white : Colors.textMuted,
              transition: "all 0.15s",
            }}
          >
            <img
              src={r.image}
              alt={r.label}
              style={{ width: 24, height: 24, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
            />
            {r.label}
          </button>
        );
      })}
    </div>
  );
};

const PermChips = () => {
  const perms = useSelector((s) => s.user.currentUser.permissions);
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
      {ALL_PERMS.map((p) => {
        const has = perms.includes(p);
        return (
          <span
            key={p}
            style={{
              fontSize: FontSize.sm, padding: "2px 8px", borderRadius: 10, fontWeight: 600,
              background: has ? Colors.confirmed.bg : Colors.cancelled.bg,
              color:      has ? Colors.confirmed.text : Colors.cancelled.text,
              border: `1px solid ${has ? "#6EE7B7" : "#FCA5A5"}`,
            }}
          >
            {has ? "✓" : "✗"} {p}
          </span>
        );
      })}
    </div>
  );
};

const App = () => {
  const user   = useSelector((s) => s.user.currentUser);
  const accent = roleAccent(user.role);
  const roleImg = { manager: ManagerImg, receptionist: ReceptionistImg, stylist: StylistImg }[user.role];

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="header-inner">
          <div className="logo">
            <img src={SalonLogo} alt="Salon Logo" className="logo-img" />
            <div>
              <div className="logo-name">{Strings.appName}</div>
              <div className="logo-sub">{Strings.appSubtitle}</div>
            </div>
          </div>

          <div style={{ flex: 1 }} />

          <div className="user-badge" style={{ background: `${accent}12`, border: `1px solid ${accent}30` }}>
            <img
              src={roleImg}
              alt={user.name}
              style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover", border: `2px solid ${accent}` }}
            />
            <div>
              <div className="user-name">{user.name}</div>
              <div className="user-role" style={{ color: accent }}>{user.role}</div>
            </div>
          </div>

          <RoleSwitcher />
        </div>
      </header>

      <main className="app-main">
        <div className="page-title-row">
          <div>
            <h1 className="page-title">{Strings.pageTitle}</h1>
            <p className="page-sub">{Strings.pageSubtitle}</p>
            <div style={{ marginTop: 8 }}>
              <PermChips />
            </div>
          </div>
        </div>

        <PermissionGate permission="appt.move">
          <div style={{ marginBottom: 14 }}>
            <OfflineBar />
          </div>
        </PermissionGate>

        <PermissionGate
          permission="appt.move"
          fallback={
            <div className="banner banner-warn">
              🔒 <strong>Read-only.</strong> Switch to <em>Manager</em> role to drag &amp; reschedule appointments.
            </div>
          }
        >
          <div className="banner banner-info">
            ✋ <strong>Drag &amp; Drop enabled.</strong> Drag any card to a new stylist / time slot. Overlapping drops will be <strong>rejected</strong> and snap back.
          </div>
        </PermissionGate>

        <SchedulerGrid />

        <div className="legend">
          <span className="legend-title">{Strings.legendTitle}</span>
          {[
            { label: Strings.legendConfirmed,   bg: Colors.confirmed.bg,  border: "#6EE7B7" },
            { label: Strings.legendPending,     bg: Colors.pending.bg,    border: "#FCD34D" },
            { label: Strings.legendSyncing,     bg: Colors.cancelled.bg,  border: "#FCA5A5" },
          ].map(({ label, bg, border }) => (
            <span key={label} className="legend-item">
              <span className="legend-dot" style={{ background: bg, border: `1px solid ${border}` }} />
              {label}
            </span>
          ))}
          <PermissionGate permission="appt.move">
            <span className="legend-item">
              <span className="legend-dot" style={{ background: "rgba(99,102,241,0.12)", border: "1px solid #818CF8" }} />
              {Strings.legendDropTarget}
            </span>
          </PermissionGate>
        </div>
      </main>
    </div>
  );
};

export default App;
