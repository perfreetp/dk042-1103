import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, Input, ScrollView, Textarea } from '@tarojs/components';
import {
  useRouter,
  navigateBack,
  showToast,
  makePhoneCall,
  showActionSheet,
  showModal
} from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useAppStore } from '@/store';

const MY_AVATAR = 'https://picsum.photos/id/1005/200/200';

const ChatPage: React.FC = () => {
  const router = useRouter();
  const userId = router.params.id || '1';
  const shootingId = router.params.shootingId || '';

  const user = useAppStore((s) => s.getUserById(userId));
  const shooting = useAppStore((s) => s.getShootingById(shootingId));
  const messages = useAppStore((s) => s.getMessagesWithUser(userId));
  const isBlocked = useAppStore((s) => s.isUserBlocked(userId));
  const isReported = useAppStore((s) => s.isUserReported(userId));
  const sendMessage = useAppStore((s) => s.sendMessage);
  const blockUser = useAppStore((s) => s.blockUser);
  const unblockUser = useAppStore((s) => s.unblockUser);
  const reportUser = useAppStore((s) => s.reportUser);
  const addReviewForUser = useAppStore((s) => s.addReviewForUser);

  const [input, setInput] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewContent, setReviewContent] = useState('');
  const scrollRef = useRef<any>(null);

  const canSend = input.trim().length > 0 && !isBlocked;
  const showReviewBtn = shootingId && messages.length > 0 && !isBlocked;

  const handleSend = () => {
    if (!canSend) return;
    sendMessage(userId, input.trim(), shootingId || undefined);
    setInput('');
  };

  const handleSubmitReview = () => {
    if (!reviewContent.trim()) {
      showToast({ title: '请填写评价内容', icon: 'none' });
      return;
    }
    addReviewForUser(userId, {
      rating: reviewRating,
      content: reviewContent,
      shootingId: shootingId,
      shootingTitle: shooting?.title
    });
    showToast({ title: '评价成功', icon: 'success' });
    setShowReviewModal(false);
    setReviewRating(5);
    setReviewContent('');
  };

  const handleBack = () => {
    navigateBack();
  };

  const handleMore = () => {
    const items = [
      '📞 紧急求助 (110)',
      isReported ? '✓ 已举报' : '⚠️ 举报用户',
      isBlocked ? '取消拉黑' : '🚫 拉黑用户'
    ];

    showActionSheet({
      itemList: items,
      success: (res) => {
        if (res.tapIndex === 0) {
          makePhoneCall({
            phoneNumber: '110',
            fail: () => {
              showToast({ title: '请直接拨打110报警', icon: 'none' });
            }
          });
        } else if (res.tapIndex === 1) {
          if (!isReported) {
            showModal({
              title: '举报用户',
              content: '请确认举报该用户，平台将进行审核处理。',
              confirmColor: '#C81D25',
              success: (r) => {
                if (r.confirm) {
                  reportUser(userId);
                  showToast({ title: '举报已提交', icon: 'success' });
                }
              }
            });
          }
        } else if (res.tapIndex === 2) {
          if (isBlocked) {
            unblockUser(userId);
            showToast({ title: '已取消拉黑', icon: 'success' });
          } else {
            showModal({
              title: '拉黑用户',
              content: '拉黑后将不再收到该用户的消息，确定要拉黑吗？',
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

  if (!user) {
    return (
      <View className={styles.page}>
        <View style={{ padding: 100, textAlign: 'center' }}>
          <Text>用户不存在</Text>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.backBtn} onClick={handleBack}>
          ‹
        </View>
        <Image className={styles.userAvatar} src={user.avatar} mode="aspectFill" />
        <View className={styles.userInfo}>
          <Text className={styles.userName}>{user.nickname}</Text>
          <Text className={classnames(styles.userStatus, styles.statusOnline)}>● 在线</Text>
        </View>
        <View className={styles.moreBtn} onClick={handleMore}>
          ⋯
        </View>
      </View>

      {isBlocked ? (
        <View className={styles.blockedOverlay}>
          <Text className={styles.blockedIcon}>🚫</Text>
          <Text className={styles.blockedText}>
            你已将「{user.nickname}」加入黑名单
            {'\n'}无法发送私信
          </Text>
          <View
            className={styles.unblockBtn}
            onClick={() => {
              unblockUser(userId);
              showToast({ title: '已取消拉黑', icon: 'success' });
            }}
          >
            取消拉黑
          </View>
        </View>
      ) : (
        <>
          <ScrollView scrollY className={styles.chatBody} ref={scrollRef}>
            <View className={styles.safetyReminder}>
              <Text className={styles.safetyTitle}>🔒 线下安全提醒</Text>
              <Text className={styles.safetyText}>
                与同袍线下见面时，请选择公共场所，告知亲友行程，注意人身财产安全。
              </Text>
              <View
                className={styles.safetyPhone}
                onClick={() => {
                  makePhoneCall({
                    phoneNumber: '110',
                    fail: () => showToast({ title: '请直接拨打110', icon: 'none' })
                  });
                }}
              >
                🚨 紧急情况拨打 110
              </View>
            </View>

            {messages.length === 0 && (
              <View className={styles.msgTime}>开始聊天吧～ 记得遵守线下安全规范</View>
            )}

            {messages.map((m, idx) => {
              const isMine = m.senderId === 'me';
              const showTime =
                idx === 0 ||
                new Date(m.time).getTime() - new Date(messages[idx - 1].time).getTime() >
                  5 * 60 * 1000;

              return (
                <React.Fragment key={m.id}>
                  {showTime && <View className={styles.msgTime}>{m.time.slice(5, 16)}</View>}
                  <View className={classnames(styles.msgItem, isMine && styles.msgMine)}>
                    <Image
                      className={styles.msgAvatar}
                      src={isMine ? MY_AVATAR : user.avatar}
                      mode="aspectFill"
                    />
                    <View
                      className={classnames(
                        styles.msgContent,
                        isMine ? styles.msgMineBubble : styles.msgOther
                      )}
                    >
                      {m.content}
                    </View>
                  </View>
                </React.Fragment>
              );
            })}
          </ScrollView>

          {showReviewBtn && (
            <View className={styles.reviewBar}>
              <Text className={styles.reviewHint}>约拍合作完成后，记得给对方一个评价哦~</Text>
              <View
                className={styles.reviewBtn}
                onClick={() => setShowReviewModal(true)}
              >
                ⭐ 评价TA
              </View>
            </View>
          )}

          <View className={styles.inputBar}>
            <Input
              className={styles.textInput}
              placeholder="发送消息..."
              value={input}
              onInput={(e) => setInput(e.detail.value)}
              confirmType="send"
              onConfirm={handleSend}
              maxlength={200}
            />
            <View
              className={classnames(styles.sendBtn, !canSend && styles.sendBtnDisabled)}
              onClick={handleSend}
            >
              发送
            </View>
          </View>
        </>
      )}

      {showReviewModal && (
        <View className={styles.modalOverlay} onClick={() => setShowReviewModal(false)}>
          <View className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <Text className={styles.modalTitle}>评价{user?.nickname}</Text>
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

export default ChatPage;
