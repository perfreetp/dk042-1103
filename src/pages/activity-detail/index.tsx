import React, { useMemo, useState } from 'react';
import { View, Text, Image, Textarea, Input } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useAppStore } from '@/store';
import {
  ACTIVITY_TYPE_MAP,
  DYNASTY_MAP,
  REGISTRATION_STATUS_MAP,
  ACTIVITY_DYNAMIC_TYPE_MAP,
  ActivityDynamicType
} from '@/types';

const ActivityDetailPage: React.FC = () => {
  const router = useRouter();
  const activityId = router.params.id || '1';

  const activity = useAppStore((s) => s.getActivityById(activityId));
  const registration = useAppStore((s) => s.getRegistrationByActivityId(activityId));
  const photos = useAppStore((s) => s.getPhotosByActivityId(activityId));
  const dynamics = useAppStore((s) => s.getDynamicsByActivityId(activityId));
  const registerActivity = useAppStore((s) => s.registerActivity);
  const waitlistActivity = useAppStore((s) => s.waitlistActivity);
  const cancelRegistration = useAppStore((s) => s.cancelRegistration);
  const checkInActivity = useAppStore((s) => s.checkInActivity);
  const addActivityDynamic = useAppStore((s) => s.addActivityDynamic);

  const [showPublishDynamic, setShowPublishDynamic] = useState(false);
  const [newDynamicType, setNewDynamicType] = useState<ActivityDynamicType>('notice');
  const [newDynamicTitle, setNewDynamicTitle] = useState('');
  const [newDynamicContent, setNewDynamicContent] = useState('');

  const isOrganizer = registration?.status === 'checkedIn' || activityId === '1';

  const peoplePercent = useMemo(() => {
    if (!activity) return 0;
    return Math.min(100, Math.round((activity.currentPeople / activity.maxPeople) * 100));
  }, [activity]);

  const isFull = activity ? activity.currentPeople >= activity.maxPeople : false;

  if (!activity) {
    return (
      <View className={styles.page}>
        <View style={{ padding: 100, textAlign: 'center' }}>
          <Text>活动不存在</Text>
        </View>
      </View>
    );
  }

  const handleRegister = () => {
    const res = registerActivity(activityId);
    Taro.showToast({ title: res.message, icon: res.success ? 'success' : 'none' });
  };

  const handleWaitlist = () => {
    const res = waitlistActivity(activityId);
    Taro.showToast({ title: res.message, icon: res.success ? 'success' : 'none' });
  };

  const handleCancel = () => {
    if (!registration) return;
    const res = cancelRegistration(registration.id);
    Taro.showToast({ title: res.message, icon: res.success ? 'success' : 'none' });
  };

  const handleCheckIn = () => {
    if (!registration) return;
    const res = checkInActivity(registration.id);
    Taro.showToast({ title: res.message, icon: res.success ? 'success' : 'none' });
  };

  const handleGoAlbum = () => {
    Taro.navigateTo({ url: `/pages/photo-upload/index?id=${activityId}` });
  };

  const handlePublishDynamic = () => {
    if (!newDynamicTitle.trim() || !newDynamicContent.trim()) {
      Taro.showToast({ title: '请填写标题和内容', icon: 'none' });
      return;
    }
    addActivityDynamic(activityId, {
      type: newDynamicType,
      title: newDynamicTitle,
      content: newDynamicContent
    });
    Taro.showToast({ title: '发布成功', icon: 'success' });
    setNewDynamicTitle('');
    setNewDynamicContent('');
    setShowPublishDynamic(false);
  };

  const statusBadgeClass = registration
    ? {
        confirmed: styles.statusConfirmed,
        waitlist: styles.statusWaitlist,
        pending: styles.statusPending,
        checkedIn: styles.statusCheckedIn,
        cancelled: ''
      }[registration.status]
    : '';

  return (
    <View className={styles.page}>
      <Image className={styles.cover} src={activity.coverImage} mode="aspectFill" />

      {registration && registration.status !== 'cancelled' && (
        <View className={classnames(styles.statusBadge, statusBadgeClass)}>
          {REGISTRATION_STATUS_MAP[registration.status]}
        </View>
      )}

      <View className={styles.content}>
        <View className={styles.titleCard}>
          <Text className={styles.title}>{activity.title}</Text>
          <View className={styles.tagRow}>
            <View className={styles.tag}>{ACTIVITY_TYPE_MAP[activity.type]}</View>
            <View className={classnames(styles.tag, styles.tagGold)}>
              {DYNASTY_MAP[activity.dynasty]}
            </View>
            {activity.tags.map((t, i) => (
              <View key={i} className={classnames(styles.tag, styles.tagGold)}>
                {t}
              </View>
            ))}
          </View>
          <Text className={styles.desc}>{activity.description}</Text>
        </View>

        <View className={styles.infoCard}>
          <Text className={styles.sectionTitle}>活动详情</Text>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>活动地点</Text>
            <Text className={styles.infoValue}>{activity.location}</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>活动时间</Text>
            <Text className={styles.infoValue}>
              {activity.date} {activity.time}
            </Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>集合时间</Text>
            <Text className={styles.infoValue}>
              {activity.date} {activity.time.split('-')[0]}
            </Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>活动费用</Text>
            <Text className={classnames(styles.infoValue, styles.feeHighlight)}>
              {activity.fee === 0 ? '免费' : `¥${activity.fee}`}
            </Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>服饰要求</Text>
            <Text className={styles.infoValue}>{activity.dressRequirement}</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>报名人数</Text>
            <View className={styles.infoValue}>
              <View className={styles.peopleBar}>
                <View
                  className={styles.peopleFill}
                  style={{ width: `${peoplePercent}%` }}
                />
              </View>
              <Text className={styles.peopleText}>
                {activity.currentPeople}/{activity.maxPeople}人已报名
                {isFull && '（名额已满）'}
              </Text>
            </View>
          </View>
        </View>

        <View className={styles.infoCard}>
          <Text className={styles.sectionTitle}>主办方</Text>
          <View className={styles.organizer}>
            <Image
              className={styles.organizerAvatar}
              src={activity.organizerAvatar}
              mode="aspectFill"
            />
            <View className={styles.organizerInfo}>
              <Text className={styles.organizerName}>
                {activity.organizer}
                <Text className={styles.organizerBadge}>官方认证</Text>
              </Text>
            </View>
          </View>
        </View>

        {photos.length > 0 && (
          <View className={styles.infoCard}>
            <Text className={styles.sectionTitle}>活动相册（{photos.length}）</Text>
            <View
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '12rpx'
              }}
            >
              {photos.slice(0, 6).map((p) => (
                <Image
                  key={p.id}
                  src={p.url}
                  mode="aspectFill"
                  style={{
                    width: '218rpx',
                    height: '218rpx',
                    borderRadius: '12rpx'
                  }}
                />
              ))}
            </View>
          </View>
        )}

        <View className={styles.infoCard}>
          <View className={styles.dynamicHeader}>
            <Text className={styles.sectionTitle}>
              活动动态
              <Text style={{ fontSize: 24, color: '#999', marginLeft: 8 }}>
                ({dynamics.length})
              </Text>
            </Text>
            {isOrganizer && (
              <Text
                className={styles.publishBtn}
                onClick={() => setShowPublishDynamic(!showPublishDynamic)}
              >
                {showPublishDynamic ? '取消' : '+ 发动态'}
              </Text>
            )}
          </View>

          {showPublishDynamic && (
            <View className={styles.publishForm}>
              <View className={styles.typeSelector}>
                {Object.entries(ACTIVITY_DYNAMIC_TYPE_MAP).map(([key, val]) => (
                  <View
                    key={key}
                    className={classnames(
                      styles.typeChip,
                      newDynamicType === key && styles.typeChipActive
                    )}
                    style={{ borderColor: newDynamicType === key ? val.color : '#ddd' }}
                    onClick={() => setNewDynamicType(key as ActivityDynamicType)}
                  >
                    <Text style={{ marginRight: 4 }}>{val.icon}</Text>
                    <Text style={{ color: newDynamicType === key ? val.color : '#666' }}>
                      {val.label}
                    </Text>
                  </View>
                ))}
              </View>
              <Input
                className={styles.dynamicTitleInput}
                placeholder="请输入标题"
                value={newDynamicTitle}
                onInput={(e) => setNewDynamicTitle(e.detail.value)}
              />
              <Textarea
                className={styles.dynamicContentInput}
                placeholder="请输入内容..."
                value={newDynamicContent}
                onInput={(e) => setNewDynamicContent(e.detail.value)}
                maxlength={500}
              />
              <View className={styles.publishActions}>
                <Text className={styles.wordCount}>{newDynamicContent.length}/500</Text>
                <View className={styles.btnPublish} onClick={handlePublishDynamic}>
                  发布
                </View>
              </View>
            </View>
          )}

          {dynamics.length > 0 ? (
            <View className={styles.timeline}>
              {dynamics.map((dynamic, index) => {
                const typeConfig = ACTIVITY_DYNAMIC_TYPE_MAP[dynamic.type];
                return (
                  <View key={dynamic.id} className={styles.timelineItem}>
                    <View className={styles.timelineDot} style={{ background: typeConfig.color }}>
                      {typeConfig.icon}
                    </View>
                    <View className={styles.timelineLine} style={{ display: index === dynamics.length - 1 ? 'none' : 'block' }} />
                    <View className={styles.timelineContent}>
                      <View className={styles.timelineHeader}>
                        <Text className={styles.timelineType} style={{ color: typeConfig.color }}>
                          {typeConfig.label}
                        </Text>
                        <Text className={styles.timelineTime}>{dynamic.publishTime}</Text>
                      </View>
                      <Text className={styles.timelineTitle}>{dynamic.title}</Text>
                      <Text className={styles.timelineDesc}>{dynamic.content}</Text>
                      <View className={styles.timelinePublisher}>
                        <Image className={styles.publisherAvatar} src={dynamic.publisherAvatar} mode="aspectFill" />
                        <Text className={styles.publisherName}>{dynamic.publisherName}</Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            <View className={styles.emptyState}>
              <Text className={styles.emptyIcon}>📢</Text>
              <Text className={styles.emptyText}>暂无活动动态</Text>
            </View>
          )}
        </View>
      </View>

      <View className={styles.bottomBar}>
        {photos.length > 0 && (
          <View className={styles.btnGhost} onClick={handleGoAlbum}>
            📷 相册
          </View>
        )}

        {!registration || registration.status === 'cancelled' ? (
          <>
            <View
              className={classnames(
                styles.btn,
                isFull ? styles.btnSecondary : styles.btnOutline
              )}
              onClick={handleWaitlist}
            >
              {isFull ? '候补报名' : '候补'}
            </View>
            <View
              className={classnames(styles.btn, isFull ? styles.btnDisabled : styles.btnPrimary)}
              onClick={handleRegister}
            >
              {isFull ? '名额已满' : '立即报名'}
            </View>
          </>
        ) : (
          <>
            {registration.status === 'confirmed' && (
              <>
                <View className={classnames(styles.btn, styles.btnOutline)} onClick={handleCancel}>
                  取消报名
                </View>
                <View className={classnames(styles.btn, styles.btnPrimary)} onClick={handleCheckIn}>
                  活动签到
                </View>
              </>
            )}
            {registration.status === 'pending' && (
              <>
                <View className={classnames(styles.btn, styles.btnOutline)} onClick={handleCancel}>
                  取消报名
                </View>
                <View className={classnames(styles.btn, styles.btnDisabled)}>
                  待主办方确认
                </View>
              </>
            )}
            {registration.status === 'waitlist' && (
              <>
                <View className={classnames(styles.btn, styles.btnOutline)} onClick={handleCancel}>
                  取消候补
                </View>
                <View className={classnames(styles.btn, styles.btnDisabled)}>
                  候补中...
                </View>
              </>
            )}
            {registration.status === 'checkedIn' && (
              <>
                <View className={classnames(styles.btn, styles.btnOutline)} onClick={handleGoAlbum}>
                  查看相册
                </View>
                <View className={classnames(styles.btn, styles.btnPrimary)} onClick={handleGoAlbum}>
                  上传照片
                </View>
              </>
            )}
          </>
        )}
      </View>
    </View>
  );
};

export default ActivityDetailPage;
