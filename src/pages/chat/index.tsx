import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

const ChatPage: React.FC = () => {
  return (
    <View className={styles.page}>
      <Text className={styles.icon}>💬</Text>
      <Text className={styles.title}>私信</Text>
      <Text className={styles.desc}>功能正在开发中...</Text>
      <View className={styles.safetyReminder}>
        <Text className={styles.safetyText}>
          🔒 温馨提示：线下见面请选择公共场所，注意人身安全。如遇危险请及时拨打110报警。
        </Text>
      </View>
    </View>
  );
};

export default ChatPage;
