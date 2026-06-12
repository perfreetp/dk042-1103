import React, { useState, useMemo } from 'react';
import { View, Text, Input, Textarea } from '@tarojs/components';
import Taro, { navigateBack, showToast } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useAppStore } from '@/store';
import {
  CITIES,
  SHOOTING_TYPE_MAP,
  DYNASTY_MAP
} from '@/types';
import type { ShootingType, DynastyStyle } from '@/types';

const TYPE_ICONS: Record<ShootingType, string> = {
  photographer: '📷',
  makeupArtist: '💄',
  model: '👗'
};

const HOT_CITIES = ['北京', '上海', '广州', '深圳', '杭州', '成都', '南京', '西安'];

const ShootingPublishPage: React.FC = () => {
  const addShooting = useAppStore((s) => s.addShooting);

  const [type, setType] = useState<ShootingType>('photographer');
  const [title, setTitle] = useState('');
  const [city, setCity] = useState('');
  const [date, setDate] = useState('');
  const [budget, setBudget] = useState('');
  const [style, setStyle] = useState<DynastyStyle>('tang');
  const [description, setDescription] = useState('');

  const canSubmit = useMemo(() => {
    return title.trim() && city.trim() && date.trim() && budget.trim() && description.trim();
  }, [title, city, date, budget, description]);

  const handleSubmit = () => {
    if (!canSubmit) {
      showToast({ title: '请填写完整信息', icon: 'none' });
      return;
    }

    addShooting({
      type,
      title: title.trim(),
      city: city.trim(),
      date: date.trim(),
      budget: budget.trim(),
      style,
      description: description.trim()
    });

    showToast({ title: '发布成功', icon: 'success' });

    setTimeout(() => {
      navigateBack();
    }, 800);
  };

  return (
    <View className={styles.page}>
      <View className={styles.formCard}>
        <Text className={styles.sectionTitle}>选择类型</Text>
        <View className={styles.typeList}>
          {(Object.keys(SHOOTING_TYPE_MAP) as ShootingType[]).map((t) => (
            <View
              key={t}
              className={classnames(styles.typeItem, type === t && styles.typeItemActive)}
              onClick={() => setType(t)}
            >
              <Text className={styles.typeIcon}>{TYPE_ICONS[t]}</Text>
              <Text className={styles.typeLabel}>{SHOOTING_TYPE_MAP[t]}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.formCard}>
        <Text className={styles.sectionTitle}>基本信息</Text>

        <View className={styles.formItem}>
          <Text className={classnames(styles.formLabel, styles.formLabelRequired)}>需求标题</Text>
          <Input
            className={styles.formInput}
            placeholder="一句话描述你的需求"
            value={title}
            onInput={(e) => setTitle(e.detail.value)}
            maxlength={40}
          />
        </View>

        <View className={styles.formItem}>
          <Text className={classnames(styles.formLabel, styles.formLabelRequired)}>所在城市</Text>
          <View className={styles.cityOptions}>
            {HOT_CITIES.map((c) => (
              <View
                key={c}
                className={classnames(styles.cityItem, city === c && styles.cityItemActive)}
                onClick={() => setCity(c)}
              >
                {c}
              </View>
            ))}
          </View>
          <Input
            className={classnames(styles.formInput, {
              [styles.formInputActive]: !!city && !HOT_CITIES.includes(city)
            })}
            placeholder="其他城市请输入..."
            value={HOT_CITIES.includes(city) ? '' : city}
            onInput={(e) => setCity(e.detail.value)}
            style={{ marginTop: '16rpx' }}
          />
        </View>

        <View className={styles.formItem}>
          <Text className={classnames(styles.formLabel, styles.formLabelRequired)}>约拍日期</Text>
          <Input
            className={styles.formInput}
            placeholder="如：2026-06-20 或 长期有效"
            value={date}
            onInput={(e) => setDate(e.detail.value)}
          />
        </View>

        <View className={styles.formItem}>
          <Text className={classnames(styles.formLabel, styles.formLabelRequired)}>预算</Text>
          <Input
            className={styles.formInput}
            placeholder="如：300元、AA制、面议、互免"
            value={budget}
            onInput={(e) => setBudget(e.detail.value)}
          />
        </View>

        <View className={styles.formItem}>
          <Text className={classnames(styles.formLabel, styles.formLabelRequired)}>朝代风格</Text>
          <View className={styles.styleList}>
            {(Object.keys(DYNASTY_MAP) as DynastyStyle[]).map((d) => (
              <View
                key={d}
                className={classnames(styles.styleItem, style === d && styles.styleItemActive)}
                onClick={() => setStyle(d)}
              >
                {DYNASTY_MAP[d]}
              </View>
            ))}
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={classnames(styles.formLabel, styles.formLabelRequired)}>详细说明</Text>
          <Textarea
            className={styles.textarea}
            placeholder="请详细描述你的需求，包括拍摄地点、风格要求、是否提供服装等..."
            value={description}
            onInput={(e) => setDescription(e.detail.value)}
            maxlength={500}
          />
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.btnCancel} onClick={() => navigateBack()}>
          取消
        </View>
        <View
          className={classnames(styles.btnSubmit, !canSubmit && styles.btnDisabled)}
          onClick={handleSubmit}
        >
          发布需求
        </View>
      </View>
    </View>
  );
};

export default ShootingPublishPage;
