import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

const ShootingPublishPage: React.FC = () => {
  return (
    <View className={styles.page}>
      <Text className={styles.icon}>📝</Text>
      <Text className={styles.title}>发布约拍</Text>
      <Text className={styles.desc}>功能正在开发中...</Text>
    </View>
  );
};

export default ShootingPublishPage;
