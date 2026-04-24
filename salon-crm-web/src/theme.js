export const Colors = {
  primary: '#6366F1',
  primaryLight: '#818CF8',
  manager: '#6366F1',
  receptionist: '#F59E0B',
  stylist: '#10B981',

  confirmed: { bg: '#D1FAE5', text: '#065F46', border: '#6EE7B7' },
  pending: { bg: '#FEF3C7', text: '#92400E', border: '#FCD34D' },
  cancelled: { bg: '#FEE2E2', text: '#991B1B', border: '#FCA5A5' },

  white: '#FFFFFF',
  bgPage: '#F8FAFC',
  bgMuted: '#F3F4F6',
  bgSurface: '#F9FAFB',

  border: '#E5E7EB',
  borderLight: '#F3F4F6',

  textPrimary: '#111827',
  textSecondary: '#374151',
  textMuted: '#6B7280',
  textFaint: '#9CA3AF',

  bannerInfoBg: '#EEF2FF',
  bannerInfoBorder: '#C7D2FE',
  bannerInfoText: '#3730A3',
  bannerWarnBg: '#FFF7ED',
  bannerWarnBorder: '#FED7AA',
  bannerWarnText: '#C2410C',

  dropTarget: 'rgba(99,102,241,0.10)',
  onlineBg: '#ECFDF5',
  onlineBorder: '#6EE7B7',
  onlineText: '#065F46',
  offlineBg: '#FFFBEB',
  offlineBorder: '#FCD34D',
  offlineText: '#92400E',
};

export const FontSize = {
  xs: 9,
  sm: 10,
  base: 11,
  md: 12,
  lg: 13,
  xl: 14,
  xl2: 16,
  xl3: 22,
};

export const Strings = {
  appName: 'SalonCRM',
  appSubtitle: 'Appointment Scheduler',
  pageTitle: 'Appointment Scheduler',
  pageSubtitle: 'Friday, Apr 24, 2026 ',
  roleLabel: 'ROLE:',
  legendTitle: 'Legend',
  legendConfirmed: 'Confirmed',
  legendPending: 'Pending',
  legendSyncing: 'Syncing (offline)',
  legendDropTarget: 'Drop target',
  bannerReadOnly: '🔒 Read-only. Switch to Manager role to drag & reschedule appointments.',
  bannerDragEnabled: '✋ Drag & Drop enabled. Drag any card to a new stylist / time slot. Overlapping drops will be rejected and snap back.',
  online: 'Online — all changes synced',
  offlineMode: 'Offline Mode',
  pending: 'pending',
  goOnline: 'Go Online & Sync',
  simulateOffline: 'Simulate Offline',
  stylistHeader: 'Stylist',
};

export const roleAccent = (role) =>
  ({ manager: Colors.manager, receptionist: Colors.receptionist, stylist: Colors.stylist }[role] ?? Colors.primary);
