import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  Alert,
  StatusBar,
  SafeAreaView,
  Image,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
  moveAppointment,
  applyOptimisticMove,
} from '../store/slices/appointmentsSlice';
import { enqueue } from '../store/slices/offlineSlice';
import { mockData, generateTimeSlots, timeToMinutes } from '../data/mockData';
import AppointmentItem from '../components/AppointmentItem';
import EmptySlot from '../components/EmptySlot';
import BottomSheet from '../components/BottomSheet';
import OfflineBar from '../components/OfflineBar';
import RoleSwitcher from '../components/RoleSwitcher';
import PermissionGate from '../components/PermissionGate';
import { Colors, FontSize, Strings, roleColor } from '../theme';

import SalonLogo from '../assets/SalonLogo.jpg';

const { config, stylists } = mockData;
const TIME_SLOTS = generateTimeSlots(
  config.shopOpenTime,
  config.shopCloseTime,
  config.slotInterval,
);

const SectionHeader = React.memo(({ stylist, apptCount }) => (
  <View style={[styles.sectionHeader, { borderLeftColor: stylist.color }]}>
    <View style={[styles.avatar, { backgroundColor: stylist.color }]}>
      <Text style={styles.avatarText}>{stylist.avatar}</Text>
    </View>
    <View>
      <Text style={styles.sectionName}>{stylist.name}{Strings.scheduleSuffix}</Text>
      <Text style={styles.sectionSub}>
        {apptCount}{apptCount !== 1 ? Strings.appointmentSuffixP : Strings.appointmentSuffix}{Strings.today}
      </Text>
    </View>
    <View style={[styles.colorDot, { backgroundColor: stylist.color }]} />
  </View>
));
SectionHeader.displayName = 'SectionHeader';

const AgendaScreen = () => {
  const dispatch   = useDispatch();
  const allAppts   = useSelector(s => s.appointments.list);
  const isOffline  = useSelector(s => s.offline.isOffline);
  const { currentUser } = useSelector(s => s.user);

  const [sheetAppt, setSheetAppt] = useState(null);

  const handleLongPress = useCallback(appt => {
    setSheetAppt(appt);
  }, []);

  const handleSheetClose = useCallback(() => setSheetAppt(null), []);

  const handleConfirm = useCallback(
    newStartMin => {
      if (!sheetAppt) {
        return;
      }

      const dur    = timeToMinutes(sheetAppt.end) - timeToMinutes(sheetAppt.start);
      const newEnd = newStartMin + dur;
      const conflict = allAppts.some(a => {
        if (a.id === sheetAppt.id || a.stylistId !== sheetAppt.stylistId) {
          return false;
        }
        const aS = timeToMinutes(a.start);
        const aE = timeToMinutes(a.end);
        return newStartMin < aE && newEnd > aS;
      });

      if (conflict) {
        Alert.alert(
          Strings.conflictTitle,
          `${Strings.conflictMsgFull} (${sheetAppt.clientName})`,
          [{ text: Strings.ok, style: 'cancel' }],
        );
        return;
      }

      setSheetAppt(null);

      if (isOffline) {
        dispatch(
          applyOptimisticMove({
            id: sheetAppt.id,
            newStylistId: sheetAppt.stylistId,
            newStartMin,
          }),
        );
        dispatch(
          enqueue({
            type: 'MOVE',
            payload: {
              id: sheetAppt.id,
              newStylistId: sheetAppt.stylistId,
              newStartMin,
            },
            revert: {
              id: sheetAppt.id,
              origStylistId: sheetAppt.stylistId,
              origStart: sheetAppt.start,
              origEnd: sheetAppt.end,
            },
          }),
        );
      } else {
        dispatch(
          moveAppointment({
            id: sheetAppt.id,
            newStylistId: sheetAppt.stylistId,
            newStartMin,
          }),
        );
      }
    },
    [sheetAppt, allAppts, isOffline, dispatch],
  );

  const sections = useMemo(
    () =>
      stylists.map(stylist => {
        const stylistAppts = allAppts.filter(a => a.stylistId === stylist.id);

        const data = TIME_SLOTS.map(slot => {
          const appt = stylistAppts.find(a => {
            const aStart = timeToMinutes(a.start);
            return (
              aStart >= slot.minutes &&
              aStart < slot.minutes + config.slotInterval
            );
          });
          return {
            id: appt ? appt.id : `${stylist.id}-empty-${slot.key}`,
            slot,
            appt: appt ?? null,
          };
        });

        return {
          key: stylist.id,
          stylist,
          apptCount: stylistAppts.length,
          data,
        };
      }),
    [allAppts],
  );

  const renderItem = useCallback(
    ({ item }) =>
      item.appt ? (
        <AppointmentItem
          appointment={item.appt}
          onLongPress={handleLongPress}
        />
      ) : (
        <EmptySlot label={item.slot.label} />
      ),
    [handleLongPress],
  );

  const renderSectionHeader = useCallback(
    ({ section }) => (
      <SectionHeader stylist={section.stylist} apptCount={section.apptCount} />
    ),
    [],
  );

  const keyExtractor = useCallback(item => item.id, []);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <View style={styles.appHeader}>
        <View style={styles.logoRow}>
          <Image source={SalonLogo} style={styles.logoImg} />
          <View>
            <Text style={styles.logoName}>{Strings.appName}</Text>
            <Text style={styles.logoSub}>{Strings.appSubtitle}</Text>
          </View>
        </View>
        <View style={styles.userBadge}>
          <View style={[styles.userAvatar, { backgroundColor: roleColor(currentUser.role) }]}>
            <Text style={styles.userAvatarText}>{currentUser.name[0]}</Text>
          </View>
          <View>
            <Text style={styles.userName} numberOfLines={1}>
              {currentUser.name}
            </Text>
            <Text style={[styles.userRole, { color: roleColor(currentUser.role) }]}>
              {currentUser.role}
            </Text>
          </View>
        </View>
      </View>

      <RoleSwitcher />

      <PermissionGate permission="appt.move">
        <View style={styles.offlineWrapper}>
          <OfflineBar />
        </View>
      </PermissionGate>

      <PermissionGate
        permission="appt.move"
        fallback={
          <View style={styles.bannerWarn}>
            <Text style={styles.bannerText}>{Strings.bannerReadOnly}</Text>
          </View>
        }
      >
        <View style={styles.bannerInfo}>
          <Text style={styles.bannerText}>{Strings.bannerHoldHint}</Text>
        </View>
      </PermissionGate>

      <View style={styles.dateStrip}>
        <Text style={styles.dateText}>{Strings.dateLabel}</Text>
        <Text style={styles.apptCount}>{allAppts.length} appointments</Text>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        stickySectionHeadersEnabled={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        SectionSeparatorComponent={() => <View style={styles.sectionSep} />}
      />

      <BottomSheet
        visible={sheetAppt != null}
        appointment={sheetAppt}
        onClose={handleSheetClose}
        onConfirm={handleConfirm}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, marginTop: 30, backgroundColor: Colors.bgPage },

  appHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginHorizontal: 10,
    marginVertical:20,
    borderRadius:10,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoImg: { width: 36, height: 36, borderRadius: 9 },
  logoName: {
    fontSize: FontSize.xl3,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  logoSub: { fontSize: FontSize.sm, color: Colors.textFaint },
  userBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    maxWidth: '45%',
  },
  userAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarText: { fontSize: FontSize.md, fontWeight: '700', color: Colors.white },
  userName: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary },
  userRole: { fontSize: FontSize.sm, fontWeight: '600', textTransform: 'capitalize' },

  offlineWrapper: { paddingHorizontal: 12, paddingTop: 10 },

  bannerInfo: {
    marginHorizontal: 12,
    marginTop: 8,
    backgroundColor: Colors.bannerInfoBg,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.bannerInfoBorder,
  },
  bannerWarn: {
    marginHorizontal: 12,
    marginTop: 8,
    backgroundColor: Colors.bannerWarnBg,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.bannerWarnBorder,
  },
  bannerText: { fontSize: FontSize.lg, color: Colors.bannerInfoText },

  dateStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginTop: 8,
  },
  dateText:  { fontSize: FontSize.xl, fontWeight: '700', color: Colors.textPrimary },
  apptCount: { fontSize: FontSize.md, color: Colors.textFaint },

  listContent: { paddingBottom: 40 },
  sectionSep: { height: 10, backgroundColor: Colors.bgMuted },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: Colors.bgSurface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    borderLeftWidth: 5,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText:   { fontSize: FontSize.xl, fontWeight: '800', color: Colors.white },
  sectionName:  { fontSize: FontSize.xl2, fontWeight: '700', color: Colors.textPrimary },
  sectionSub:   { fontSize: FontSize.md, color: Colors.textFaint, marginTop: 1 },
  colorDot:     { width: 8, height: 8, borderRadius: 4, marginLeft: 'auto' },
});

export default AgendaScreen;
