import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import dayjs from 'dayjs';
import styles from './index.module.scss';
import ActivityCard from '@/components/ActivityCard';
import FilterBar from '@/components/FilterBar';
import { useAppStore } from '@/store';
import { isDateInRange } from '@/utils/dateFilter';
import type { FilterOptions } from '@/types';

const CalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [filters, setFilters] = useState<FilterOptions>({
    city: '',
    date: '',
    dynasty: '',
    type: ''
  });

  const activities = useAppStore((s) => s.activities);

  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];

  const calendarDays = useMemo(() => {
    const year = currentDate.year();
    const month = currentDate.month();
    const firstDay = dayjs(`${year}-${month + 1}-01`);
    const lastDay = firstDay.endOf('month');
    const startDay = firstDay.subtract(firstDay.day(), 'day');
    const days = [];

    for (let i = 0; i < 42; i++) {
      const day = startDay.add(i, 'day');
      const hasActivity = activities.some(
        a => dayjs(a.date).format('YYYY-MM-DD') === day.format('YYYY-MM-DD')
      );
      days.push({
        date: day,
        isCurrentMonth: day.month() === month,
        isToday: day.format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD'),
        isSelected: day.format('YYYY-MM-DD') === selectedDate,
        hasActivity
      });
    }
    return days;
  }, [currentDate, selectedDate, activities]);

  const filteredActivities = useMemo(() => {
    let result = [...activities];

    if (filters.city) {
      result = result.filter(a => a.city === filters.city);
    }
    if (filters.dynasty) {
      result = result.filter(a => a.dynasty === filters.dynasty);
    }
    if (filters.type) {
      result = result.filter(a => a.type === filters.type);
    }
    if (filters.date) {
      result = result.filter(a => isDateInRange(a.date, filters.date));
    } else {
      result = result.filter(
        a => dayjs(a.date).format('YYYY-MM-DD') === selectedDate
      );
    }

    return result;
  }, [activities, filters, selectedDate]);

  const handlePrevMonth = () => {
    console.log('[CalendarPage] 上月');
    setCurrentDate(currentDate.subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    console.log('[CalendarPage] 下月');
    setCurrentDate(currentDate.add(1, 'month'));
  };

  const handleDateSelect = (date: dayjs.Dayjs) => {
    const dateStr = date.format('YYYY-MM-DD');
    console.log('[CalendarPage] 选择日期:', dateStr);
    setSelectedDate(dateStr);
  };

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.calendarCard}>
          <View className={styles.calendarHeader}>
            <View className={styles.navBtn} onClick={handlePrevMonth}>
              ‹
            </View>
            <Text className={styles.monthText}>
              {currentDate.format('YYYY年MM月')}
            </Text>
            <View className={styles.navBtn} onClick={handleNextMonth}>
              ›
            </View>
          </View>

          <View className={styles.weekdays}>
            {weekdays.map((day, index) => (
              <View
                key={index}
                className={`${styles.weekday} ${index === 0 || index === 6 ? styles.weekend : ''}`}
              >
                {day}
              </View>
            ))}
          </View>

          <View className={styles.daysGrid}>
            {calendarDays.map((day, index) => (
              <View
                key={index}
                className={`
                  ${styles.dayCell}
                  ${!day.isCurrentMonth ? styles.dayOtherMonth : ''}
                  ${day.isToday ? styles.dayToday : ''}
                  ${day.isSelected ? styles.daySelected : ''}
                  ${day.hasActivity && day.isCurrentMonth ? styles.dayHasActivity : ''}
                `}
                onClick={() => handleDateSelect(day.date)}
              >
                <Text className={styles.dayNumber}>
                  {day.date.date()}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.dateText}>
              {dayjs(selectedDate).format('MM月DD日')}
            </Text>
            {' '}活动
          </Text>
          <Text className={styles.activityCount}>
            共 {filteredActivities.length} 场
          </Text>
        </View>
      </View>

      <View className={styles.section}>
        <FilterBar
          filters={filters}
          onFilterChange={setFilters}
        />
      </View>

      <ScrollView
        scrollY
        className={styles.section}
        style={{ height: 'calc(100vh - 900rpx)' }}
      >
        {filteredActivities.length > 0 ? (
          filteredActivities.map(activity => (
            <ActivityCard key={activity.id} activity={activity} />
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📅</Text>
            <Text className={styles.emptyText}>
              {dayjs(selectedDate).format('MM月DD日')} 暂无活动
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default CalendarPage;
