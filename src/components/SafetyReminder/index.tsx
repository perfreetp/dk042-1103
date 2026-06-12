import React, { useState } from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';

interface SafetyReminderProps {
  show?: boolean;
  onClose?: () => void;
}

const SafetyReminder: React.FC<SafetyReminderProps> = ({ show = true, onClose }) => {
  const [visible, setVisible] = useState(show);
  const [expanded, setExpanded] = useState(false);

  if (!visible) return null;

  const handleClose = () => {
    console.log('[SafetyReminder] 关闭安全提醒');
    setVisible(false);
    onClose?.();
  };

  const handleEmergency = () => {
    console.log('[SafetyReminder] 紧急求助');
    Taro.makePhoneCall({
      phoneNumber: '110'
    }).catch((err) => {
      console.error('[SafetyReminder] 拨打电话失败:', err);
      Taro.showToast({
        title: '请手动拨打110',
        icon: 'none'
      });
    });
  };

  const tips = [
    '线下见面请选择公共场所，避免偏僻地点',
    '建议告知亲友出行信息，保持联系畅通',
    '首次见面建议结伴而行，不要单独赴约',
    '注意个人财物安全，不要随身携带贵重物品',
    '如遇危险，请立即拨打110报警求助',
    '平台仅提供信息发布，不承担线下交往责任'
  ];

  return (
    <View className={classnames(styles.container, expanded && styles.expanded)}>
      <View className={styles.header} onClick={() => setExpanded(!expanded)}>
        <View className={styles.icon}>!</View>
        <Text className={styles.title}>安全提醒</Text>
        <Text className={styles.toggle}>{expanded ? '收起' : '展开'}</Text>
      </View>

      {expanded && (
        <View className={styles.content}>
          <View className={styles.tips}>
            {tips.map((tip, index) => (
              <View key={index} className={styles.tipItem}>
                <Text className={styles.tipDot}>•</Text>
                <Text className={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>

          <View className={styles.actions}>
            <Button className={classnames(styles.btn, styles.emergencyBtn)} onClick={handleEmergency}>
              紧急求助 110
            </Button>
            <Button className={classnames(styles.btn, styles.closeBtn)} onClick={handleClose}>
              我知道了
            </Button>
          </View>
        </View>
      )}
    </View>
  );
};

export default SafetyReminder;
