import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import { ShotItem as ShotItemType } from '@/types';
import { getPriorityLabel } from '@/utils';
import styles from './index.module.scss';

interface ShotItemProps {
  shot: ShotItemType;
  onStatusChange?: (status: 'pending' | 'completed' | 'skipped') => void;
}

const ShotItemComponent: React.FC<ShotItemProps> = ({ shot, onStatusChange }) => {
  return (
    <View className={classnames(styles.item, styles[`status-${shot.status}`])}>
      <View className={styles.leftSection}>
        <View
          className={classnames(styles.radio, {
            [styles.radioCompleted]: shot.status === 'completed',
            [styles.radioSkipped]: shot.status === 'skipped'
          })}
          onClick={() => onStatusChange && onStatusChange(shot.status === 'completed' ? 'pending' : 'completed')}
        >
          {shot.status === 'completed' && <Text className={styles.radioIcon}>✓</Text>}
          {shot.status === 'skipped' && <Text className={styles.radioIcon}>—</Text>}
        </View>

        <View className={styles.content}>
          <View className={styles.nameRow}>
            <Text className={styles.name}>{shot.name}</Text>
            {shot.priority === 'high' && (
              <View className={styles.priorityTag}>
                <Text className={styles.priorityText}>{getPriorityLabel(shot.priority)}</Text>
              </View>
            )}
          </View>
          <Text className={styles.description}>{shot.description}</Text>
        </View>
      </View>

      <View className={styles.actions}>
        <View
          className={classnames(styles.actionBtn, styles.actionSkip, shot.status === 'skipped' && styles.actionActive)}
          onClick={() => onStatusChange && onStatusChange(shot.status === 'skipped' ? 'pending' : 'skipped')}
        >
          <Text className={styles.actionText}>跳过</Text>
        </View>
      </View>
    </View>
  );
};

export default ShotItemComponent;
