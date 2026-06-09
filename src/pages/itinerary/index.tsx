import React, { useMemo } from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { useAppStore } from '@/store/appStore';
import { formatDate, getDayLabel } from '@/utils';
import PageHeader from '@/components/PageHeader';
import ItineraryCard from '@/components/ItineraryCard';
import MemberAvatar from '@/components/MemberAvatar';
import styles from './index.module.scss';

const ItineraryPage: React.FC = () => {
  const { itinerary, members, teamName, currentDay, setCurrentDay } = useAppStore();

  const stats = useMemo(() => {
    const totalShots = itinerary.reduce((sum, day) =>
      sum + day.points.reduce((s, p) => s + p.shots.length, 0), 0);
    const completedShots = itinerary.reduce((sum, day) =>
      sum + day.points.reduce((s, p) => s + p.shots.filter(sh => sh.status === 'completed').length, 0), 0);
    return {
      totalDays: itinerary.length,
      completedShots,
      pendingShots: totalShots - completedShots
    };
  }, [itinerary]);

  const currentDayData = itinerary[currentDay];
  const displayMembers = members.slice(0, 4);
  const hiddenCount = members.length - displayMembers.length;

  const handleShotList = () => {
    if (currentDayData) {
      Taro.navigateTo({ url: `/pages/shotlist/index?dayId=${currentDayData.id}` });
    }
  };

  const handleContribution = () => {
    Taro.navigateTo({ url: '/pages/contribution/index' });
  };

  return (
    <View className="pageContainer">
      <PageHeader
        title="行程安排"
        subtitle="稻城亚丁 3 日深度游"
      />

      <View className={styles.headerCard}>
        <Text className={styles.teamName}>🏔️ {teamName}</Text>

        <View className={styles.membersRow}>
          <View className={styles.membersStack}>
            {displayMembers.map((member, idx) => (
              <View key={member.id} className="memberStack" style={{ marginLeft: idx === 0 ? 0 : '-20rpx', zIndex: displayMembers.length - idx }}>
                <MemberAvatar member={member} size="md" />
              </View>
            ))}
          </View>
          {hiddenCount > 0 && (
            <View className={styles.moreMembers}>
              <Text className={styles.moreText}>+{hiddenCount}</Text>
            </View>
          )}
        </View>

        <View className={styles.statsRow}>
          <View className={styles.statCard}>
            <Text className={styles.statValue}>{stats.totalDays}</Text>
            <Text className={styles.statLabel}>总天数</Text>
          </View>
          <View className={styles.statCard}>
            <Text className={styles.statValue}>{stats.completedShots}</Text>
            <Text className={styles.statLabel}>已拍摄</Text>
          </View>
          <View className={styles.statCard}>
            <Text className={styles.statValue}>{stats.pendingShots}</Text>
            <Text className={styles.statLabel}>待拍摄</Text>
          </View>
        </View>
      </View>

      <ScrollView className={styles.daySelector} scrollX enableFlex>
        <View className={styles.dayWrapper}>
          {itinerary.map((day, idx) => (
            <View
              key={day.id}
              className={classnames(styles.dayItem, currentDay === idx && styles.active)}
              onClick={() => setCurrentDay(idx)}
            >
              <Text className={styles.dayIndex}>{getDayLabel(day.dayIndex)}</Text>
              <Text className={styles.dayDate}>{formatDate(day.date, 'MM/DD')}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View className={styles.actionBar}>
        <Button className={styles.actionBtn} onClick={handleContribution}>
          <Text className={styles.actionBtnText}>📤 成员投稿</Text>
        </Button>
        <Button className={styles.actionBtnPrimary} onClick={handleShotList}>
          <Text className={styles.actionBtnTextPrimary}>📋 拍摄清单</Text>
        </Button>
      </View>

      {currentDayData ? (
        <View>
          <PageHeader
            title={currentDayData.title}
            subtitle={formatDate(currentDayData.date, 'YYYY年MM月DD日')}
          />

          <View className={styles.timelineContainer}>
            <View className={styles.timelineLine} />
            {currentDayData.points.map(point => (
              <ItineraryCard
                key={point.id}
                point={point}
                dayId={currentDayData.id}
                showShotList
              />
            ))}
          </View>
        </View>
      ) : (
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>🗺️</Text>
          <Text className={styles.emptyText}>暂无行程安排</Text>
        </View>
      )}
    </View>
  );
};

export default ItineraryPage;
