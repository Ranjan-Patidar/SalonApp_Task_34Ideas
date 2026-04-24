import React, {useRef, useEffect, useState, useCallback} from 'react';
import {
  View, Text, Modal, Pressable, StyleSheet,
  Animated, Dimensions, ScrollView, Alert,
} from 'react-native';
import {useSelector} from 'react-redux';
import {generateTimeSlots, timeToMinutes, mockData} from '../data/mockData';
import {Colors, FontSize, Strings} from '../theme';

const {height: SCREEN_H} = Dimensions.get('window');
const SHEET_H = SCREEN_H * 0.62;
const slots   = generateTimeSlots(
  mockData.config.shopOpenTime,
  mockData.config.shopCloseTime,
  mockData.config.slotInterval,
);

const BottomSheet = ({visible, appointment, onClose, onConfirm}) => {
  const slideAnim            = useRef(new Animated.Value(SHEET_H)).current;
  const [selected, setSelected] = useState(null);
  const allAppts             = useSelector(s => s.appointments.list);

  useEffect(() => {
    if (visible) {
      setSelected(null);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        damping: 20,
        stiffness: 180,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SHEET_H,
        duration: 220,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  const isConflict = useCallback(
    slotMin => {
      if (!appointment) {return false;}
      const dur    = timeToMinutes(appointment.end) - timeToMinutes(appointment.start);
      const newEnd = slotMin + dur;
      return allAppts.some(a => {
        if (a.id === appointment.id || a.stylistId !== appointment.stylistId) {return false;}
        const aS = timeToMinutes(a.start);
        const aE = timeToMinutes(a.end);
        return slotMin < aE && newEnd > aS;
      });
    },
    [appointment, allAppts],
  );

  const handleConfirm = useCallback(() => {
    if (selected == null) {return;}
    if (isConflict(selected)) {
      Alert.alert(
        Strings.conflictTitle,
        Strings.conflictMsg,
        [{text: Strings.ok, style: 'cancel'}],
      );
      return;
    }
    onConfirm(selected);
  }, [selected, isConflict, onConfirm]);

  if (!appointment) {return null;}

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />

      <Animated.View style={[styles.sheet, {transform: [{translateY: slideAnim}]}]}>
        <View style={styles.handle} />

        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>{Strings.rescheduleTitle}</Text>
          <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={8}>
            <Text style={styles.closeIcon}>✕</Text>
          </Pressable>
        </View>

        <View style={[styles.apptCard, {borderLeftColor: appointment.color}]}>
          <Text style={[styles.apptClient, {color: appointment.color}]}>{appointment.clientName}</Text>
          <Text style={styles.apptService}>{appointment.service}</Text>
        </View>

        <Text style={styles.pickLabel}>{Strings.selectSlot}</Text>

        <ScrollView contentContainerStyle={styles.slotGrid} showsVerticalScrollIndicator={false}>
          {slots.map(slot => {
            const conflict = isConflict(slot.minutes);
            const isSel    = selected === slot.minutes;
            return (
              <Pressable
                key={slot.key}
                disabled={conflict}
                onPress={() => !conflict && setSelected(slot.minutes)}
                style={[
                  styles.slotBtn,
                  conflict && styles.slotConflict,
                  isSel    && styles.slotSelected,
                ]}
              >
                <Text style={[styles.slotLabel, conflict && styles.slotLabelConflict, isSel && styles.slotLabelSelected]}>
                  {slot.label}
                </Text>
                {conflict && <Text style={styles.conflictTag}>{Strings.conflict}</Text>}
              </Pressable>
            );
          })}
        </ScrollView>

        <Pressable
          onPress={handleConfirm}
          disabled={selected == null}
          style={[styles.confirmBtn, selected == null && styles.confirmBtnDisabled]}
        >
          <Text style={styles.confirmText}>
            {selected == null ? Strings.selectSlotPrompt : Strings.confirmReschedule}
          </Text>
        </Pressable>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SHEET_H,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 20,
    paddingBottom: 28,
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -4},
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  handle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sheetTitle: {fontSize: FontSize.xl4, fontWeight: '800', color: Colors.textPrimary},
  closeBtn:   {padding: 4},
  closeIcon:  {fontSize: FontSize.xl3, color: Colors.textMuted},

  apptCard: {
    borderLeftWidth: 4,
    paddingLeft: 12,
    paddingVertical: 10,
    backgroundColor: Colors.bgSurface,
    borderRadius: 8,
    marginBottom: 16,
  },
  apptClient:  {fontSize: FontSize.xl2, fontWeight: '700'},
  apptService: {fontSize: FontSize.lg,  color: Colors.textMuted, marginTop: 2},

  pickLabel: {fontSize: FontSize.lg, fontWeight: '600', color: Colors.textSecondary, marginBottom: 10},

  slotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingBottom: 12,
  },
  slotBtn: {
    width: '30%',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: Colors.bgMuted,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  slotSelected:      {backgroundColor: Colors.slotSelectedBg, borderColor: Colors.slotSelectedBg},
  slotConflict:      {backgroundColor: Colors.slotConflictBg,  borderColor: Colors.slotConflictBorder},

  slotLabel:         {fontSize: FontSize.lg, fontWeight: '600', color: Colors.textSecondary},
  slotLabelSelected: {color: Colors.white},
  slotLabelConflict: {color: Colors.slotConflictText},
  conflictTag:       {fontSize: FontSize.xs, color: Colors.slotConflictText, marginTop: 2, fontWeight: '700'},

  confirmBtn: {
    backgroundColor: Colors.confirmBtn,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
  },
  confirmBtnDisabled: {backgroundColor: Colors.confirmBtnDisabled},
  confirmText: {fontSize: FontSize.xl2, fontWeight: '700', color: Colors.white},
});

export default BottomSheet;
