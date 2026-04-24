export const Colors = {
  primary:       '#6366F1',
  manager:       '#6366F1',
  receptionist:  '#F59E0B',
  stylist:       '#10B981',

  white:         '#FFFFFF',
  bgPage:        '#F8FAFC',
  bgMuted:       '#F3F4F6',
  bgSurface:     '#F9FAFB',

  border:        '#E5E7EB',
  borderLight:   '#F3F4F6',

  textPrimary:   '#111827',
  textSecondary: '#374151',
  textMuted:     '#6B7280',
  textFaint:     '#9CA3AF',

  confirmed:     { bg: '#D1FAE5', text: '#065F46' },
  pending:       { bg: '#FEF3C7', text: '#92400E' },
  cancelled:     { bg: '#FEE2E2', text: '#991B1B' },

  bannerInfoBg:     '#EEF2FF',
  bannerInfoBorder: '#C7D2FE',
  bannerInfoText:   '#3730A3',
  bannerWarnBg:     '#FFF7ED',
  bannerWarnBorder: '#FED7AA',

  slotConflictBg:     '#FEF2F2',
  slotConflictBorder: '#FCA5A5',
  slotConflictText:   '#DC2626',
  slotSelectedBg:     '#6366F1',

  confirmBtn:         '#6366F1',
  confirmBtnDisabled: '#E5E7EB',

  onlineBg:      '#ECFDF5',
  onlineBorder:  '#6EE7B7',
  onlineText:    '#065F46',
  offlineBg:     '#FFFBEB',
  offlineBorder: '#FCD34D',
  offlineText:   '#92400E',
};

export const FontSize = {
  xs:   9,
  sm:   10,
  base: 11,
  md:   12,
  lg:   13,
  xl:   14,
  xl2:  15,
  xl3:  16,
  xl4:  17,
};

export const Strings = {
  appName:              'SalonCRM',
  appSubtitle:          'Agenda View',
  roleSwitcherLabel:    'Switch Role',
  dateLabel:            'Friday, Apr 24 2026',
  scheduleSuffix:       "'s Schedule",
  appointmentSuffix:    ' appointment',
  appointmentSuffixP:   ' appointments',
  today:                ' today',
  bannerReadOnly:       '🔒 Read-only. Switch to Manager to reschedule.',
  bannerHoldHint:       'Hold any appointment card for 6 seconds to open the reschedule picker.',
  rescheduleTitle:      'Reschedule Appointment',
  selectSlot:           'Select a new time slot:',
  confirmReschedule:    'Confirm Reschedule',
  selectSlotPrompt:     'Select a time slot',
  conflict:             'Conflict',
  conflictTitle:        '⚠️ Booking Conflict',
  conflictMsg:          'This time slot overlaps with an existing appointment. Please choose a different time.',
  conflictMsgFull:      'This slot overlaps with another booking. Please choose a different time.',
  ok:                   'OK',
  syncing:              '⏳ Syncing…',
  dragHandle:           '⋮⋮',
  online:               'Online — all synced',
  offlineMode:          'Offline Mode',
  pending:              'pending',
  goOnline:             'Go Online',
  simulateOffline:      'Go Offline',
};

export const roleColor = (role) =>
  ({ manager: Colors.manager, receptionist: Colors.receptionist, stylist: Colors.stylist }[role] ?? '#6B7280');
