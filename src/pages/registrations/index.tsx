import React, { useState, useMemo } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useAppStore } from '@/store';
import type { Registration } from '@/types';
import { REGISTRATION_STATUS_MAP } from '@/types';

const RegistrationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'completed'>('all');

  const registrations = useAppStore((s) => s.registrations);
  const cancelRegistration = useAppStore((s) => s.cancelRegistration);
  const checkInActivity = useAppStore((s) => s.checkInActivity);

  const filteredRegistrations = useMemo(() => {
    let result = [...registrations];

    if (activeTab === 'upcoming') {
      result = result.filter(
        (r) =>
          r.status === 'confirmed' || r.status === 'pending' || r.status === 'waitlist'
      );
    } else if (activeTab === 'completed') {
      result = result.filter((r) => r.status === 'checkedIn' || r.status === 'cancelled');
    }

    return result.sort((a, b) => b.registerTime.localeCompare(a.registerTime));
  }, [registrations, activeTab]);

  const stats = useMemo(
    () => ({
      total: registrations.filter((r) => r.status !== 'cancelled').length,
      confirmed: registrations.filter(
        (r) => r.status === 'confirmed' || r.status === 'pending' || r.status === 'waitlist'
      ).length,
      completed: registrations.filter((r) => r.status === 'checkedIn').length
    }),
    [registrations]
  );

  const tabs = useMemo(
    () => [
      { key: 'all', label: '全部', count: registrations.length },
      {
        key: 'upcoming',
        label: '待参加',
        count: registrations.filter(
          (r) => r.status === 'confirmed' || r.status === 'pending' || r.status === 'waitlist'
        ).length
      },
      {
        key: 'completed',
        label: '已结束',
        count: registrations.filter((r) => r.status === 'checkedIn' || r.status === 'cancelled')
          .length
      }
    ],
    [registrations]
  );

  const handleActivityClick = (activityId: string) => {
    Taro.navigateTo({
      url: `/pages/activity-detail/index?id=${activityId}`
    });
  };

  const handleCancel = (reg: Registration) => {
    Taro.showModal({
      title: '确认取消',
      content: `确定要取消「${reg.activityTitle}」的报名吗？`,
      confirmColor: '#C81D25',
      success: (res) => {
        if (res.confirm) {
          const result = cancelRegistration(reg.id);
          Taro.showToast({
            title: result.message,
            icon: result.success ? 'success' : 'none'
          });
        }
      }
    });
  };

  const handleCheckIn = (reg: Registration) => {
    const result = checkInActivity(reg.id);
    Taro.showToast({
      title: result.message,
      icon: result.success ? 'success' : 'none'
    });
  };

  const handleUploadPhoto = (reg: Registration) => {
    Taro.navigateTo({
      url: `/pages/photo-upload/index?id=${reg.activityId}`
    });
  };

  const handleViewAlbum = (reg: Registration) => {
    Taro.navigateTo({
      url: `/pages/photo-upload/index?id=${reg.activityId}`
    });
  };

  const renderActions = (reg: Registration) => {
    switch (reg.status) {
      case 'confirmed':
        return (
          <>
            <View
              className={classnames(styles.actionBtn, styles.btnOutline)}
              onClick={() => handleCancel(reg)}
            >
              取消报名
            </View>
            <View
              className={classnames(styles.actionBtn, styles.btnPrimary)}
              onClick={() => handleCheckIn(reg)}
            >
              签到
            </View>
          </>
        );
      case 'pending':
        return (
          <>
            <View
              className={classnames(styles.actionBtn, styles.btnOutline)}
              onClick={() => handleCancel(reg)}
            >
              取消报名
            </View>
            <View className={classnames(styles.actionBtn, styles.btnSecondary)}>
              待确认
            </View>
          </>
        );
      case 'waitlist':
        return (
          <>
            <View
              className={classnames(styles.actionBtn, styles.btnOutline)}
              onClick={() => handleCancel(reg)}
            >
              取消候补
            </View>
            <View className={classnames(styles.actionBtn, styles.btnSecondary)}>
              候补中
            </View>
          </>
        );
      case 'checkedIn':
        return (
          <>
            <View
              className={classnames(styles.actionBtn, styles.btnOutline)}
              onClick={() => handleViewAlbum(reg)}
            >
              查看相册
            </View>
            <View
              className={classnames(styles.actionBtn, styles.btnPrimary)}
              onClick={() => handleUploadPhoto(reg)}
            >
              上传照片
            </View>
          </>
        );
      case 'cancelled':
        return (
          <View className={classnames(styles.actionBtn, styles.btnDisabled)}>已取消</View>
        );
      default:
        return null;
    }
  };

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>我的报名</Text>
        <Text className={styles.headerDesc}>管理你报名的汉服活动</Text>
        <View className={styles.statsRow}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{stats.total}</Text>
            <Text className={styles.statLabel}>总报名</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{stats.confirmed}</Text>
            <Text className={styles.statLabel}>已确认</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{stats.completed}</Text>
            <Text className={styles.statLabel}>已完成</Text>
          </View>
        </View>
      </View>

      <View className={styles.tabs}>
        {tabs.map((tab) => (
          <View
            key={tab.key}
            className={classnames(styles.tab, activeTab === tab.key && styles.active)}
            onClick={() => setActiveTab(tab.key as 'all' | 'upcoming' | 'completed')}
          >
            {tab.label}
            {tab.count > 0 && <View className={styles.tabBadge}>{tab.count}</View>}
          </View>
        ))}
      </View>

      <ScrollView scrollY className={styles.section} style={{ height: 'calc(100vh - 480rpx)' }}>
        {filteredRegistrations.length > 0 ? (
          <View className={styles.list}>
            {filteredRegistrations.map((reg) => (
              <View
                key={reg.id}
                className={styles.registrationCard}
                onClick={() => handleActivityClick(reg.activityId)}
              >
                <View className={styles.cardHeader}>
                  <Image
                    className={styles.cardCover}
                    src={reg.coverImage}
                    mode="aspectFill"
                  />
                  <View className={styles.cardInfo}>
                    <Text className={styles.cardTitle}>{reg.activityTitle}</Text>
                    <View className={classnames(styles.statusBadge, styles[reg.status])}>
                      {REGISTRATION_STATUS_MAP[reg.status]}
                    </View>
                    <View className={styles.cardMeta}>
                      <View className={styles.metaRow}>
                        <Text className={styles.metaIcon}>📅</Text>
                        <Text>
                          {reg.activityDate} {reg.activityTime}
                        </Text>
                      </View>
                      <View className={styles.metaRow}>
                        <Text className={styles.metaIcon}>📍</Text>
                        <Text className={styles.metaRowText}>{reg.activityLocation}</Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View className={styles.cardActions} onClick={(e) => e.stopPropagation()}>
                  {renderActions(reg)}
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📋</Text>
            <Text className={styles.emptyText}>暂无报名记录</Text>
            <Text className={styles.emptyHint}>去发现精彩的汉服活动吧</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default RegistrationsPage;
