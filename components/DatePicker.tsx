import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Text, Modal, Portal, Button} from 'react-native-paper';
import {ChevronLeft, ChevronRight} from 'lucide-react-native';

interface DatePickerProps {
  visible: boolean;
  onDismiss: () => void;
  value: Date;
  onChange: (date: Date) => void;
  minimumDate?: Date;
  maximumDate?: Date;
}

export default function DatePicker({
  visible,
  onDismiss,
  value,
  onChange,
  minimumDate,
  maximumDate,
}: DatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(
    new Date(value.getFullYear(), value.getMonth(), 1),
  );

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const isDateDisabled = (date: Date | null): boolean => {
    if (!date) return true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);

    if (minimumDate) {
      const minDate = new Date(minimumDate);
      minDate.setHours(0, 0, 0, 0);
      if (checkDate < minDate) return true;
    } else {
      if (checkDate < today) return true;
    }

    if (maximumDate) {
      const maxDate = new Date(maximumDate);
      maxDate.setHours(0, 0, 0, 0);
      if (checkDate > maxDate) return true;
    }

    return false;
  };

  const isDateSelected = (date: Date | null): boolean => {
    if (!date) return false;
    const selected = new Date(value);
    selected.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return selected.getTime() === checkDate.getTime();
  };

  const handleDateSelect = (date: Date | null) => {
    if (!date || isDateDisabled(date)) return;
    onChange(date);
  };

  const prevMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentMonth(newDate);
  };

  const nextMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentMonth(newDate);
  };

  const days = getDaysInMonth(currentMonth);
  const monthNames = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];
  const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={prevMonth} style={styles.navButton}>
              <ChevronLeft size={24} color="#000" />
            </TouchableOpacity>
            <Text variant="titleLarge" style={styles.monthYear}>
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </Text>
            <TouchableOpacity onPress={nextMonth} style={styles.navButton}>
              <ChevronRight size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <View style={styles.calendar}>
            <View style={styles.dayNamesRow}>
              {dayNames.map(day => (
                <View key={day} style={styles.dayNameCell}>
                  <Text variant="bodySmall" style={styles.dayName}>
                    {day}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.daysGrid}>
              {days.map((day, index) => {
                const disabled = isDateDisabled(day);
                const selected = isDateSelected(day);
                const isToday =
                  day &&
                  new Date().toDateString() === day.toDateString();

                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dayCell,
                      selected && styles.dayCellSelected,
                      disabled && styles.dayCellDisabled,
                    ]}
                    onPress={() => handleDateSelect(day)}
                    disabled={disabled}>
                    <Text
                      style={[
                        styles.dayText,
                        selected && styles.dayTextSelected,
                        disabled && styles.dayTextDisabled,
                        isToday && !selected && styles.dayTextToday,
                      ]}>
                      {day ? day.getDate() : ''}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <Button mode="contained" onPress={onDismiss} style={styles.doneButton}>
            Selesai
          </Button>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: '#ffffff',
    margin: 20,
    borderRadius: 16,
    padding: 0,
  },
  container: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  navButton: {
    padding: 8,
  },
  monthYear: {
    fontWeight: 'bold',
    color: '#1f2937',
  },
  calendar: {
    marginBottom: 20,
  },
  dayNamesRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dayNameCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  dayName: {
    fontWeight: '600',
    color: '#6b7280',
    fontSize: 12,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    margin: 2,
  },
  dayCellSelected: {
    backgroundColor: '#3b82f6',
  },
  dayCellDisabled: {
    opacity: 0.3,
  },
  dayText: {
    fontSize: 14,
    color: '#1f2937',
  },
  dayTextSelected: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  dayTextDisabled: {
    color: '#9ca3af',
  },
  dayTextToday: {
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  doneButton: {
    marginTop: 8,
  },
});

