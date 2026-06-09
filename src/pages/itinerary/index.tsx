import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, Button, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { useAppStore } from '@/store/appStore';
import { formatDate, getDayLabel } from '@/utils';
import PageHeader from '@/components/PageHeader';
import ItineraryCard from '@/components/ItineraryCard';
import MemberAvatar from '@/components/MemberAvatar';
import styles from './index.module.scss';

const ItineraryPage: React.FC = () => {
  const { itinerary, members, teamName, currentDay, setCurrentDay, addDay, addPoint } = useAppStore();

  const [showPointModal, setShowPointModal] = useState(false);
  const [pointName, setPointName] = useState('');
  const [pointLocation, setPointLocation] = useState('');
  const [pointTime, setPointTime] = useState('09:00');
  const [pointDesc, setPointDesc] = useState('');
  const [pointShots, setPointShots] = useState('');

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

  const handleAddDay = () => {
    Taro.showModal({
      title: '新增行程天数',
      editable: true,
      placeholderText: `第${itinerary.length + 1}天（可选填标题）`,
      success: (res) => {
        if (res.confirm) {
          addDay(res.content || undefined);
          Taro.showToast({ title: '已新增一天', icon: 'success' });
          setTimeout(() => {
            setCurrentDay(itinerary.length);
          }, 300);
        }
      }
    });
  };

  const handleOpenPointModal = () => {
    if (!currentDayData) {
      Taro.showToast({ title: '请先选择一天', icon: 'none' });
      return;
    }
    setPointName('');
    setPointLocation('');
    setPointTime('09:00');
    setPointDesc('');
    setPointShots('');
    setShowPointModal(true);
  };

  const handleAddPoint = () => {
    if (!pointName.trim()) {
      Taro.showToast({ title: '请输入地点名称', icon: 'none' });
      return;
    }
    const shotNames = pointShots
      .split(/[,，、\n]/)
      .map(s => s.trim())
      .filter(Boolean);

    addPoint(currentDayData.id, {
      name: pointName.trim(),
      location: pointLocation.trim() || pointName.trim(),
      time: pointTime,
      description: pointDesc.trim(),
      shots: shotNames.length > 0 ? shotNames : ['打卡拍照']
    });

    setShowPointModal(false);
    Taro.showToast({ title: '行程点已添加', icon: 'success' });
  };

  return (
    <View className="pageContainer">
      <PageHeader
        title="行程安排"
        subtitle="稻城亚丁深度游"
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
          <View className={classnames(styles.dayItem, styles.addDayItem)} onClick={handleAddDay}>
            <Text className={styles.dayIndex}>+</Text>
            <Text className={styles.dayDate}>新增</Text>
          </View>
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
            <View className={styles.addPointCard} onClick={handleOpenPointModal}>
              <View className={styles.addPointDot}>
                <Text className={styles.addPointPlus}>+</Text>
              </View>
              <View className={styles.addPointBody}>
                <Text className={styles.addPointTitle}>新增行程点</Text>
                <Text className={styles.addPointDesc}>添加下一个目的地和必拍镜头</Text>
              </View>
            </View>
          </View>
        </View>
      ) : (
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>🗺️</Text>
          <Text className={styles.emptyText}>暂无行程安排，点击上方「+新增」添加第一天</Text>
        </View>
      )}

      {showPointModal && (
        <View className={styles.modalMask} onClick={() => setShowPointModal(false)}>
          <View className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <Text className={styles.modalTitle}>📍 新增行程点</Text>

            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>地点名称 *</Text>
              <Input
                className={styles.formInput}
                value={pointName}
                onInput={(e) => setPointName(e.detail.value)}
                placeholder="例如：洛绒牛场"
              />
            </View>

            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>详细位置</Text>
              <Input
                className={styles.formInput}
                value={pointLocation}
                onInput={(e) => setPointLocation(e.detail.value)}
                placeholder="例如：甘孜州稻城县香格里拉镇"
              />
            </View>

            <View className={styles.formRow}>
              <View className={styles.formGroupHalf}>
                <Text className={styles.formLabel}>抵达时间</Text>
                <Input
                  className={styles.formInput}
                  value={pointTime}
                  onInput={(e) => setPointTime(e.detail.value)}
                  placeholder="HH:mm"
                />
              </View>
            </View>

            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>备注说明</Text>
              <Input
                className={styles.formInput}
                value={pointDesc}
                onInput={(e) => setPointDesc(e.detail.value)}
                placeholder="集合地点、注意事项等"
              />
            </View>

            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>必拍镜头（逗号分隔）</Text>
              <Input
                className={styles.formInput}
                value={pointShots}
                onInput={(e) => setPointShots(e.detail.value)}
                placeholder="例如：大合影, 个人写真, 风景全景"
              />
            </View>

            <View className={styles.modalButtons}>
              <Button className={styles.modalCancel} onClick={() => setShowPointModal(false)}>
                <Text className={styles.modalCancelText}>取消</Text>
              </Button>
              <Button className={styles.modalConfirm} onClick={handleAddPoint}>
                <Text className={styles.modalConfirmText}>添加</Text>
              </Button>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default ItineraryPage;
