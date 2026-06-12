import React, { useState, useMemo } from 'react';
import { View, Text, Image, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { mockRegistrations } from '@/data/users';
import type { Registration, RegistrationStatus } from '@/types';
import { REGISTRATION_STATUS_MAP } from '@/types';

const RegistrationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'completed'>('all');

  const filteredRegistrations = useMemo(() => {
    let result = [...mockRegistrations];

    if (activeTab === 'upcoming') {
      result = result.filter(r =>
        r.status === 'confirmed' || r.status === 'pending' || r.status === 'waitlist'
      );
    } else if (activeTab === 'completed') {
      result = result.filter(r =>
        r.status === 'checkedIn' || r.status === 'cancelled'
      );
    }

    return result;
  }, [activeTab]);

  const stats = useMemo(() => ({
    total: mockRegistrations.length,
    confirmed: mockRegistrations.filter(r => r.status === 'confirmed').length,
    completed: mockRegistrations.filter(r => r.status === 'checkedIn').length
  }), []);

  const handleActivityClick = (activityId: string) => {
    console.log('[RegistrationsPage] 查看活动详情:', activityId);
    Taro.navigateTo({
      url: `/pages/activity-detail/index?id=${activityId}`
    });
  };

  const handleCancel = (reg: Registration) => {
    console.log('[RegistrationsPage] 取消报名:', reg.id);
    Taro.showModal({
      title: '确认取消',
      content: `确定要取消「${reg.activityTitle}」的报名吗？`,
      confirmColor: '#C81D25',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({
            title: '已取消报名',
            icon: 'success'
          });
        }
      }
    });
  };

  const handleCheckIn = (reg: Registration) => {
    console.log('[RegistrationsPage] 签到:', reg.id);
    Taro.showToast({
      title: '签到成功',
      icon: 'success'
    });
  };

  const handleUploadPhoto = (reg: Registration) => {
    console.log('[RegistrationsPage] 上传相册:', reg.id);
    Taro.navigateTo({
      url: `/pages/photo-upload/index?id=${reg.activityId}`
    });
  };

  const handleViewAlbum = (reg: Registration) => {
    console.log('[RegistrationsPage] 查看相册:', reg.id);
    Taro.navigateTo({
      url: `/pages/photo-upload/index?id=${reg.activityId}`
    });
  };

  const tabs = [
    { key: 'all', label: '全部', count: mockRegistrations.length },
    { key: 'upcoming', label: '待参加', count: stats.confirmed + stats.total - stats.completed },
    { key: 'completed', label: '已结束', count: stats.completed }
  ];

  const renderActions = (reg: Registration) => {
    switch (reg.status) {
      case 'confirmed':
        return (
          <>
            <Button
              className={classnames(styles.actionBtn, styles.btnOutline)}
              onClick={() => handleCancel(reg)}
            >
              取消报名
            </Button>
            <Button
              className={classnames(styles.actionBtn, styles.btnPrimary)}
              onClick={() => handleCheckIn(reg)}
            >
              签到
            </Button>
          </>
        );
      case 'pending':
        return (
          <>
            <Button
              className={classnames(styles.actionBtn, styles.btnOutline)}
              onClick={() => handleCancel(reg)}
            >
              取消报名
            </Button>
            <Button
              className={classnames(styles.actionBtn, styles.btnSecondary)}
              disabled
            >
              待确认
            </Button>
          </>
        );
      case 'waitlist':
        return (
          <>
            <Button
              className={classnames(styles.actionBtn, styles.btnOutline)}
              onClick={() => handleCancel(reg)}
            >
              取消候补
            </Button>
            <Button
              className={classnames(styles.actionBtn, styles.btnSecondary)}
            >
              候补中
            </Button>
          </>
        );
      case 'checkedIn':
        return (
          <>
            <Button
              className={classnames(styles.actionBtn, styles.btnOutline)}
              onClick={() => handleViewAlbum(reg)}
            >
              查看相册
            </Button>
            <Button
              className={classnames(styles.actionBtn, styles.btnPrimary)}
              onClick={() => handleUploadPhoto(reg)}
            >
              上传照片
            </Button>
          </>
        );
      case 'cancelled':
        return (
          <Button
            className={classnames(styles.actionBtn, styles.btnDisabled)}
            disabled
          >
            已取消
          </Button>
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
        {tabs.map(tab => (
          <View
            key={tab.key}
            className={classnames(styles.tab, activeTab === tab.key && styles.active)}
            onClick={() => {
              console.log('[RegistrationsPage] 切换标签:', tab.key);
              setActiveTab(tab.key as 'all' | 'upcoming' | 'completed');
            }}
          >
            {tab.label}
            {tab.count > 0 && <View className={styles.tabBadge}>{tab.count}</View>}
          </View>
        ))}
      </View>

      <ScrollView
        scrollY
        className={styles.section}
        style={{ height: 'calc(100vh - 480rpx)' }}
      >
        {filteredRegistrations.length > 0 ? (
          <View className={styles.list}>
            {filteredRegistrations.map(reg => (
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
                    onError={(e) => console.error('[RegistrationsPage] 封面图加载失败:', e.detail)}
                  />
                  <View className={styles.cardInfo}>
                    <Text className={styles.cardTitle}>{reg.activityTitle}</Text>
                    <View className={classnames(styles.statusBadge, styles[reg.status])}>
                      {REGISTRATION_STATUS_MAP[reg.status]}
                    </View>
                    <View className={styles.cardMeta}>
                      <View className={styles.metaRow}>
                        <Text className={styles.metaIcon}>📅</Text>
                        <Text>{reg.activityDate} {reg.activityTime}</Text>
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
