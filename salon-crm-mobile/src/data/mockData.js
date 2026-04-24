export const mockData = {
  currentUser: {
    id: 'u1',
    name: 'Sarah (Manager)',
    role: 'manager',
    permissions: ['appt.read', 'appt.move', 'appt.create', 'staff.read'],
  },
  config: {
    shopOpenTime: '09:00',
    shopCloseTime: '17:00',
    slotInterval: 60,
  },
  stylists: [
    { id: 's1', name: 'John Doe', color: '#6366F1', avatar: 'JD' },
    { id: 's2', name: 'Jane Smith', color: '#EC4899', avatar: 'JS' },
    { id: 's3', name: 'Mike Chen', color: '#F59E0B', avatar: 'MC' },
    { id: 's4', name: 'Sara Lee', color: '#10B981', avatar: 'SL' },
  ],
  appointments: [
    { id: 'a1', stylistId: 's1', clientName: 'Alice Johnson', service: 'Haircut & Style', start: '2023-10-27T09:00:00', end: '2023-10-27T10:00:00', status: 'confirmed' },
    { id: 'a2', stylistId: 's2', clientName: 'Bob Williams', service: 'Color Treatment', start: '2023-10-27T10:00:00', end: '2023-10-27T11:00:00', status: 'pending' },
    { id: 'a3', stylistId: 's1', clientName: 'Carol Davis', service: 'Blowout', start: '2023-10-27T11:00:00', end: '2023-10-27T12:00:00', status: 'confirmed' },
    { id: 'a4', stylistId: 's3', clientName: 'David Brown', service: 'Beard Trim', start: '2023-10-27T09:00:00', end: '2023-10-27T10:00:00', status: 'confirmed' },
    { id: 'a5', stylistId: 's2', clientName: 'Emma Wilson', service: 'Highlights', start: '2023-10-27T13:00:00', end: '2023-10-27T15:00:00', status: 'confirmed' },
    { id: 'a6', stylistId: 's4', clientName: 'Frank Moore', service: 'Shampoo & Set', start: '2023-10-27T14:00:00', end: '2023-10-27T15:00:00', status: 'pending' },
    { id: 'a7', stylistId: 's3', clientName: 'Grace Taylor', service: 'Keratin Treatment', start: '2023-10-27T12:00:00', end: '2023-10-27T14:00:00', status: 'confirmed' },
    { id: 'a8', stylistId: 's4', clientName: 'Henry Clark', service: "Men's Cut", start: '2023-10-27T10:00:00', end: '2023-10-27T11:00:00', status: 'confirmed' },
    { id: 'a9', stylistId: 's1', clientName: 'Iris Wang', service: 'Perms', start: '2023-10-27T13:00:00', end: '2023-10-27T15:00:00', status: 'pending' },
    { id: 'a10', stylistId: 's3', clientName: 'Jake Turner', service: 'Hair Colouring', start: '2023-10-27T15:00:00', end: '2023-10-27T16:00:00', status: 'confirmed' },
  ],
  roles: {
    manager: { permissions: ['appt.read', 'appt.move', 'appt.create', 'appt.delete', 'staff.read', 'staff.manage'] },
    receptionist: { permissions: ['appt.read', 'appt.create', 'staff.read'] },
    stylist: { permissions: ['appt.read', 'staff.read'] },
  },
};

export const generateTimeSlots = (openTime, closeTime, intervalMin) => {
  const slots = [];
  const [oh, om] = openTime.split(':').map(Number);
  const [ch, cm] = closeTime.split(':').map(Number);
  const start = oh * 60 + om;
  const end = ch * 60 + cm;
  for (let m = start; m < end; m += intervalMin) {
    const h = Math.floor(m / 60);
    const min = m % 60;
    const ampm = h >= 12 ? 'PM' : 'AM';
    const dh = h > 12 ? h - 12 : h === 0 ? 12 : h;
    slots.push({
      minutes: m,
      label: `${dh}:${min.toString().padStart(2, '0')} ${ampm}`,
      key: `${h}:${min.toString().padStart(2, '0')}`,
    });
  }
  return slots;
};

export const timeToMinutes = iso => {
  const d = new Date(iso);
  return d.getHours() * 60 + d.getMinutes();
};

export const minutesToIso = (minutes, base = '2023-10-27') => {
  const h = Math.floor(minutes / 60).toString().padStart(2, '0');
  const m = (minutes % 60).toString().padStart(2, '0');
  return `${base}T${h}:${m}:00`;
};

export const formatTime = iso =>
  new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
