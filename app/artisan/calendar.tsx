import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    FlatList,
} from "react-native";
import { THEME } from "../../constants/theme";

interface ScheduleItem {
  id: string;
  date: string;
  title: string;
  time: string;
  status: 'available' | 'booked' | 'blocked';
  clientName?: string;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function CalendarScreen() {
  const router = useRouter();
  const now = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(now.getFullYear(), now.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(now.getDate());
  const [schedules] = useState<ScheduleItem[]>([
    { id: '1', date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`, title: 'Plumbing Job', time: '10:00 AM', status: 'booked', clientName: 'John Doe' },
    { id: '2', date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate() + 1).padStart(2, '0')}`, title: 'Maintenance', time: '2:00 PM', status: 'booked', clientName: 'Jane Smith' },
  ]);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const calendarDays = [];
  const firstDay = getFirstDayOfMonth(currentDate);
  const daysInMonth = getDaysInMonth(currentDate);

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const toggleAvailability = () => {
    Alert.alert(
      'Toggle Availability',
      'Mark this day as available or blocked?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Mark Available', onPress: () => Alert.alert('Success', 'Marked as available') },
        { text: 'Block Day', onPress: () => Alert.alert('Success', 'Day blocked for bookings') },
      ]
    );
  };

  const todaySchedules = schedules.filter(s => 
    s.date === `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={THEME.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Calendar</Text>
        <TouchableOpacity onPress={toggleAvailability}>
          <Ionicons name="settings" size={24} color={THEME.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Month Navigation */}
        <View style={styles.monthHeader}>
          <TouchableOpacity onPress={handlePrevMonth} style={styles.navButton}>
            <Ionicons name="chevron-back" size={24} color={THEME.colors.primary} />
          </TouchableOpacity>
          <Text style={styles.monthTitle}>
            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
          </Text>
          <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
            <Ionicons name="chevron-forward" size={24} color={THEME.colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Calendar Grid */}
        <View style={styles.calendarContainer}>
          {/* Day Headers */}
          <View style={styles.dayHeaderRow}>
            {DAYS.map((day) => (
              <Text key={day} style={styles.dayHeader}>{day}</Text>
            ))}
          </View>

          {/* Calendar Days */}
          <View style={styles.calendarGrid}>
            {calendarDays.map((day, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayButton,
                  day === null && styles.emptyDay,
                  day === selectedDate && styles.selectedDay,
                  { borderColor: day === selectedDate ? THEME.colors.primary : THEME.colors.border }
                ]}
                onPress={() => day && setSelectedDate(day)}
              >
                {day && (
                  <Text style={[
                    styles.dayText,
                    day === selectedDate && styles.selectedDayText
                  ]}>
                    {day}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Schedule for Selected Date */}
        <View style={styles.scheduleSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {MONTHS[currentDate.getMonth()]} {selectedDate}, {currentDate.getFullYear()}
            </Text>
            <TouchableOpacity>
              <Ionicons name="add-circle" size={24} color={THEME.colors.primary} />
            </TouchableOpacity>
          </View>

          {todaySchedules.length > 0 ? (
            <FlatList
              scrollEnabled={false}
              data={todaySchedules}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={[
                  styles.scheduleCard,
                  item.status === 'booked' && styles.bookedCard,
                  item.status === 'available' && styles.availableCard,
                ]} >
                  <View style={styles.scheduleContent}>
                    <View style={[styles.statusBadge, { backgroundColor: 
                      item.status === 'booked' ? THEME.colors.primary :
                      item.status === 'available' ? THEME.colors.success : THEME.colors.warning
                    }]}>
                      <Text style={styles.statusText}>
                        {item.status === 'booked' ? 'Booked' : item.status === 'available' ? 'Free' : 'Blocked'}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.scheduleTitle}>{item.title}</Text>
                      {item.clientName && <Text style={styles.clientName}>{item.clientName}</Text>}
                    </View>
                    <Text style={styles.scheduleTime}>{item.time}</Text>
                  </View>
                </View>
              )}
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-clear-outline" size={48} color={THEME.colors.muted} />
              <Text style={styles.emptyText}>No schedule for this day</Text>
              <TouchableOpacity style={[styles.addButton, { backgroundColor: THEME.colors.primary }]}>
                <Text style={styles.addButtonText}>Add Schedule</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Jobs</Text>
            <Text style={styles.statValue}>{schedules.length}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Booked</Text>
            <Text style={styles.statValue}>{schedules.filter(s => s.status === 'booked').length}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Available</Text>
            <Text style={styles.statValue}>{schedules.filter(s => s.status === 'available').length}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.text,
    flex: 1,
    marginLeft: 8,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  navButton: {
    padding: 8,
  },
  monthTitle: {
    fontSize: 18,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.text,
  },
  calendarContainer: {
    backgroundColor: THEME.colors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  dayHeaderRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dayHeader: {
    flex: 1,
    textAlign: 'center',
    fontFamily: THEME.typography.fontFamily.subheading,
    fontSize: 12,
    color: THEME.colors.muted,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayButton: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.border,
    borderRadius: 8,
    marginBottom: 8,
  },
  emptyDay: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  selectedDay: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  dayText: {
    fontFamily: THEME.typography.fontFamily.body,
    color: THEME.colors.text,
    fontSize: 14,
  },
  selectedDayText: {
    color: THEME.colors.surface,
  },
  scheduleSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: THEME.typography.fontFamily.subheading,
    color: THEME.colors.text,
  },
  scheduleCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: THEME.colors.primary,
  },
  bookedCard: {
    borderLeftColor: THEME.colors.primary,
  },
  availableCard: {
    borderLeftColor: THEME.colors.success,
  },
  scheduleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 11,
    color: THEME.colors.surface,
    fontFamily: THEME.typography.fontFamily.body,
    fontWeight: '600',
  },
  scheduleTitle: {
    fontSize: 14,
    fontFamily: THEME.typography.fontFamily.subheading,
    color: THEME.colors.text,
    marginBottom: 2,
  },
  clientName: {
    fontSize: 12,
    color: THEME.colors.muted,
    fontFamily: THEME.typography.fontFamily.body,
  },
  scheduleTime: {
    fontSize: 13,
    color: THEME.colors.primary,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 14,
    color: THEME.colors.muted,
    fontFamily: THEME.typography.fontFamily.body,
    marginTop: 12,
    marginBottom: 16,
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: THEME.colors.surface,
    fontFamily: THEME.typography.fontFamily.subheading,
    fontSize: 13,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: THEME.colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: THEME.colors.muted,
    fontFamily: THEME.typography.fontFamily.body,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.primary,
  },
});
