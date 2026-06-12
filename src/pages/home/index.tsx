import React, { useState, useMemo } from 'react';
import { View, Text, Image, Swiper, SwiperItem, Input, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import ActivityCard from '@/components/ActivityCard';
import FilterBar from '@/components/FilterBar';
import SafetyReminder from '@/components/SafetyReminder';
import { mockActivities } from '@/data/activities';
import type { FilterOptions } from '@/types';
import { ACTIVITY_TYPE_MAP, DYNASTY_MAP } from '@/types';

const HomePage: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    city: '北京',
    date: '',
    dynasty: '',
    type: ''
  });

  const banners = useMemo(() => [
    {
      id: 1,
      title: '大唐芙蓉园汉服游园会',
      image: 'https://picsum.photos/id/1018/750/400'
    },
    {
      id: 2,
      title: '宋韵雅集 · 点茶体验',
      image: 'https://picsum.photos/id/1015/750/400'
    },
    {
      id: 3,
      title: '明制汉服婚礼秀',
      image: 'https://picsum.photos/id/1082/750/400'
    }
  ], []);

  const categories = useMemo(() => [
    { name: '茶会', icon: '🍵', color: 'red', type: 'tea' },
    { name: '游园', icon: '🌸', color: 'gold', type: 'garden' },
    { name: '妆造', icon: '💄', color: 'red', type: 'makeup' },
    { name: '市集', icon: '🏮', color: 'gold', type: 'market' },
    { name: '唐制', icon: '👘', color: 'red', dynasty: 'tang' },
    { name: '宋制', icon: '🎋', color: 'gold', dynasty: 'song' },
    { name: '明制', icon: '🎭', color: 'red', dynasty: 'ming' },
    { name: '更多', icon: '✨', color: 'gold', dynasty: '' }
  ], []);

  const filteredActivities = useMemo(() => {
    let result = [...mockActivities];

    if (filters.city) {
      result = result.filter(a => a.city === filters.city);
    }
    if (filters.dynasty) {
      result = result.filter(a => a.dynasty === filters.dynasty);
    }
    if (filters.type) {
      result = result.filter(a => a.type === filters.type);
    }
    if (searchText) {
      result = result.filter(a =>
        a.title.includes(searchText) ||
        a.description.includes(searchText)
      );
    }

    return result.slice(0, 5);
  }, [filters, searchText]);

  const handleCategoryClick = (category: { type?: string; dynasty?: string }) => {
    console.log('[HomePage] 点击分类:', category);
    if (category.type) {
      setFilters({ ...filters, type: category.type as FilterOptions['type'] });
    } else if (category.dynasty) {
      setFilters({ ...filters, dynasty: category.dynasty as FilterOptions['dynasty'] });
    } else {
      Taro.switchTab({ url: '/pages/calendar/index' });
    }
  };

  const handleSearch = (e: { detail: { value: string } }) => {
    setSearchText(e.detail.value);
    console.log('[HomePage] 搜索:', e.detail.value);
  };

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.location}>
          <Text className={styles.locationIcon}>📍</Text>
          <Text>{filters.city}</Text>
        </View>
        <View className={styles.searchBar}>
          <Text className={styles.searchIcon}>🔍</Text>
          <Input
            className={styles.searchInput}
            placeholder="搜索活动、同袍..."
            placeholderStyle="color: #999"
            value={searchText}
            onInput={handleSearch}
            confirmType="search"
          />
        </View>
      </View>

      <View className={styles.bannerSection}>
        <Swiper
          className={styles.banner}
          autoplay
          circular
          indicatorDots
          indicatorColor="rgba(255,255,255,0.5)"
          indicatorActiveColor="#fff"
        >
          {banners.map(banner => (
            <SwiperItem key={banner.id}>
              <Image
                className={styles.bannerImage}
                src={banner.image}
                mode="aspectFill"
                onError={(e) => console.error('[HomePage] Banner图片加载失败:', e.detail)}
              />
            </SwiperItem>
          ))}
        </Swiper>
      </View>

      <View className="container">
        <SafetyReminder />

        <View className={styles.categorySection}>
          <View className={styles.categoryGrid}>
            {categories.map((category, index) => (
              <View
                key={index}
                className={styles.categoryItem}
                onClick={() => handleCategoryClick(category)}
              >
                <View className={`${styles.categoryIcon} ${category.color === 'red' ? styles.categoryIconRed : styles.categoryIconGold}`}>
                  {category.icon}
                </View>
                <Text className={styles.categoryName}>{category.name}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>热门活动</Text>
            <Text
              className={styles.moreBtn}
              onClick={() => Taro.switchTab({ url: '/pages/calendar/index' })}
            >
              查看全部 →
            </Text>
          </View>
        </View>

        <FilterBar
          filters={filters}
          onFilterChange={setFilters}
        />

        <ScrollView
          scrollY
          className={styles.activityList}
          style={{ height: 'calc(100vh - 900rpx)' }}
        >
          {filteredActivities.length > 0 ? (
            filteredActivities.map(activity => (
              <ActivityCard key={activity.id} activity={activity} />
            ))
          ) : (
            <View className={styles.emptyState}>
              <Text className={styles.emptyIcon}>🎐</Text>
              <Text className={styles.emptyText}>暂无符合条件的活动</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default HomePage;
