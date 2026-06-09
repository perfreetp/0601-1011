import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import classnames from 'classnames';
import { Production, Member } from '@/types';
import { getStatusLabel } from '@/utils';
import styles from './index.module.scss';

interface ProductionCardProps {
  production: Production;
  members?: Member[];
  onClick?: (production: Production) => void;
}

const ProductionCard: React.FC<ProductionCardProps> = ({ production, members = [], onClick }) => {
  const handleClick = () => {
    if (onClick) onClick(production);
  };

  const confirmedMembers = members.filter(m => production.confirmedMemberIds?.includes(m.id));
  const displayMembers = confirmedMembers.slice(0, 3);
  const extraCount = Math.max(0, confirmedMembers.length - 3);

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
        {confirmedMembers.length > 0 && (
          <View className={styles.memberRow}>
            <View className={styles.memberAvatars}>
              {displayMembers.map((m, idx) => (
                <Image
                  key={m.id}
                  className={classnames(styles.memberAvatar, idx > 0 && styles.avatarOverlap)}
                  src={m.avatar}
                  mode="aspectFill"
                  style={{ zIndex: displayMembers.length - idx }}
                />
              ))}
              {extraCount > 0 && (
                <View className={classnames(styles.memberAvatar, styles.avatarExtra, displayMembers.length > 0 && styles.avatarOverlap)}>
                  <Text className={styles.avatarExtraText}>+{extraCount}</Text>
                </View>
              )}
            </View>
            <Text className={styles.memberCount}>{confirmedMembers.length}人确认</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default ProductionCard;
