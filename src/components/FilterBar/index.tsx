import React, { useState } from 'react';
import { View, Text, ScrollView, Picker } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import type { FilterOptions, ActivityType, DynastyStyle } from '@/types';
import { CITIES, ACTIVITY_TYPE_MAP, DYNASTY_MAP } from '@/types';

interface FilterBarProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  showType?: boolean;
  showDynasty?: boolean;
}

const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  showType = true,
  showDynasty = true
}) => {
  const [activeTab, setActiveTab] = useState<'city' | 'date' | 'dynasty' | 'type'>('city');

  const handleCityChange = (e: { detail: { value: string } }) => {
    const city = CITIES[Number(e.detail.value)] || '北京';
    console.log('[FilterBar] 选择城市:', city);
    onFilterChange({ ...filters, city });
  };

  const handleTypeSelect = (type: ActivityType | '') => {
    console.log('[FilterBar] 选择类型:', type);
    onFilterChange({ ...filters, type });
  };

  const handleDynastySelect = (dynasty: DynastyStyle | '') => {
    console.log('[FilterBar] 选择朝代:', dynasty);
    onFilterChange({ ...filters, dynasty });
  };

  const handleTabClick = (tab: 'city' | 'date' | 'dynasty' | 'type') => {
    setActiveTab(activeTab === tab ? 'city' : tab);
  };

  return (
    <View className={styles.container}>
      <View className={styles.tabs}>
        <View
          className={classnames(styles.tab, activeTab === 'city' && styles.active)}
          onClick={() => handleTabClick('city')}
        >
          <Text>{filters.city || '城市'}</Text>
        </View>
        <View
          className={classnames(styles.tab, activeTab === 'date' && styles.active)}
          onClick={() => handleTabClick('date')}
        >
          <Text>{filters.date || '日期'}</Text>
        </View>
        {showDynasty && (
          <View
            className={classnames(styles.tab, activeTab === 'dynasty' && styles.active)}
            onClick={() => handleTabClick('dynasty')}
          >
            <Text>{filters.dynasty ? DYNASTY_MAP[filters.dynasty] : '朝代'}</Text>
          </View>
        )}
        {showType && (
          <View
            className={classnames(styles.tab, activeTab === 'type' && styles.active)}
            onClick={() => handleTabClick('type')}
          >
            <Text>{filters.type ? ACTIVITY_TYPE_MAP[filters.type] : '类型'}</Text>
          </View>
        )}
      </View>

      {activeTab === 'city' && (
        <Picker
          mode="selector"
          range={CITIES}
          onChange={handleCityChange}
        >
          <View className={styles.pickerContent}>
            <Text className={styles.pickerHint}>点击选择城市</Text>
          </View>
        </Picker>
      )}

      {activeTab === 'date' && (
        <ScrollView scrollX className={styles.dateScroll}>
          {['今天', '明天', '周末', '本周', '全部'].map((item, index) => (
            <View
              key={index}
              className={classnames(
                styles.dateItem,
                filters.date === item && styles.dateItemActive
              )}
              onClick={() => {
                console.log('[FilterBar] 选择日期:', item);
                onFilterChange({ ...filters, date: item === '全部' ? '' : item });
              }}
            >
              {item}
            </View>
          ))}
        </ScrollView>
      )}

      {activeTab === 'dynasty' && showDynasty && (
        <View className={styles.options}>
          <View
            className={classnames(styles.option, !filters.dynasty && styles.optionActive)}
            onClick={() => handleDynastySelect('')}
          >
            全部
          </View>
          {Object.entries(DYNASTY_MAP).map(([key, value]) => (
            <View
              key={key}
              className={classnames(
                styles.option,
                filters.dynasty === key && styles.optionActive
              )}
              onClick={() => handleDynastySelect(key as DynastyStyle)}
            >
              {value}
            </View>
          ))}
        </View>
      )}

      {activeTab === 'type' && showType && (
        <View className={styles.options}>
          <View
            className={classnames(styles.option, !filters.type && styles.optionActive)}
            onClick={() => handleTypeSelect('')}
          >
            全部
          </View>
          {Object.entries(ACTIVITY_TYPE_MAP).map(([key, value]) => (
            <View
              key={key}
              className={classnames(
                styles.option,
                filters.type === key && styles.optionActive
              )}
              onClick={() => handleTypeSelect(key as ActivityType)}
            >
              {value}
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default FilterBar;
