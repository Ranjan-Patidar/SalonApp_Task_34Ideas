import React, { memo } from "react";
import { STYLIST_COL_W, SLOT_W } from "./constants";
import { Colors, FontSize, Strings } from "../../theme";

const TimeSlotHeader = memo(({ slots }) => (
  <div style={{ display: "flex", position: "sticky", top: 0, zIndex: 10, background: Colors.bgPage, borderBottom: `2px solid ${Colors.border}` }}>
    <div
      style={{
        minWidth: STYLIST_COL_W, width: STYLIST_COL_W,
        position: "sticky", left: 0, zIndex: 11,
        background: Colors.bgPage, borderRight: `2px solid ${Colors.border}`,
        display: "flex", alignItems: "center", padding: "10px 14px",
      }}
    >
      <span style={{ fontSize: FontSize.base, fontWeight: 700, color: Colors.textFaint, textTransform: "uppercase", letterSpacing: "0.6px" }}>
        {Strings.stylistHeader}
      </span>
    </div>
    {slots.map((slot, i) => {
      const isHour = slot.label.includes(":00 ");
      return (
        <div
          key={slot.key}
          style={{
            minWidth: SLOT_W, width: SLOT_W,
            padding: "10px 0", textAlign: "center",
            borderRight: i < slots.length - 1 ? `1px solid ${Colors.border}` : "none",
            background: isHour ? Colors.bgMuted : "transparent",
          }}
        >
          <span style={{ fontSize: FontSize.base, fontWeight: isHour ? 700 : 400, color: isHour ? Colors.textSecondary : Colors.textFaint, whiteSpace: "nowrap" }}>
            {slot.label}
          </span>
        </div>
      );
    })}
  </div>
));

TimeSlotHeader.displayName = "TimeSlotHeader";
export default TimeSlotHeader;
