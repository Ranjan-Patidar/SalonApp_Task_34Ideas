import React, { createContext, useContext } from "react";
import { useSelector } from "react-redux";
import { Colors, FontSize } from "../../theme";

const Ctx = createContext(null);
const useCard = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("AppointmentCard sub-components require <AppointmentCard> parent");
  return ctx;
};

const AppointmentCard = ({ id, children, className = "", style = {}, isPending }) => {
  const appt = useSelector((s) => s.appointments.list.find((a) => a.id === id));
  if (!appt) return null;
  return (
    <Ctx.Provider value={{ appt }}>
      <div
        className={`appt-card ${isPending ? "appt-pending" : ""} ${className}`}
        style={{
          height: "100%",
          borderRadius: 7,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          padding: "5px 8px",
          background: `${appt.color ?? Colors.primary}1A`,
          borderLeft: `3px solid ${appt.color ?? Colors.primary}`,
          position: "relative",
          ...style,
        }}
      >
        {children}
      </div>
    </Ctx.Provider>
  );
};

AppointmentCard.Status = function Status() {
  const { appt } = useCard();
  const map = {
    confirmed: [Colors.confirmed.bg, Colors.confirmed.text],
    pending:   [Colors.pending.bg,   Colors.pending.text],
    cancelled: [Colors.cancelled.bg, Colors.cancelled.text],
    syncing:   [Colors.cancelled.bg, Colors.cancelled.text],
  };
  const statusStr = appt._pending ? "syncing" : appt.status;
  const [bg, fg] = map[statusStr] ?? [Colors.bgMuted, Colors.textSecondary];
  return (
    <span
      style={{
        display: "inline-block",
        alignSelf: "flex-start",
        fontSize: FontSize.xs,
        fontWeight: 700,
        borderRadius: 10,
        background: bg,
        color: fg,
        textTransform: "uppercase",
        letterSpacing: "0.4px",
        marginBottom: 1,
      }}
    >
      {statusStr}
    </span>
  );
};

AppointmentCard.Header = function Header() {
  const { appt } = useCard();
  return (
    <p
      style={{
        margin: 0,
        fontWeight: 700,
        fontSize: FontSize.base,
        color: appt.color ?? Colors.primary,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      {appt.clientName}
    </p>
  );
};

AppointmentCard.Details = function Details() {
  const { appt } = useCard();
  const s = new Date(appt.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const e = new Date(appt.end).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <p style={{ margin: 0, fontSize: FontSize.sm, color: Colors.textMuted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {appt.service}
      </p>
      <p style={{ margin: 0, fontSize: FontSize.xs, color: Colors.textFaint }}>
        {s}–{e}
      </p>
    </div>
  );
};

AppointmentCard.Actions = function Actions() {
  return (
    <div
      title="Drag to move"
      style={{
        position: "absolute",
        bottom: 3,
        right: 5,
        fontSize: FontSize.base,
        color: Colors.border,
        cursor: "grab",
        userSelect: "none",
        lineHeight: 1,
      }}
    >
      ⠿
    </div>
  );
};

export default AppointmentCard;
