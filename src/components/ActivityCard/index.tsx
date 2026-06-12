import React from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import dayjs from 'dayjs';
import styles from './index.module.scss';
import type { Activity } from '@/types';
import { ACTIVITY_TYPE_MAP, DYNASTY_MAP } from '@/types';

interface ActivityCardProps {
  activity: Activity;
  showStatus?: boolean;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, showStatus = false }) => {
  const handleClick = () => {
    console.log('[ActivityCard] 点击活动:', activity.id, activity.title);
    Taro.navigateTo({
      url: `/pages/activity-detail/index?id=${activity.id}`
    });
  };

  const isFull = activity.currentPeople >= activity.maxPeople;
  const progress = Math.round((activity.currentPeople / activity.maxPeople) * 100);

  return (
    <View className={styles.card} onClick={handleClick}>
      <View className={styles.coverWrapper}>
        <Image
          className={styles.cover}
          src={activity.coverImage}
          mode="aspectFill"
          onError={(e) => console.error('[ActivityCard] 图片加载失败:', e.detail)}
        />
        <View className={styles.typeTag}>{ACTIVITY_TYPE_MAP[activity.type]}</View>
        <View className={styles.dynastyTag}>{DYNASTY_MAP[activity.dynasty]}</View>
        {isFull && <View className={styles.fullTag}>已满</View>}
      </View>

      <View className={styles.content}>
        <Text className={styles.title}>{activity.title}</Text>

        <View className={styles.infoRow}>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>时间</Text>
            <Text className={styles.infoValue}>
              {dayjs(activity.date).format('MM-DD')} {activity.time.split('-')[0]}
            </Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>城市</Text>
            <Text className={styles.infoValue}>{activity.city}</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>费用</Text>
            <Text className={classnames(styles.infoValue, styles.fee)}>
              {activity.fee === 0 ? '免费' : `¥${activity.fee}`}
            </Text>
          </View>
        </View>

        <View className={styles.progressBar}>
          <View className={styles.progressFill} style={{ width: `${progress}%` }} />
          <Text className={styles.progressText}>
            {activity.currentPeople}/{activity.maxPeople}人
          </Text>
        </View>

        <View className={styles.footer}>
          <View className={styles.organizer}>
            <Image className={styles.organizerAvatar} src={activity.organizerAvatar} mode="aspectFill" />
            <Text className={styles.organizerName}>{activity.organizer}</Text>
          </View>
          <Button
            className={classnames(styles.btn, isFull ? styles.btnDisabled : styles.btnPrimary)}
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            {isFull ? '候补' : '报名'}
          </Button>
        </View>
      </View>
    </View>
  );
};

export default ActivityCard;
