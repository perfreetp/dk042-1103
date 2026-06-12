import React, { useState } from 'react';
import { View, Text, Image, Textarea } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useAppStore } from '@/store';
import {
  SHOOTING_TYPE_MAP,
  DYNASTY_MAP
} from '@/types';

const TYPE_ICONS: Record<string, string> = {
  photographer: '📷',
  makeupArtist: '💄',
  model: '👗'
};

const TYPE_COLORS: Record<string, string> = {
  photographer: '#C81D25',
  makeupArtist: '#D4A84B',
  model: '#8B6914'
};

const ShootingDetailPage: React.FC = () => {
  const router = useRouter();
  const shootingId = router.params.id || '';

  const shooting = useAppStore((s) => s.getShootingById(shootingId));
  const toggleFavorite = useAppStore((s) => s.toggleFavoriteShooting);
  const markContacted = useAppStore((s) => s.markShootingContacted);
  const addReviewForUser = useAppStore((s) => s.addReviewForUser);
  const isUserBlocked = useAppStore((s) => s.isUserBlocked);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewContent, setReviewContent] = useState('');

  if (!shooting) {
    return (
      <View className={styles.page}>
        <View style={{ padding: 100, textAlign: 'center' }}>
          <Text>约拍需求不存在</Text>
        </View>
      </View>
    );
  }

  const isBlocked = isUserBlocked(shooting.publisher.id);
  const typeConfig = TYPE_COLORS[shooting.type];

  const handleFavorite = () => {
    const res = toggleFavorite(shooting.id);
    Taro.showToast({
      title: res.isFavorited ? '已收藏' : '已取消收藏',
      icon: 'none'
    });
  };

  const handleContact = () => {
    if (isBlocked) {
      Taro.showToast({ title: '该用户已被拉黑', icon: 'none' });
      return;
    }
    markContacted(shooting.id);
    Taro.navigateTo({
      url: `/pages/chat/index?id=${shooting.publisher.id}&shootingId=${shooting.id}`
    });
  };

  const handleSubmitReview = () => {
    if (!reviewContent.trim()) {
      Taro.showToast({ title: '请填写评价内容', icon: 'none' });
      return;
    }
    addReviewForUser(shooting.publisher.id, {
      rating: reviewRating,
      content: reviewContent,
      shootingId: shooting.id,
      shootingTitle: shooting.title
    });
    Taro.showToast({ title: '评价成功', icon: 'success' });
    setShowReviewModal(false);
    setReviewRating(5);
    setReviewContent('');
  };

  const averageRating = shooting.publisher.reviews.length > 0
    ? (shooting.publisher.reviews.reduce((sum, r) => sum + r.rating, 0) / shooting.publisher.reviews.length).toFixed(1)
    : '暂无';

  return (
    <View className={styles.page}>
      <View className={styles.cover}>
        <Image
          className={styles.coverImage}
          src={shooting.coverImage}
          mode="aspectFill"
        />
        <View className={styles.coverOverlay} />
        <View
          className={styles.typeBadge}
          style={{ backgroundColor: typeConfig }}
        >
          {TYPE_ICONS[shooting.type]} {SHOOTING_TYPE_MAP[shooting.type]}
        </View>
        {shooting.isContacted && (
          <View className={styles.contactedBadge}>已联系</View>
        )}
      </View>

      <View className={styles.content}>
        <View className={styles.titleCard}>
          <View className={styles.titleRow}>
            <Text className={styles.title}>{shooting.title}</Text>
            <Text
              className={classnames(styles.favoriteBtn, shooting.isFavorited && styles.favorited)}
              onClick={handleFavorite}
            >
              {shooting.isFavorited ? '❤️' : '🤍'}
            </Text>
          </View>
          <View className={styles.tagRow}>
            <View className={styles.tag}>{DYNASTY_MAP[shooting.style]}</View>
            {shooting.tags.map((t, i) => (
              <View key={i} className={styles.tag}>{t}</View>
            ))}
          </View>
        </View>

        <View className={styles.infoCard}>
          <Text className={styles.sectionTitle}>需求详情</Text>
          <View className={styles.infoGrid}>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>城市</Text>
              <Text className={styles.infoValue}>{shooting.city}</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>日期</Text>
              <Text className={styles.infoValue}>{shooting.date}</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>预算</Text>
              <Text className={styles.budget}>{shooting.budget}</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>发布时间</Text>
              <Text className={styles.infoValue}>{shooting.publishTime}</Text>
            </View>
          </View>
          <Text className={styles.description}>{shooting.description}</Text>
        </View>

        <View className={styles.infoCard}>
          <Text className={styles.sectionTitle}>发布者</Text>
          <View
            className={styles.publisherCard}
            onClick={() => Taro.navigateTo({ url: `/pages/user-detail/index?id=${shooting.publisher.id}` })}
          >
            <Image className={styles.avatar} src={shooting.publisher.avatar} mode="aspectFill" />
            <View className={styles.publisherInfo}>
              <View className={styles.publisherNameRow}>
                <Text className={styles.publisherName}>{shooting.publisher.nickname}</Text>
                {shooting.publisher.isVerified && <View className={styles.verifiedBadge}>认证</View>}
              </View>
              <View className={styles.publisherStats}>
                <Text className={styles.statItem}>⭐ {averageRating}分</Text>
                <Text className={styles.statItem}>📝 {shooting.publisher.reviews.length}条评价</Text>
                <Text className={styles.statItem}>🎨 {shooting.publisher.works.length}个作品</Text>
              </View>
            </View>
            <Text className={styles.arrow}>›</Text>
          </View>
        </View>

        {shooting.publisher.reviews.length > 0 && (
          <View className={styles.infoCard}>
            <Text className={styles.sectionTitle}>最新评价</Text>
            {shooting.publisher.reviews.slice(0, 2).map((review) => (
              <View key={review.id} className={styles.reviewItem}>
                <View className={styles.reviewHeader}>
                  <Image className={styles.reviewerAvatar} src={review.userAvatar} mode="aspectFill" />
                  <View className={styles.reviewerInfo}>
                    <Text className={styles.reviewerName}>{review.userName}</Text>
                    <View className={styles.reviewRating}>
                      {[...Array(5)].map((_, i) => (
                        <Text key={i} className={i < review.rating ? styles.starFilled : styles.starEmpty}>
                          ⭐
                        </Text>
                      ))}
                    </View>
                  </View>
                  <Text className={styles.reviewTime}>{review.time}</Text>
                </View>
                <Text className={styles.reviewContent}>{review.content}</Text>
                {review.shootingTitle && (
                  <Text className={styles.reviewShooting}>来自约拍：{review.shootingTitle}</Text>
                )}
              </View>
            ))}
          </View>
        )}
      </View>

      <View className={styles.bottomBar}>
        {shooting.isContacted && !isBlocked && (
          <View className={styles.btnOutline} onClick={() => setShowReviewModal(true)}>
            评价TA
          </View>
        )}
        {isBlocked ? (
          <View className={styles.btnDisabled}>已拉黑</View>
        ) : (
          <View className={styles.btnPrimary} onClick={handleContact}>
            💬 私信联系
          </View>
        )}
      </View>

      {showReviewModal && (
        <View className={styles.modalOverlay} onClick={() => setShowReviewModal(false)}>
          <View className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <Text className={styles.modalTitle}>评价{shooting.publisher.nickname}</Text>
            <Text className={styles.modalSubtitle}>请为本次约拍合作打分</Text>

            <View className={styles.ratingSelector}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Text
                  key={star}
                  className={classnames(styles.ratingStar, star <= reviewRating && styles.ratingStarActive)}
                  onClick={() => setReviewRating(star)}
                >
                  ⭐
                </Text>
              ))}
            </View>

            <Textarea
              className={styles.reviewInput}
              placeholder="请输入评价内容..."
              value={reviewContent}
              onInput={(e) => setReviewContent(e.detail.value)}
              maxlength={500}
            />

            <View className={styles.modalActions}>
              <View className={styles.modalBtnCancel} onClick={() => setShowReviewModal(false)}>
                取消
              </View>
              <View className={styles.modalBtnConfirm} onClick={handleSubmitReview}>
                提交评价
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default ShootingDetailPage;
