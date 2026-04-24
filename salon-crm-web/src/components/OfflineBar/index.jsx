import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleOffline, clearQueue } from "../../store/slices/offlineSlice";
import { moveAppointment } from "../../store/slices/appointmentsSlice";
import { Colors, FontSize, Strings } from "../../theme";

const OfflineBar = () => {
  const dispatch = useDispatch();
  const { isOffline, queue } = useSelector((s) => s.offline);

  const handleToggle = () => {
    if (isOffline && queue.length > 0) {
      queue.forEach(({ type, payload }) => {
        if (type === "MOVE") dispatch(moveAppointment(payload));
      });
      dispatch(clearQueue());
    }
    dispatch(toggleOffline());
  };

  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "9px 16px", borderRadius: 10,
        border: `1px solid ${isOffline ? Colors.offlineBorder : Colors.onlineBorder}`,
        background: isOffline ? Colors.offlineBg : Colors.onlineBg,
        transition: "all 0.25s",
      }}
    >
      <span
        style={{
          width: 10, height: 10, borderRadius: "50%",
          background: isOffline ? Colors.receptionist : Colors.stylist,
          boxShadow: isOffline ? "0 0 0 3px #FDE68A" : "0 0 0 3px #A7F3D0",
          flexShrink: 0, display: "inline-block",
        }}
      />
      <span style={{ flex: 1, fontSize: FontSize.lg, fontWeight: 600, color: isOffline ? Colors.offlineText : Colors.onlineText }}>
        {isOffline
          ? <>
              {Strings.offlineMode}{" "}
              {queue.length > 0 && (
                <span style={{ marginLeft: 6, background: Colors.receptionist, color: Colors.white, fontSize: FontSize.base, padding: "1px 8px", borderRadius: 10 }}>
                  {queue.length} {Strings.pending}
                </span>
              )}
            </>
          : Strings.online
        }
      </span>
      <button
        onClick={handleToggle}
        style={{
          padding: "5px 16px", borderRadius: 8, border: "none",
          fontWeight: 700, fontSize: FontSize.md, cursor: "pointer",
          background: isOffline ? "#D97706" : "#059669",
          color: Colors.white, transition: "background 0.2s", whiteSpace: "nowrap",
        }}
      >
        {isOffline ? Strings.goOnline : Strings.simulateOffline}
      </button>
    </div>
  );
};

export default OfflineBar;
