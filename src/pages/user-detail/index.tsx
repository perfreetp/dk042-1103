import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import { useRouter, navigateTo, showToast, showModal, showActionSheet } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useAppStore } from '@/store';
import { DYNASTY_MAP } from '@/types';

const UserDetailPage: React.FC = () => {
  const router = useRouter();
  const userId = router.params.id || '1';

  const user = useAppStore((s) => s.getUserById(userId));
  const isBlocked = useAppStore((s) => s.isUserBlocked(userId));
  const isReported = useAppStore((s) => s.isUserReported(userId));
  const blockUser = useAppStore((s) => s.blockUser);
  const unblockUser = useAppStore((s) => s.unblockUser);
  const reportUser = useAppStore((s) => s.reportUser);

  if (!user) {
    return (
      <View className={styles.page}>
        <View style={{ padding: 100, textAlign: 'center' }}>
          <Text>用户不存在</Text>
        </View>
      </View>
    );
  }

  const handleChat = () => {
    if (isBlocked) {
      showToast({ title: '对方已被拉黑', icon: 'none' });
      return;
    }
    navigateTo({ url: `/pages/chat/index?id=${userId}` });
  };

  const handleMore = () => {
    const items = [
      isReported ? '✓ 已举报' : '举报用户',
      isBlocked ? '取消拉黑' : '拉黑用户'
    ];

    showActionSheet({
      itemList: items,
      success: (res) => {
        if (res.tapIndex === 0) {
          if (!isReported) {
            showModal({
              title: '举报用户',
              content: `确定要举报「${user.nickname}」吗？举报后平台将进行审核。`,
              confirmColor: '#C81D25',
              success: (r) => {
                if (r.confirm) {
                  reportUser(userId);
                  showToast({ title: '举报已提交', icon: 'success' });
                }
              }
            });
          }
        } else if (res.tapIndex === 1) {
          if (isBlocked) {
            unblockUser(userId);
            showToast({ title: '已取消拉黑', icon: 'success' });
          } else {
            showModal({
              title: '拉黑用户',
              content: `拉黑后将不再收到「${user.nickname}」的消息，确定要拉黑吗？`,
              confirmColor: '#C81D25',
              success: (r) => {
                if (r.confirm) {
                  blockUser(userId);
                  showToast({ title: '已加入黑名单', icon: 'success' });
                }
              }
            });
          }
        }
      }
    });
  };

  const avgRating =
    user.reviews.length > 0
      ? (
          user.reviews.reduce((sum, r) => sum + r.rating, 0) / user.reviews.length
        ).toFixed(1)
      : '5.0';

  return (
    <View className={styles.page}>
      <View className={styles.heroBg} />

      <View className={styles.header}>
        <Image className={styles.avatar} src={user.avatar} mode="aspectFill" />
        <View className={styles.nameRow}>
          <Text className={styles.nickname}>{user.nickname}</Text>
          {user.isVerified && <Text className={styles.verifyBadge}>✓ 实名认证</Text>}
        </View>
        <Text className={styles.bio}>{user.bio}</Text>
        <View className={styles.metaRow}>
          <View className={styles.metaItem}>
            <Text className={styles.metaValue}>{avgRating}</Text>
            <Text className={styles.metaLabel}>信誉分</Text>
          </View>
          <View className={styles.metaItem}>
            <Text className={styles.metaValue}>{user.reviews.length}</Text>
            <Text className={styles.metaLabel}>评价数</Text>
          </View>
          <View className={styles.metaItem}>
            <Text className={styles.metaValue}>{user.works.length}</Text>
            <Text className={styles.metaLabel}>作品数</Text>
          </View>
        </View>
      </View>

      <View className={styles.content}>
        {isBlocked && (
          <View className={styles.blockedBanner}>
            <Text className={styles.blockedText}>⚠️ 该用户已被拉黑</Text>
            <View className={styles.unblockBtn} onClick={() => { unblockUser(userId); showToast({ title: '已取消拉黑', icon: 'success' }); }}>
              取消拉黑
            </View>
          </View>
        )}

        <View className={styles.card}>
          <Text className={styles.sectionTitle}>基本信息</Text>
          <View className={styles.infoGrid}>
            <View className={styles.infoCell}>
              <Text className={styles.infoCellLabel}>性别</Text>
              <Text className={styles.infoCellValue}>{user.gender === 'female' ? '女' : '男'}</Text>
            </View>
            <View className={styles.infoCell}>
              <Text className={styles.infoCellLabel}>年龄</Text>
              <Text className={styles.infoCellValue}>{user.age}岁</Text>
            </View>
            <View className={styles.infoCell}>
              <Text className={styles.infoCellLabel}>所在城市</Text>
              <Text className={styles.infoCellValue}>{user.city}</Text>
            </View>
            <View className={styles.infoCell}>
              <Text className={styles.infoCellLabel}>身高</Text>
              <Text className={styles.infoCellValue}>{user.height}cm</Text>
            </View>
            <View className={styles.infoCell}>
              <Text className={styles.infoCellLabel}>体重</Text>
              <Text className={styles.infoCellValue}>{user.weight}kg</Text>
            </View>
            <View className={styles.infoCell}>
              <Text className={styles.infoCellLabel}>三围</Text>
              <Text className={styles.infoCellValue}>
                {user.bust}/{user.waist}/{user.hips}
              </Text>
            </View>
          </View>
        </View>

        <View className={styles.card}>
          <Text className={styles.sectionTitle}>常穿风格</Text>
          <View className={styles.styleTags}>
            {user.usualStyle.map((s) => (
              <View key={s} className={styles.styleTag}>
                {DYNASTY_MAP[s]}
              </View>
            ))}
          </View>
        </View>

        {user.works.length > 0 && (
          <View className={styles.card}>
            <Text className={styles.sectionTitle}>作品展示</Text>
            <View className={styles.worksGrid}>
              {user.works.map((w, i) => (
                <View key={i} className={styles.workItem}>
                  <Image className={styles.workImg} src={w} mode="aspectFill" />
                </View>
              ))}
            </View>
          </View>
        )}

        <View className={styles.card}>
          <Text className={styles.sectionTitle}>可信评价（{user.reviews.length}）</Text>
          {user.reviews.length > 0 ? (
            user.reviews.map((r) => (
              <View key={r.id} className={styles.reviewItem}>
                <View className={styles.reviewHeader}>
                  <Image className={styles.reviewerAvatar} src={r.userAvatar} mode="aspectFill" />
                  <View className={styles.reviewerInfo}>
                    <Text className={styles.reviewerName}>{r.userName}</Text>
                    {r.activityTitle && (
                      <Text className={styles.reviewActivity}>{r.activityTitle}</Text>
                    )}
                  </View>
                  <Text className={styles.reviewRating}>★ {r.rating}</Text>
                </View>
                <Text className={styles.reviewContent}>{r.content}</Text>
                <View style={{ paddingLeft: 80, marginTop: 8 }}>
                  <Text className={styles.reviewTime}>{r.time}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={{ fontSize: 24, color: '#999', textAlign: 'center', padding: 20 }}>
              暂无评价
            </Text>
          )}
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View className={classnames(styles.btnSecondary)} onClick={handleMore}>
          ⋯ 更多
        </View>
        <View
          className={classnames(styles.btnChat, isBlocked && styles.btnDisabled)}
          onClick={handleChat}
        >
          {isBlocked ? '已被拉黑' : '💬 私信联系'}
        </View>
      </View>
    </View>
  );
};

export default UserDetailPage;
