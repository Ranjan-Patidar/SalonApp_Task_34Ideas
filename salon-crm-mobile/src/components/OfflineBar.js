import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { toggleOffline, clearQueue } from '../store/slices/offlineSlice';
import { moveAppointment } from '../store/slices/appointmentsSlice';
import { Colors, FontSize, Strings } from '../theme';

const OfflineBar = () => {
  const dispatch = useDispatch();
  const { isOffline, queue } = useSelector(s => s.offline);

  const handleToggle = () => {
    if (isOffline && queue.length > 0) {
      queue.forEach(({ type, payload }) => {
        if (type === 'MOVE') {
          dispatch(moveAppointment(payload));
        }
      });
      dispatch(clearQueue());
    }
    dispatch(toggleOffline());
  };

  return (
    <View
      style={[styles.bar, isOffline ? styles.barOffline : styles.barOnline]}
    >
      <View
        style={[styles.dot, isOffline ? styles.dotOffline : styles.dotOnline]}
      />
      <Text
        style={[
          styles.label,
          isOffline ? styles.labelOffline : styles.labelOnline,
        ]}
        numberOfLines={1}
      >
        {isOffline
          ? `${Strings.offlineMode}${
              queue.length > 0 ? ` · ${queue.length} ${Strings.pending}` : ''
            }`
          : Strings.online}
      </Text>
      <Pressable
        onPress={handleToggle}
        style={[styles.btn, isOffline ? styles.btnOffline : styles.btnOnline]}
      >
        <Text style={styles.btnText}>
          {isOffline ? Strings.goOnline : Strings.simulateOffline}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
    gap: 10,
  },
  barOnline: {
    backgroundColor: Colors.onlineBg,
    borderWidth: 1,
    borderColor: Colors.onlineBorder,
  },
  barOffline: {
    backgroundColor: Colors.offlineBg,
    borderWidth: 1,
    borderColor: Colors.offlineBorder,
  },
  dot: { width: 10, height: 10, borderRadius: 5 },
  dotOnline: { backgroundColor: Colors.stylist },
  dotOffline: { backgroundColor: Colors.receptionist },
  label: { flex: 1, fontSize: FontSize.lg, fontWeight: '600' },
  labelOnline: { color: Colors.onlineText },
  labelOffline: { color: Colors.offlineText },
  btn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8 },
  btnOnline: { backgroundColor: '#059669' },
  btnOffline: { backgroundColor: '#D97706' },
  btnText: { color: Colors.white, fontSize: FontSize.md, fontWeight: '700' },
});

export default OfflineBar;
