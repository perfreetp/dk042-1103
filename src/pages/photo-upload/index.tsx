import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import { useRouter, navigateBack, showToast } from '@tarojs/taro';
import styles from './index.module.scss';
import { useAppStore } from '@/store';

const SAMPLE_IMAGES = [
  'https://picsum.photos/id/1011/400/400',
  'https://picsum.photos/id/1012/400/400',
  'https://picsum.photos/id/1013/400/400',
  'https://picsum.photos/id/1014/400/400',
  'https://picsum.photos/id/1015/400/400',
  'https://picsum.photos/id/1016/400/400'
];

const PhotoUploadPage: React.FC = () => {
  const router = useRouter();
  const activityId = router.params.id || '1';

  const activity = useAppStore((s) => s.getActivityById(activityId));
  const photos = useAppStore((s) => s.getPhotosByActivityId(activityId));
  const addActivityPhoto = useAppStore((s) => s.addActivityPhoto);

  const handleUpload = () => {
    const randomImg = SAMPLE_IMAGES[Math.floor(Math.random() * SAMPLE_IMAGES.length)];
    addActivityPhoto(activityId, randomImg);
    showToast({ title: '上传成功', icon: 'success' });
  };

  if (!activity) {
    return (
      <View className={styles.page}>
        <View style={{ padding: 100, textAlign: 'center' }}>
          <Text>活动不存在</Text>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.page}>
      <View className={styles.activityInfo}>
        <Image className={styles.cover} src={activity.coverImage} mode="aspectFill" />
        <View className={styles.infoText}>
          <Text className={styles.title}>{activity.title}</Text>
          <Text className={styles.meta}>
            {activity.date} {activity.time}
          </Text>
          <Text className={styles.meta}>{activity.location}</Text>
        </View>
      </View>

      <Text className={styles.sectionTitle}>活动相册（{photos.length}）</Text>

      {photos.length > 0 ? (
        <View className={styles.photoGrid}>
          {photos.map((p) => (
            <View key={p.id} className={styles.photoItem}>
              <Image className={styles.photoImg} src={p.url} mode="aspectFill" />
              <View className={styles.photoInfo}>
                {p.uploaderName} · {p.uploadTime.slice(5, 16)}
              </View>
            </View>
          ))}
          <View className={styles.uploadItem} onClick={handleUpload}>
            <Text className={styles.uploadIcon}>+</Text>
            <Text>上传照片</Text>
          </View>
        </View>
      ) : (
        <>
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📸</Text>
            <Text className={styles.emptyText}>还没有照片</Text>
            <Text className={styles.emptyHint}>快来上传第一张活动照片吧</Text>
          </View>
          <View className={styles.photoGrid}>
            <View className={styles.uploadItem} onClick={handleUpload}>
              <Text className={styles.uploadIcon}>+</Text>
              <Text>上传照片</Text>
            </View>
          </View>
        </>
      )}

      <View className={styles.bottomBar}>
        <View className={styles.btnSecondary} onClick={() => navigateBack()}>
          返回
        </View>
        <View className={styles.btnPrimary} onClick={handleUpload}>
          📷 上传照片
        </View>
      </View>
    </View>
  );
};

export default PhotoUploadPage;
