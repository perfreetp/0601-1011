import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import classnames from 'classnames';
import { Production } from '@/types';
import { getStatusLabel } from '@/utils';
import styles from './index.module.scss';

interface ProductionCardProps {
  production: Production;
  onClick?: (production: Production) => void;
}

const ProductionCard: React.FC<ProductionCardProps> = ({ production, onClick }) => {
  const handleClick = () => {
    if (onClick) onClick(production);
  };

  return (
    <View className={styles.card} onClick={handleClick}>
      <View className={styles.coverWrapper}>
        <Image
          className={styles.cover}
          src={production.coverUrl}
          mode="aspectFill"
        />
        <View className={styles.durationBadge}>
          <Text className={styles.durationText}>{production.duration}</Text>
        </View>
        <View className={classnames(styles.statusBadge, styles[`status-${production.status}`])}>
          <Text className={styles.statusText}>{getStatusLabel(production.status)}</Text>
        </View>
      </View>

      <View className={styles.content}>
        <Text className={styles.title}>{production.title}</Text>
        <View className={styles.metaRow}>
          <Text className={styles.metaText}>{production.materialCount} 素材</Text>
          {production.musicName && (
            <Text className={styles.metaText}>🎵 {production.musicName}</Text>
          )}
        </View>
        <View className={styles.features}>
          {production.hasWatermark && (
            <View className={styles.featureTag}>
              <Text className={styles.featureText}>水印</Text>
            </View>
          )}
          {production.hasSubtitles && (
            <View className={styles.featureTag}>
              <Text className={styles.featureText}>字幕</Text>
            </View>
          )}
          {production.hasStickers && (
            <View className={styles.featureTag}>
              <Text className={styles.featureText}>贴纸</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default ProductionCard;
