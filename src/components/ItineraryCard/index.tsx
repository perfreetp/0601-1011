import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { ItineraryPoint } from '@/types';
import { getPriorityLabel } from '@/utils';
import styles from './index.module.scss';

interface ItineraryCardProps {
  point: ItineraryPoint;
  dayId: string;
  showShotList?: boolean;
  onShotClick?: (pointId: string) => void;
}

const ItineraryCard: React.FC<ItineraryCardProps> = ({ point, dayId, showShotList = false, onShotClick }) => {
  const completedShots = point.shots.filter(s => s.status === 'completed').length;
  const totalShots = point.shots.length;
  const progress = totalShots > 0 ? Math.round((completedShots / totalShots) * 100) : 0;

  const handleClick = () => {
    if (onShotClick) {
      onShotClick(point.id);
    } else {
      Taro.navigateTo({ url: `/pages/shotlist/index?dayId=${dayId}&pointId=${point.id}` });
    }
  };

  return (
    <View className={classnames(styles.card, point.completed && styles.completed)} onClick={handleClick}>
      <View className={styles.cardHeader}>
        <View className={styles.timeBadge}>
          <Text className={styles.timeText}>{point.time}</Text>
        </View>
        <View className={styles.headerContent}>
          <Text className={styles.pointName}>{point.name}</Text>
          <Text className={styles.pointLocation}>📍 {point.location}</Text>
        </View>
        {point.completed && (
          <View className={styles.completedBadge}>
            <Text className={styles.completedText}>✓ 已完成</Text>
          </View>
        )}
      </View>

      <Text className={styles.description}>{point.description}</Text>

      <View className={styles.progressArea}>
        <View className={styles.progressInfo}>
          <Text className={styles.progressLabel}>拍摄进度</Text>
          <Text className={styles.progressValue}>{completedShots}/{totalShots} 镜头</Text>
        </View>
        <View className={styles.progressBar}>
          <View className={styles.progressFill} style={{ width: `${progress}%` }} />
        </View>
      </View>

      {showShotList && point.shots.length > 0 && (
        <View className={styles.shotList}>
          {point.shots.slice(0, 3).map(shot => (
            <View key={shot.id} className={classnames(styles.shotTag, {
              [styles.shotDone]: shot.status === 'completed',
              [styles.shotHigh]: shot.priority === 'high' && shot.status !== 'completed'
            })}>
              <Text className={styles.shotTagText}>
                {shot.status === 'completed' ? '✓ ' : ''}{shot.name}
              </Text>
            </View>
          ))}
          {point.shots.length > 3 && (
            <Text className={styles.moreText}>+{point.shots.length - 3} 更多</Text>
          )}
        </View>
      )}

      {!showShotList && (
        <View className={styles.prioritySummary}>
          {point.shots.some(s => s.priority === 'high' && s.status !== 'completed') && (
            <View className={styles.alertTag}>
              <Text className={styles.alertText}>⚠ {getPriorityLabel('high')}镜头待拍</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default ItineraryCard;
