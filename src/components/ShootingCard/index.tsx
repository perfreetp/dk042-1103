import React from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import type { Shooting } from '@/types';
import { SHOOTING_TYPE_MAP, DYNASTY_MAP } from '@/types';

interface ShootingCardProps {
  shooting: Shooting;
}

const ShootingCard: React.FC<ShootingCardProps> = ({ shooting }) => {
  const handleClick = () => {
    console.log('[ShootingCard] 点击约拍:', shooting.id, shooting.title);
    Taro.navigateTo({
      url: `/pages/shooting-detail/index?id=${shooting.id}`
    });
  };

  const handleContact = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('[ShootingCard] 联系发布者:', shooting.publisher.id);
    Taro.navigateTo({
      url: `/pages/chat/index?userId=${shooting.publisher.id}`
    });
  };

  const typeColors: Record<string, string> = {
    photographer: '#C81D25',
    makeupArtist: '#D4A84B',
    model: '#8B6914'
  };

  return (
    <View className={styles.card} onClick={handleClick}>
      <View className={styles.header}>
        <View
          className={styles.typeBadge}
          style={{ backgroundColor: typeColors[shooting.type] }}
        >
          {SHOOTING_TYPE_MAP[shooting.type]}
        </View>
        <Text className={styles.time}>{shooting.publishTime}</Text>
      </View>

      <Text className={styles.title}>{shooting.title}</Text>

      <View className={styles.tags}>
        <View className={styles.tag}>{DYNASTY_MAP[shooting.style]}</View>
        {shooting.tags.slice(0, 2).map((tag, index) => (
          <View key={index} className={styles.tag}>{tag}</View>
        ))}
      </View>

      <View className={styles.infoRow}>
        <View className={styles.infoItem}>
          <Text className={styles.infoLabel}>城市</Text>
          <Text className={styles.infoValue}>{shooting.city}</Text>
        </View>
        <View className={styles.infoItem}>
          <Text className={styles.infoLabel}>时间</Text>
          <Text className={styles.infoValue}>{shooting.date}</Text>
        </View>
        <View className={styles.infoItem}>
          <Text className={styles.infoLabel}>预算</Text>
          <Text className={styles.budget}>{shooting.budget}</Text>
        </View>
      </View>

      <Text className={styles.description}>
        {shooting.description.length > 60
          ? shooting.description.substring(0, 60) + '...'
          : shooting.description}
      </Text>

      <View className={styles.footer}>
        <View className={styles.publisher}>
          <Image className={styles.avatar} src={shooting.publisher.avatar} mode="aspectFill" />
          <View className={styles.publisherInfo}>
            <View className={styles.publisherNameRow}>
              <Text className={styles.publisherName}>{shooting.publisher.nickname}</Text>
              {shooting.publisher.isVerified && (
                <View className={styles.verifiedBadge}>认证</View>
              )}
            </View>
            <Text className={styles.publisherCity}>{shooting.publisher.city}</Text>
          </View>
        </View>
        <Button className={styles.btn} onClick={handleContact}>
          联系TA
        </Button>
      </View>
    </View>
  );
};

export default ShootingCard;
