import React, { useState, useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import { useAppStore } from '@/store/appStore';
import { ShotItem as ShotItemType } from '@/types';
import PageHeader from '@/components/PageHeader';
import ShotItem from '@/components/ShotItem';
import styles from './index.module.scss';

type FilterType = 'all' | 'pending' | 'completed' | 'high';

const ShotlistPage: React.FC = () => {
  const router = useRouter();
  const { itinerary, updateShotStatus } = useAppStore();
  const [filter, setFilter] = useState<FilterType>('all');

  const dayId = router.params.dayId;
  const pointId = router.params.pointId;

  const currentDay = itinerary.find(d => d.id === dayId) || itinerary[0];

  const allShots = useMemo(() => {
    if (!currentDay) return [];
    const points = pointId
      ? currentDay.points.filter(p => p.id === pointId)
      : currentDay.points;

    return points.flatMap(point =>
      point.shots.map(shot => ({ ...shot, pointId: point.id, pointName: point.name }))
    );
  }, [currentDay, pointId]);

  const filteredShots = useMemo(() => {
    switch (filter) {
      case 'pending':
        return allShots.filter(s => s.status === 'pending');
      case 'completed':
        return allShots.filter(s => s.status === 'completed');
      case 'high':
        return allShots.filter(s => s.priority === 'high' && s.status !== 'completed');
      default:
        return allShots;
    }
  }, [allShots, filter]);

  const stats = useMemo(() => ({
    total: allShots.length,
    completed: allShots.filter(s => s.status === 'completed').length,
    highPriority: allShots.filter(s => s.priority === 'high' && s.status !== 'completed').length
  }), [allShots]);

  const handleStatusChange = (pointId: string, shotId: string, status: 'pending' | 'completed' | 'skipped') => {
    if (currentDay) {
      updateShotStatus(currentDay.id, pointId, shotId, status);
    }
  };

  const filters = [
    { key: 'all' as FilterType, label: '全部' },
    { key: 'pending' as FilterType, label: '待拍' },
    { key: 'high' as FilterType, label: '必拍' },
    { key: 'completed' as FilterType, label: '已拍' }
  ];

  // 按行程点分组展示
  const groupedShots = useMemo(() => {
    const groups: Record<string, { name: string; time: string; shots: typeof filteredShots }> = {};
    filteredShots.forEach(shot => {
      const pid = (shot as any).pointId;
      const point = currentDay?.points.find(p => p.id === pid);
      if (!groups[pid]) {
        groups[pid] = {
          name: (shot as any).pointName,
          time: point?.time || '',
          shots: []
        };
      }
      groups[pid].shots.push(shot);
    });
    return Object.values(groups);
  }, [filteredShots, currentDay]);

  return (
    <View className="pageContainer">
      <PageHeader
        title="拍摄清单"
        subtitle={currentDay?.title || ''}
      />

      <View className={styles.summaryBar}>
        <View className={styles.summaryItem}>
          <Text className={styles.summaryValue}>{stats.total}</Text>
          <Text className={styles.summaryLabel}>总镜头</Text>
        </View>
        <View className={styles.summaryItem}>
          <Text className={styles.summaryValue}>{stats.completed}</Text>
          <Text className={styles.summaryLabel}>已完成</Text>
        </View>
        <View className={styles.summaryItem}>
          <Text className={styles.summaryValue}>{stats.highPriority}</Text>
          <Text className={styles.summaryLabel}>待必拍</Text>
        </View>
      </View>

      <View className={styles.filterTabs}>
        {filters.map(f => (
          <View
            key={f.key}
            className={classnames(styles.filterTab, filter === f.key && styles.active)}
            onClick={() => setFilter(f.key)}
          >
            <Text className={styles.filterTabText}>{f.label}</Text>
          </View>
        ))}
      </View>

      {groupedShots.length > 0 ? (
        groupedShots.map(group => (
          <View key={group.name} className={styles.pointSection}>
            <View className={styles.pointHeader}>
              <View className={styles.pointInfo}>
                <Text className={styles.pointTime}>{group.time}</Text>
                <Text className={styles.pointName}>{group.name}</Text>
              </View>
              <Text className={styles.pointProgress}>
                {group.shots.filter(s => s.status === 'completed').length}/{group.shots.length}
              </Text>
            </View>
            {group.shots.map(shot => (
              <ShotItem
                key={shot.id}
                shot={shot as ShotItemType}
                onStatusChange={(status) => handleStatusChange((shot as any).pointId, shot.id, status)}
              />
            ))}
          </View>
        ))
      ) : (
        <View className={styles.emptyShots}>
          <Text className={styles.emptyIcon}>🎬</Text>
          <Text className={styles.emptyText}>暂无符合条件的镜头</Text>
        </View>
      )}
    </View>
  );
};

export default ShotlistPage;
