import React, {useRef, useCallback} from 'react';
import {View, Text, StyleSheet, Pressable, Animated} from 'react-native';
import {usePermission} from '../hooks/usePermission';
import {formatTime} from '../data/mockData';
import PermissionGate from './PermissionGate';
import {Colors, FontSize, Strings} from '../theme';

const STATUS_COLORS = {
  confirmed: {bg: Colors.confirmed.bg, text: Colors.confirmed.text},
  pending:   {bg: Colors.pending.bg,   text: Colors.pending.text},
  cancelled: {bg: Colors.cancelled.bg, text: Colors.cancelled.text},
};

const AppointmentItem = React.memo(({appointment, onLongPress}) => {
  const canMove    = usePermission('appt.move');
  const scaleAnim  = useRef(new Animated.Value(1)).current;
  const pressTimer = useRef(null);

  const statusStyle = STATUS_COLORS[appointment.status] ?? {bg: Colors.bgMuted, text: Colors.textSecondary};
  const startLabel  = formatTime(appointment.start);
  const endLabel    = formatTime(appointment.end);

  const handlePressIn = useCallback(() => {
    Animated.spring(scaleAnim, {toValue: 0.97, useNativeDriver: true, speed: 40}).start();
    if (canMove) {
      pressTimer.current = setTimeout(() => onLongPress(appointment), 600);
    }
  }, [canMove, appointment, onLongPress, scaleAnim]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleAnim, {toValue: 1, useNativeDriver: true, speed: 40}).start();
    clearTimeout(pressTimer.current);
  }, [scaleAnim]);

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} onLongPress={() => canMove && onLongPress(appointment)} delayLongPress={600}>
      <Animated.View style={[styles.row, {borderLeftColor: appointment.color, transform: [{scale: scaleAnim}], opacity: appointment._pending ? 0.65 : 1}]}>
        <View style={[styles.timeBadge, {backgroundColor: `${appointment.color}18`}]}>
          <Text style={[styles.timeFrom, {color: appointment.color}]}>{startLabel}</Text>
          <Text style={styles.timeSep}>↓</Text>
          <Text style={[styles.timeTo, {color: appointment.color}]}>{endLabel}</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.topRow}>
            <Text style={styles.clientName} numberOfLines={1}>{appointment.clientName}</Text>
            <View style={[styles.statusBadge, {backgroundColor: statusStyle.bg}]}>
              <Text style={[styles.statusText, {color: statusStyle.text}]}>{appointment.status}</Text>
            </View>
          </View>
          <Text style={styles.service} numberOfLines={1}>{appointment.service}</Text>

          {appointment._pending && (
            <Text style={styles.pendingLabel}>{Strings.syncing}</Text>
          )}
        </View>

        <PermissionGate permission="appt.move">
          <Text style={styles.gripIcon}>{Strings.dragHandle}</Text>
        </PermissionGate>
      </Animated.View>
    </Pressable>
  );
});

AppointmentItem.displayName = 'AppointmentItem';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    borderLeftWidth: 4,
    backgroundColor: Colors.white,
    gap: 12,
  },
  timeBadge: {
    width: 64,
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: 10,
    flexShrink: 0,
  },
  timeFrom: {fontSize: FontSize.base, fontWeight: '800'},
  timeSep:  {fontSize: FontSize.sm,   color: Colors.border, marginVertical: 1},
  timeTo:   {fontSize: FontSize.sm,   fontWeight: '600', opacity: 0.75},
  content:  {flex: 1},
  topRow:   {flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3, flexWrap: 'wrap'},
  clientName:  {fontSize: FontSize.xl,  fontWeight: '700', color: Colors.textPrimary, flex: 1},
  statusBadge: {paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10},
  statusText:  {fontSize: FontSize.xs,  fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.4},
  service:     {fontSize: FontSize.md,  color: Colors.textMuted},
  pendingLabel:{fontSize: FontSize.base, color: '#D97706', marginTop: 3, fontStyle: 'italic'},
  gripIcon:    {fontSize: 18, color: Colors.border, paddingLeft: 4},
});

export default AppointmentItem;
