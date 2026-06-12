import React, { useState } from 'react';
import { View, Text, Image, Textarea, Input } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useAppStore } from '@/store';
import {
  SHOOTING_TYPE_MAP,
  DYNASTY_MAP,
  COOPERATION_STATUS_MAP
} from '@/types';

const CURRENT_USER_ID = 'me';

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
  const getCooperationByShootingAndUser = useAppStore((s) => s.getCooperationByShootingAndUser);
  const createCooperation = useAppStore((s) => s.createCooperation);
  const updateCooperationStatus = useAppStore((s) => s.updateCooperationStatus);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewContent, setReviewContent] = useState('');
  const [showCooperationModal, setShowCooperationModal] = useState(false);
  const [coopDate, setCoopDate] = useState('');
  const [coopTime, setCoopTime] = useState('');
  const [coopLocation, setCoopLocation] = useState('');
  const [coopBudget, setCoopBudget] = useState('');

  if (!shooting) {
    return (
      <View className={styles.page}>
        <View style={{ padding: 100, textAlign: 'center' }}>
          <Text>约拍需求不存在</Text>
        </View>
      </View>
    );
  }

  const cooperation = getCooperationByShootingAndUser(shootingId, CURRENT_USER_ID);
  const isBlocked = isUserBlocked(shooting.publisher.id);
  const typeConfig = TYPE_COLORS[shooting.type];
  const isRequester = cooperation?.requesterId === CURRENT_USER_ID;
  const cooperationStatus = cooperation?.status;
  const hasReviewed = cooperation
    ? isRequester
      ? cooperation.requesterReviewed
      : cooperation.accepterReviewed
    : false;
  const canReview = cooperationStatus === 'completed' && !hasReviewed;
  const showReviewBtn = canReview;

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
      shootingTitle: shooting.title,
      cooperationId: cooperation?.id
    });
    Taro.showToast({ title: '评价成功', icon: 'success' });
    setShowReviewModal(false);
    setReviewRating(5);
    setReviewContent('');
  };

  const handleOpenCooperationModal = () => {
    setCoopDate(shooting.date);
    setCoopTime('');
    setCoopLocation(shooting.city);
    setCoopBudget(shooting.budget);
    setShowCooperationModal(true);
  };

  const handleCreateCooperation = () => {
    if (!coopDate.trim() || !coopTime.trim() || !coopLocation.trim() || !coopBudget.trim()) {
      Taro.showToast({ title: '请填写完整信息', icon: 'none' });
      return;
    }
    createCooperation({
      shootingId: shooting.id,
      shootingTitle: shooting.title,
      accepterId: shooting.publisher.id,
      accepterName: shooting.publisher.nickname,
      accepterAvatar: shooting.publisher.avatar,
      role: shooting.type,
      date: coopDate,
      time: coopTime,
      location: coopLocation,
      budget: coopBudget
    });
    Taro.showToast({ title: '合作单已发起', icon: 'success' });
    setShowCooperationModal(false);
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

        {cooperation && (
          <View className={styles.infoCard}>
            <View className={styles.cooperationHeader}>
              <Text className={styles.sectionTitle}>合作单</Text>
              <View
                className={styles.cooperationStatus}
                style={{ color: COOPERATION_STATUS_MAP[cooperation.status].color }}
              >
                {COOPERATION_STATUS_MAP[cooperation.status].label}
              </View>
            </View>
            <View className={styles.cooperationInfo}>
              <View className={styles.cooperationRow}>
                <Text className={styles.cooperationLabel}>角色</Text>
                <Text className={styles.cooperationValue}>{SHOOTING_TYPE_MAP[cooperation.role]}</Text>
              </View>
              <View className={styles.cooperationRow}>
                <Text className={styles.cooperationLabel}>日期</Text>
                <Text className={styles.cooperationValue}>{cooperation.date}</Text>
              </View>
              <View className={styles.cooperationRow}>
                <Text className={styles.cooperationLabel}>时间</Text>
                <Text className={styles.cooperationValue}>{cooperation.time}</Text>
              </View>
              <View className={styles.cooperationRow}>
                <Text className={styles.cooperationLabel}>地点</Text>
                <Text className={styles.cooperationValue}>{cooperation.location}</Text>
              </View>
              <View className={styles.cooperationRow}>
                <Text className={styles.cooperationLabel}>预算</Text>
                <Text className={styles.cooperationValue}>{cooperation.budget}</Text>
              </View>
            </View>
            <View className={styles.cooperationActions}>
              {cooperation.status === 'pending' && (
                <>
                  <View
                    className={styles.coopBtn}
                    onClick={() => {
                      updateCooperationStatus(cooperation.id, 'cancelled');
                      Taro.showToast({ title: '已取消', icon: 'success' });
                    }}
                  >
                    取消合作
                  </View>
                  <View
                    className={classnames(styles.coopBtn, styles.coopBtnPrimary)}
                    onClick={() => {
                      updateCooperationStatus(cooperation.id, 'confirmed');
                      Taro.showToast({ title: '已确认合作', icon: 'success' });
                    }}
                  >
                    确认合作
                  </View>
                </>
              )}
              {cooperation.status === 'confirmed' && (
                <>
                  <View
                    className={styles.coopBtn}
                    onClick={() => {
                      updateCooperationStatus(cooperation.id, 'cancelled');
                      Taro.showToast({ title: '已取消', icon: 'success' });
                    }}
                  >
                    取消合作
                  </View>
                  <View
                    className={classnames(styles.coopBtn, styles.coopBtnPrimary)}
                    onClick={() => {
                      updateCooperationStatus(cooperation.id, 'inProgress');
                      Taro.showToast({ title: '合作已开始', icon: 'success' });
                    }}
                  >
                    开始合作
                  </View>
                </>
              )}
              {cooperation.status === 'inProgress' && (
                <View
                  className={classnames(styles.coopBtn, styles.coopBtnPrimary, styles.coopBtnFull)}
                  onClick={() => {
                    updateCooperationStatus(cooperation.id, 'completed');
                    Taro.showToast({ title: '合作已完成', icon: 'success' });
                  }}
                >
                  完成合作
                </View>
              )}
              {cooperation.status === 'completed' && (
                <View className={styles.completedHint}>
                  <Text>✅ 本次约拍合作已完成</Text>
                  {hasReviewed && <Text style={{ color: '#999', fontSize: 24 }}>（您已评价）</Text>}
                </View>
              )}
            </View>
          </View>
        )}

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
        {showReviewBtn && !isBlocked && (
          <View className={styles.btnOutline} onClick={() => setShowReviewModal(true)}>
            ⭐ 评价TA
          </View>
        )}
        {isBlocked ? (
          <View className={styles.btnDisabled}>已拉黑</View>
        ) : cooperation ? (
          <>
            <View className={styles.btnOutline} onClick={handleContact}>
              💬 私信
            </View>
            {cooperation.status === 'pending' || cooperation.status === 'confirmed' || cooperation.status === 'inProgress' ? (
              <View className={styles.btnDisabled}>
                合作进行中
              </View>
            ) : cooperation.status === 'completed' && hasReviewed ? (
              <View className={styles.btnDisabled}>
                已评价
              </View>
            ) : (
              <View className={styles.btnPrimary} onClick={() => setShowReviewModal(true)}>
                ⭐ 评价TA
              </View>
            )}
          </>
        ) : shooting.isContacted ? (
          <>
            <View className={styles.btnOutline} onClick={handleOpenCooperationModal}>
              🤝 发起合作
            </View>
            <View className={styles.btnPrimary} onClick={handleContact}>
              💬 私信
            </View>
          </>
        ) : (
          <View className={styles.btnPrimary} onClick={handleContact}>
            💬 私信联系
          </View>
        )}
      </View>

      {showCooperationModal && (
        <View className={styles.modalOverlay} onClick={() => setShowCooperationModal(false)}>
          <View className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <Text className={styles.modalTitle}>发起合作单</Text>
            <Text className={styles.modalSubtitle}>请确认本次约拍合作的详细信息</Text>

            <View className={styles.formRow}>
              <Text className={styles.formLabel}>合作日期</Text>
              <Input
                className={styles.formInput}
                placeholder="如：2026-06-15"
                value={coopDate}
                onInput={(e) => setCoopDate(e.detail.value)}
              />
            </View>
            <View className={styles.formRow}>
              <Text className={styles.formLabel}>集合时间</Text>
              <Input
                className={styles.formInput}
                placeholder="如：09:00-12:00"
                value={coopTime}
                onInput={(e) => setCoopTime(e.detail.value)}
              />
            </View>
            <View className={styles.formRow}>
              <Text className={styles.formLabel}>集合地点</Text>
              <Input
                className={styles.formInput}
                placeholder="请输入详细地址"
                value={coopLocation}
                onInput={(e) => setCoopLocation(e.detail.value)}
              />
            </View>
            <View className={styles.formRow}>
              <Text className={styles.formLabel}>合作预算</Text>
              <Input
                className={styles.formInput}
                placeholder="如：¥300/人"
                value={coopBudget}
                onInput={(e) => setCoopBudget(e.detail.value)}
              />
            </View>

            <View className={styles.modalActions}>
              <View className={styles.modalBtnCancel} onClick={() => setShowCooperationModal(false)}>
                取消
              </View>
              <View className={styles.modalBtnConfirm} onClick={handleCreateCooperation}>
                发起合作
              </View>
            </View>
          </View>
        </View>
      )}

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
