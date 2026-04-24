import React from 'react';
import {View, Text, Pressable, StyleSheet, ScrollView, Image} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {switchRole} from '../store/slices/userSlice';
import {Colors, FontSize, Strings} from '../theme';

import ManagerImg     from '../assets/ManagerImg.jpg';
import ReceptionistImg from '../assets/ReceptionistImg.jpg';
import StylistImg     from '../assets/StylistImg.jpg';

const ROLES = [
  {key: 'manager',      label: 'Manager',     image: ManagerImg,      color: Colors.manager},
  {key: 'receptionist', label: 'Receptionist', image: ReceptionistImg, color: Colors.receptionist},
  {key: 'stylist',      label: 'Stylist',      image: StylistImg,      color: Colors.stylist},
];

const RoleSwitcher = () => {
  const dispatch = useDispatch();
  const {role}   = useSelector(s => s.user.currentUser);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{Strings.roleSwitcherLabel}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {ROLES.map(r => {
          const active = role === r.key;
          return (
            <Pressable
              key={r.key}
              onPress={() => dispatch(switchRole(r.key))}
              style={[styles.chip, active && {backgroundColor: r.color, borderColor: r.color}]}
            >
              <Image source={r.image} style={styles.roleImg} />
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{r.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {paddingHorizontal: 16, paddingBottom: 10},
  label:     {fontSize: FontSize.base, fontWeight: '700', color: Colors.textFaint, letterSpacing: 0.5, marginBottom: 6, textTransform: 'uppercase'},
  row:       {flexDirection: 'row', gap: 8},
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  roleImg:        {width: 24, height: 24, borderRadius: 12, objectFit: 'cover'},
  chipText:       {fontSize: FontSize.lg, fontWeight: '700', color: Colors.textMuted},
  chipTextActive: {color: Colors.white},
});

export default RoleSwitcher;
