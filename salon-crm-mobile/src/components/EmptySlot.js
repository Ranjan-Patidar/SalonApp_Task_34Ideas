import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Colors, FontSize} from '../theme';

const EmptySlot = React.memo(({label}) => (
  <View style={styles.row}>
    <View style={styles.timeBadge}>
      <Text style={styles.timeText}>{label}</Text>
    </View>
    <View style={styles.content}>
      <Text style={styles.emptyText}>Available</Text>
    </View>
  </View>
));

EmptySlot.displayName = 'EmptySlot';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.bgSurface,
    backgroundColor: '#FAFAFA',
  },
  timeBadge: {
    width: 64,
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
    backgroundColor: Colors.bgMuted,
    borderRadius: 8,
    marginRight: 12,
  },
  timeText: {
    fontSize: FontSize.base,
    fontWeight: '600',
    color: Colors.textFaint,
  },
  content: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  emptyText: {
    fontSize: FontSize.lg,
    color: '#D1D5DB',
    fontStyle: 'italic',
  },
});

export default EmptySlot;
