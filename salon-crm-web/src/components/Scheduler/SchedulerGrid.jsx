import React from "react";
import { useSelector } from "react-redux";
import { mockData, generateTimeSlots } from "../../data/mockData";
import TimeSlotHeader from "./TimeSlotHeader";
import StylistRow from "./StylistRow";
import { STYLIST_COL_W, SLOT_W } from "./constants";
import { Colors } from "../../theme";

const { config, stylists } = mockData;
const slots  = generateTimeSlots(config.shopOpenTime, config.shopCloseTime, config.slotInterval);
const totalW = STYLIST_COL_W + slots.length * SLOT_W;

const SchedulerGrid = () => {
  const isOffline = useSelector((s) => s.offline.isOffline);

  return (
    <div
      style={{
        overflowX: "auto", overflowY: "auto",
        maxHeight: "calc(100vh - 230px)",
        border: `1px solid ${Colors.border}`,
        borderRadius: 12,
        background: Colors.white,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <div style={{ minWidth: totalW }}>
        <TimeSlotHeader slots={slots} />
        {stylists.map((stylist) => (
          <StylistRow key={stylist.id} stylist={stylist} slots={slots} isOffline={isOffline} />
        ))}
      </div>
    </div>
  );
};

export default SchedulerGrid;
