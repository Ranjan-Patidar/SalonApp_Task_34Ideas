import React, { memo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDragInfo, clearDragInfo, moveAppointment, applyOptimisticMove } from "../../store/slices/appointmentsSlice";
import { enqueue } from "../../store/slices/offlineSlice";
import { usePermission } from "../../hooks/usePermission";
import { timeToMinutes } from "../../data/mockData";
import { STYLIST_COL_W, SLOT_W, ROW_H } from "./constants";
import AppointmentCard from "../AppointmentCard";
import PermissionGate from "../PermissionGate";
import { Colors, FontSize } from "../../theme";

const StylistRow = memo(({ stylist, slots, isOffline }) => {
  const dispatch = useDispatch();
  const canMove  = usePermission("appt.move");
  const [dropSlot, setDropSlot] = useState(null);
  const lastRejected = useSelector((s) => s.appointments.lastRejected);

  const appointments = useSelector((s) =>
    s.appointments.list.filter((a) => a.stylistId === stylist.id)
  );

  const shopStart = slots[0]?.minutes ?? 540;
  const interval  = (slots[1]?.minutes ?? 570) - shopStart;

  const getStyle = useCallback((appt) => {
    const startMin  = timeToMinutes(appt.start);
    const dur       = timeToMinutes(appt.end) - startMin;
    const leftSlots = (startMin - shopStart) / interval;
    const spanSlots = dur / interval;
    return {
      position: "absolute",
      left:   leftSlots * SLOT_W + 2,
      width:  Math.max(spanSlots * SLOT_W - 4, 28),
      top: 4, bottom: 4,
      zIndex: 2,
      cursor: canMove ? "grab" : "default",
      transition: "opacity 0.15s",
    };
  }, [shopStart, interval, canMove]);

  const handleDragStart = useCallback((e, appt) => {
    if (!canMove) { e.preventDefault(); return; }
    e.dataTransfer.setData("apptId", appt.id);
    e.dataTransfer.effectAllowed = "move";
    dispatch(setDragInfo({ id: appt.id, origStylistId: appt.stylistId, origStart: appt.start, origEnd: appt.end }));
  }, [dispatch, canMove]);

  const handleDragEnd = useCallback(() => {
    dispatch(clearDragInfo());
    setDropSlot(null);
  }, [dispatch]);

  const handleDragOver = useCallback((e, slotMin) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDropSlot(slotMin);
  }, []);

  const handleDrop = useCallback((e, slotMin) => {
    e.preventDefault();
    setDropSlot(null);
    const apptId = e.dataTransfer.getData("apptId");
    if (!apptId) return;

    if (isOffline) {
      const appt = appointments.find((a) => a.id === apptId);
      dispatch(applyOptimisticMove({ id: apptId, newStylistId: stylist.id, newStartMin: slotMin }));
      dispatch(enqueue({
        qid:  Date.now(),
        type: "MOVE",
        payload: { id: apptId, newStylistId: stylist.id, newStartMin: slotMin },
        revert:  { id: apptId, origStylistId: appt?.stylistId, origStart: appt?.start, origEnd: appt?.end },
      }));
    } else {
      dispatch(moveAppointment({ id: apptId, newStylistId: stylist.id, newStartMin: slotMin }));
    }
  }, [dispatch, stylist.id, isOffline, appointments]);

  return (
    <div style={{ display: "flex", borderBottom: `1px solid ${Colors.borderLight}`, height: ROW_H, background: Colors.white }}>
      <div
        style={{
          minWidth: STYLIST_COL_W, width: STYLIST_COL_W,
          position: "sticky", left: 0, zIndex: 3,
          background: Colors.white, borderRight: `2px solid ${Colors.border}`,
          display: "flex", alignItems: "center", padding: "0 12px", gap: 8,
          boxShadow: "2px 0 4px rgba(0,0,0,0.04)",
        }}
      >
        <div
          style={{
            width: 34, height: 34, borderRadius: "50%",
            background: stylist.color,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: Colors.white, fontWeight: 700, fontSize: FontSize.md, flexShrink: 0,
          }}
        >
          {stylist.avatar}
        </div>
        <span style={{ fontSize: FontSize.lg, fontWeight: 600, color: Colors.textPrimary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {stylist.name}
        </span>
      </div>

      <div style={{ position: "relative", display: "flex", flex: 1 }}>
        {slots.map((slot, i) => (
          <div
            key={slot.key}
            onDragOver={(e) => handleDragOver(e, slot.minutes)}
            onDrop={(e) => handleDrop(e, slot.minutes)}
            onDragLeave={() => setDropSlot(null)}
            style={{
              minWidth: SLOT_W, width: SLOT_W, height: "100%",
              borderRight: i < slots.length - 1 ? `1px solid ${Colors.borderLight}` : "none",
              background: dropSlot === slot.minutes
                ? Colors.dropTarget
                : i % 2 === 0 ? "transparent" : "rgba(0,0,0,0.01)",
              transition: "background 0.1s",
            }}
          />
        ))}

        {appointments.map((appt) => (
          <div
            key={appt.id}
            draggable={canMove}
            onDragStart={(e) => handleDragStart(e, appt)}
            onDragEnd={handleDragEnd}
            className={lastRejected === appt.id ? "shake" : ""}
            style={{ ...getStyle(appt), opacity: appt._pending ? 0.6 : 1 }}
          >
            <AppointmentCard id={appt.id} isPending={appt._pending}>
              <AppointmentCard.Status />
              <AppointmentCard.Header />
              <AppointmentCard.Details />
              <PermissionGate permission="appt.move">
                <AppointmentCard.Actions />
              </PermissionGate>
            </AppointmentCard>
          </div>
        ))}
      </div>
    </div>
  );
});

StylistRow.displayName = "StylistRow";
export default StylistRow;
