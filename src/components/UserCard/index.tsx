import React from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import type { User } from '@/types';
import { DYNASTY_MAP } from '@/types';
import { useAppStore } from '@/store';

interface UserCardProps {
  user: User;
  showActions?: boolean;
}

const UserCard: React.FC<UserCardProps> = ({ user, showActions = true }) => {
  const isBlocked = useAppStore((s) => s.isUserBlocked(user.id));

  const handleClick = () => {
    console.log('[UserCard] 点击用户:', user.id, user.nickname);
    Taro.navigateTo({
      url: `/pages/user-detail/index?id=${user.id}`
    });
  };

  const handleChat = (e: any) => {
    e.stopPropagation();
    if (isBlocked) {
      Taro.showToast({ title: '该用户已被拉黑', icon: 'none' });
      return;
    }
    console.log('[UserCard] 发起私信:', user.id);
    Taro.navigateTo({
      url: `/pages/chat/index?id=${user.id}`
    });
  };

  const averageRating = user.reviews.length > 0
    ? user.reviews.reduce((sum, r) => sum + r.rating, 0) / user.reviews.length
    : 0;

  return (
    <View className={styles.card} onClick={handleClick}>
      <View className={styles.header}>
        <View className={styles.userInfo}>
          <Image className={styles.avatar} src={user.avatar} mode="aspectFill" />
          <View className={styles.info}>
            <View className={styles.nameRow}>
              <Text className={styles.name}>{user.nickname}</Text>
              {user.isVerified && <View className={styles.verified}>认证</View>}
            </View>
            <Text className={styles.location}>
              {user.city} · {user.age}岁 · {user.gender === 'female' ? '女' : '男'}
            </Text>
            {user.reviews.length > 0 && (
              <View className={styles.rating}>
                <Text className={styles.ratingScore}>{averageRating.toFixed(1)}</Text>
                <Text className={styles.ratingCount}>({user.reviews.length}条评价)</Text>
              </View>
            )}
          </View>
        </View>
        {showActions && (
          <Button className={styles.chatBtn} onClick={handleChat}>
            私信
          </Button>
        )}
      </View>

      <View className={styles.sizeInfo}>
        <View className={styles.sizeItem}>
          <Text className={styles.sizeLabel}>身高</Text>
          <Text className={styles.sizeValue}>{user.height}cm</Text>
        </View>
        <View className={styles.sizeDivider} />
        <View className={styles.sizeItem}>
          <Text className={styles.sizeLabel}>体重</Text>
          <Text className={styles.sizeValue}>{user.weight}kg</Text>
        </View>
        <View className={styles.sizeDivider} />
        <View className={styles.sizeItem}>
          <Text className={styles.sizeLabel}>三围</Text>
          <Text className={styles.sizeValue}>{user.bust}-{user.waist}-{user.hips}</Text>
        </View>
      </View>

      <View className={styles.styles}>
        <Text className={styles.stylesLabel}>常穿风格：</Text>
        <View className={styles.styleTags}>
          {user.usualStyle.map((style, index) => (
            <View key={index} className={styles.styleTag}>
              {DYNASTY_MAP[style]}
            </View>
          ))}
        </View>
      </View>

      <Text className={styles.bio}>
        {user.bio.length > 50 ? user.bio.substring(0, 50) + '...' : user.bio}
      </Text>

      {user.works.length > 0 && (
        <View className={styles.works}>
          {user.works.slice(0, 4).map((work, index) => (
            <Image
              key={index}
              className={classnames(styles.workImage, index === 3 && user.works.length > 4 && styles.workMore)}
              src={work}
              mode="aspectFill"
              onError={(e) => console.error('[UserCard] 作品图加载失败:', e.detail)}
            />
          ))}
          {user.works.length > 4 && (
            <View className={styles.moreOverlay}>+{user.works.length - 4}</View>
          )}
        </View>
      )}
    </View>
  );
};

export default UserCard;
