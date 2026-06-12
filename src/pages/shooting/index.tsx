import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import ShootingCard from '@/components/ShootingCard';
import SafetyReminder from '@/components/SafetyReminder';
import { useAppStore } from '@/store';
import type { ShootingType, DynastyStyle } from '@/types';
import { SHOOTING_TYPE_MAP, DYNASTY_MAP } from '@/types';

const ShootingPage: React.FC = () => {
  const shootings = useAppStore((s) => s.shootings);
  const shootingFilter = useAppStore((s) => s.shootingFilter);
  const setShootingFilter = useAppStore((s) => s.setShootingFilter);

  const [selectedCity, setSelectedCity] = useState('');

  const activeTab = shootingFilter.typeTab;
  const filterStatus = shootingFilter.statusTab;
  const selectedStyle = shootingFilter.styleTab as DynastyStyle | '';

  const filteredShootings = useMemo(() => {
    let result = [...shootings];

    if (activeTab !== 'all') {
      result = result.filter(s => s.type === activeTab);
    }
    if (filterStatus === 'favorited') {
      result = result.filter(s => s.isFavorited);
    } else if (filterStatus === 'contacted') {
      result = result.filter(s => s.isContacted);
    }
    if (selectedStyle) {
      result = result.filter(s => s.style === selectedStyle);
    }
    if (selectedCity) {
      result = result.filter(s => s.city === selectedCity);
    }

    return result;
  }, [shootings, activeTab, filterStatus, selectedStyle, selectedCity]);

  const handlePublish = () => {
    console.log('[ShootingPage] 发布需求');
    Taro.navigateTo({ url: '/pages/shooting-publish/index' });
  };

  const handleTabChange = (tab: ShootingType | 'all') => {
    console.log('[ShootingPage] 切换标签:', tab);
    setShootingFilter({ typeTab: tab });
  };

  const tabs = [
    { key: 'all', label: '全部' },
    { key: 'photographer', label: SHOOTING_TYPE_MAP.photographer },
    { key: 'makeupArtist', label: SHOOTING_TYPE_MAP.makeupArtist },
    { key: 'model', label: SHOOTING_TYPE_MAP.model }
  ];

  const stylesList = [
    { key: '', label: '全部' },
    ...Object.entries(DYNASTY_MAP).map(([key, value]) => ({ key, label: value }))
  ];

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>约拍广场</Text>
        <Text className={styles.headerDesc}>寻找摄影师、妆娘、模特，一起创作汉服大片</Text>
      </View>

      <View className={styles.tabs}>
        {tabs.map(tab => (
          <View
            key={tab.key}
            className={classnames(styles.tab, activeTab === tab.key && styles.active)}
            onClick={() => handleTabChange(tab.key as ShootingType | 'all')}
          >
            {tab.label}
          </View>
        ))}
      </View>

      <View className={styles.section}>
        <SafetyReminder />
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>需求列表</Text>
          <Text style={{ fontSize: 24, color: '#999' }}>共 {filteredShootings.length} 条</Text>
        </View>

        <View className={styles.statusTabs}>
          {[
            { key: 'all', label: '全部' },
            { key: 'favorited', label: '❤️ 已收藏' },
            { key: 'contacted', label: '💬 已联系' }
          ].map((tab) => (
            <View
              key={tab.key}
              className={classnames(
                styles.statusTab,
                filterStatus === tab.key && styles.statusTabActive
              )}
              onClick={() => setShootingFilter({ statusTab: tab.key as 'all' | 'favorited' | 'contacted' })}
            >
              {tab.label}
            </View>
          ))}
        </View>

        <View className={styles.filterRow}>
          <ScrollView scrollX style={{ whiteSpace: 'nowrap' }}>
            {stylesList.map(style => (
              <View
                key={style.key}
                className={classnames(
                  styles.filterChip,
                  selectedStyle === style.key && styles.active
                )}
                style={{ display: 'inline-block', marginRight: 16 }}
                onClick={() => {
                  console.log('[ShootingPage] 选择风格:', style.key);
                  setShootingFilter({ styleTab: (style.key || 'all') as DynastyStyle | 'all' });
                }}
              >
                {style.label}
              </View>
            ))}
          </ScrollView>
        </View>
      </View>

      <ScrollView
        scrollY
        className={styles.section}
        style={{ height: 'calc(100vh - 560rpx)' }}
      >
        {filteredShootings.length > 0 ? (
          <View className={styles.list}>
            {filteredShootings.map(shooting => (
              <ShootingCard key={shooting.id} shooting={shooting} />
            ))}
          </View>
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📷</Text>
            <Text className={styles.emptyText}>暂无符合条件的约拍需求</Text>
          </View>
        )}
      </ScrollView>

      <View className={styles.fab} onClick={handlePublish}>
        <Text className={styles.fabIcon}>+</Text>
      </View>
    </View>
  );
};

export default ShootingPage;
