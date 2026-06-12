import React, { useState, useMemo } from 'react';
import { View, Text, Input, ScrollView } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import UserCard from '@/components/UserCard';
import SafetyReminder from '@/components/SafetyReminder';
import { useAppStore } from '@/store';
import type { DynastyStyle } from '@/types';
import { DYNASTY_MAP } from '@/types';

const CommunityPage: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedGender, setSelectedGender] = useState<'all' | 'male' | 'female'>('all');
  const [selectedStyle, setSelectedStyle] = useState<DynastyStyle | ''>('');
  const [selectedCity, setSelectedCity] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'rating'>('rating');

  const users = useAppStore((s) => s.users);
  const isUserBlocked = useAppStore((s) => s.isUserBlocked);

  const filteredUsers = useMemo(() => {
    let result = [...users].filter((u) => !isUserBlocked(u.id));

    if (selectedGender !== 'all') {
      result = result.filter(u => u.gender === selectedGender);
    }
    if (selectedStyle) {
      result = result.filter(u => u.usualStyle.includes(selectedStyle));
    }
    if (selectedCity) {
      result = result.filter(u => u.city === selectedCity);
    }
    if (searchText) {
      result = result.filter(u =>
        u.nickname.includes(searchText) ||
        u.bio.includes(searchText)
      );
    }

    if (sortBy === 'rating') {
      result.sort((a, b) => {
        const ratingA = a.reviews.length > 0
          ? a.reviews.reduce((sum, r) => sum + r.rating, 0) / a.reviews.length
          : 0;
        const ratingB = b.reviews.length > 0
          ? b.reviews.reduce((sum, r) => sum + r.rating, 0) / b.reviews.length
          : 0;
        return ratingB - ratingA;
      });
    }

    return result;
  }, [users, isUserBlocked, selectedGender, selectedStyle, selectedCity, searchText, sortBy]);

  const handleSearch = (e: { detail: { value: string } }) => {
    setSearchText(e.detail.value);
    console.log('[CommunityPage] 搜索:', e.detail.value);
  };

  const genderTabs = [
    { key: 'all', label: '全部' },
    { key: 'female', label: '女生' },
    { key: 'male', label: '男生' }
  ];

  const stylesList = [
    { key: '', label: '全部' },
    ...Object.entries(DYNASTY_MAP).map(([key, value]) => ({ key, label: value }))
  ];

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>同袍名片</Text>
        <Text className={styles.headerDesc}>认识志同道合的汉服爱好者</Text>
        <View className={styles.searchBar}>
          <Text className={styles.searchIcon}>🔍</Text>
          <Input
            className={styles.searchInput}
            placeholder="搜索同袍昵称..."
            placeholderStyle="color: #999"
            value={searchText}
            onInput={handleSearch}
            confirmType="search"
          />
        </View>
      </View>

      <View className={styles.filterSection}>
        <View className={styles.filterTabs}>
          {genderTabs.map(tab => (
            <View
              key={tab.key}
              className={classnames(styles.filterTab, selectedGender === tab.key && styles.active)}
              onClick={() => {
                console.log('[CommunityPage] 选择性别:', tab.key);
                setSelectedGender(tab.key as 'all' | 'male' | 'female');
              }}
            >
              {tab.label}
            </View>
          ))}
        </View>

        <View className={styles.filterTags}>
          {stylesList.map(style => (
            <View
              key={style.key}
              className={classnames(styles.filterTag, selectedStyle === style.key && styles.active)}
              onClick={() => {
                console.log('[CommunityPage] 选择风格:', style.key);
                setSelectedStyle(style.key as DynastyStyle | '');
              }}
            >
              {style.label}
            </View>
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <SafetyReminder />
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>同袍列表</Text>
          <Text className={styles.userCount}>共 {filteredUsers.length} 人</Text>
        </View>

        <View className={styles.sortOptions}>
          <Text
            className={classnames(styles.sortOption, sortBy === 'rating' && styles.active)}
            onClick={() => setSortBy('rating')}
          >
            好评优先
          </Text>
          <Text
            className={classnames(styles.sortOption, sortBy === 'latest' && styles.active)}
            onClick={() => setSortBy('latest')}
          >
            最新注册
          </Text>
        </View>
      </View>

      <ScrollView
        scrollY
        className={styles.section}
        style={{ height: 'calc(100vh - 640rpx)' }}
      >
        {filteredUsers.length > 0 ? (
          <View className={styles.list}>
            {filteredUsers.map(user => (
              <UserCard key={user.id} user={user} />
            ))}
          </View>
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>👥</Text>
            <Text className={styles.emptyText}>暂无符合条件的同袍</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default CommunityPage;
