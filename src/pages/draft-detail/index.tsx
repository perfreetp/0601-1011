import React, { useMemo } from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import { useAppStore } from '@/store/appStore';
import { formatDateTime } from '@/utils';
import PageHeader from '@/components/PageHeader';
import styles from './index.module.scss';

const DraftDetailPage: React.FC = () => {
  const router = useRouter();
  const draftId = router.params.draftId;

  const { getDraft, members, materials, publishVideo } = useAppStore();
  const draft = getDraft(draftId || '');

  const draftMaterials = useMemo(() => {
    if (!draft) return [];
    return materials.filter(m => draft.materialIds.includes(m.id));
  }, [draft, materials]);

  const displayMaterials = draftMaterials.slice(0, 8);
  const extraCount = Math.max(0, draftMaterials.length - 8);

  const confirmedMembers = members.filter(m => draft?.confirmedMemberIds.includes(m.id));
  const pendingMembers = members.filter(m => !draft?.confirmedMemberIds.includes(m.id));

  if (!draft) {
    return (
      <View className="pageContainer">
        <PageHeader title="草稿详情" subtitle="草稿不存在或已删除" />
        <View style={{ textAlign: 'center', padding: '120rpx 0' }}>
          <Text style={{ fontSize: '80rpx', display: 'block', marginBottom: '24rpx' }}>📝</Text>
          <Text style={{ fontSize: '28rpx', color: '#94A3B8' }}>草稿不存在或已被删除</Text>
        </View>
      </View>
    );
  }

  const handleEdit = () => {
    Taro.navigateTo({ url: `/pages/publish/index?draftId=${draft.id}` });
  };

  const handlePublish = () => {
    Taro.showModal({
      title: '确认发布',
      content: `将直接发布「${draft.title}」并生成对应回忆册，确定发布吗？`,
      success: (res) => {
        if (res.confirm) {
          Taro.showLoading({ title: '正在生成...', mask: true });
          const { productionId, albumId } = publishVideo({
            title: draft.title,
            coverUrl: draft.coverUrl,
            duration: draft.duration,
            materialIds: draft.materialIds,
            materialCount: draft.materialCount,
            musicId: draft.musicId,
            stickerId: draft.stickerId,
            teamWatermark: draft.teamWatermark,
            autoSubtitles: draft.autoSubtitles,
            routeStickers: draft.routeStickers,
            removeShaky: draft.removeShaky,
            mergeMulti: draft.mergeMulti,
            confirmedMemberIds: draft.confirmedMemberIds
          });
          setTimeout(() => {
            Taro.hideLoading();
            Taro.showToast({ title: '发布成功', icon: 'success' });
            setTimeout(() => {
              Taro.redirectTo({ url: `/pages/album-detail/index?albumId=${albumId}&productionId=${productionId}` });
            }, 1000);
          }, 1500);
        }
      }
    });
  };

  return (
    <View className="pageContainer">
      <PageHeader
        title="草稿详情"
        subtitle={`进度 ${draft.progress}% · 上次编辑 ${formatDateTime(draft.updatedAt)}`}
      />

      <View className={styles.previewCard}>
        <Image className={styles.previewImage} src={draft.coverUrl} mode="aspectFill" />
        <View className={styles.previewInfo}>
          <Text className={styles.previewTitle}>{draft.title}</Text>
          <View className={styles.previewMeta}>
            <Text className={styles.previewMetaText}>时长 {draft.duration}</Text>
            <Text className={styles.previewMetaText}>·</Text>
            <Text className={styles.previewMetaText}>{draft.materialCount} 个素材</Text>
            {draft.musicName && (
              <>
                <Text className={styles.previewMetaText}>·</Text>
                <Text className={styles.previewMetaTag}>🎵 {draft.musicName}</Text>
              </>
            )}
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>⚙️ 视频配置</Text>
        <View className={styles.configCard}>
          <View className={styles.configRow}>
            <View className={styles.configInfo}>
              <Text className={styles.configIcon}>🎵</Text>
              <Text className={styles.configLabel}>背景音乐</Text>
            </View>
            <Text className={styles.configValue}>{draft.musicName || '未选择'}</Text>
          </View>

          <View className={styles.configRow}>
            <View className={styles.configInfo}>
              <Text className={styles.configIcon}>📍</Text>
              <Text className={styles.configLabel}>路线贴纸</Text>
            </View>
            <Text className={classnames(draft.routeStickers ? styles.configEnabled : styles.configDisabled)}>
              {draft.routeStickers ? '✓ 已启用' : '未启用'}
            </Text>
          </View>

          <View className={styles.configRow}>
            <View className={styles.configInfo}>
              <Text className={styles.configIcon}>💧</Text>
              <Text className={styles.configLabel}>队名水印</Text>
            </View>
            <Text className={classnames(draft.teamWatermark ? styles.configEnabled : styles.configDisabled)}>
              {draft.teamWatermark ? '✓ 已启用' : '未启用'}
            </Text>
          </View>

          <View className={styles.configRow}>
            <View className={styles.configInfo}>
              <Text className={styles.configIcon}>📝</Text>
              <Text className={styles.configLabel}>自动字幕</Text>
            </View>
            <Text className={classnames(draft.autoSubtitles ? styles.configEnabled : styles.configDisabled)}>
              {draft.autoSubtitles ? '✓ 已启用' : '未启用'}
            </Text>
          </View>

          <View className={styles.configRow}>
            <View className={styles.configInfo}>
              <Text className={styles.configIcon}>✂️</Text>
              <Text className={styles.configLabel}>智能防抖</Text>
            </View>
            <Text className={classnames(draft.removeShaky ? styles.configEnabled : styles.configDisabled)}>
              {draft.removeShaky ? '✓ 已启用' : '未启用'}
            </Text>
          </View>

          <View className={styles.configRow}>
            <View className={styles.configInfo}>
              <Text className={styles.configIcon}>👥</Text>
              <Text className={styles.configLabel}>多人素材合并</Text>
            </View>
            <Text className={classnames(draft.mergeMulti ? styles.configEnabled : styles.configDisabled)}>
              {draft.mergeMulti ? '✓ 已启用' : '未启用'}
            </Text>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>
          🖼️ 视频素材 ({draftMaterials.length})
        </Text>
        <View className={styles.materialGrid}>
          {displayMaterials.map(m => (
            <Image key={m.id} className={styles.materialThumb} src={m.thumbnail} mode="aspectFill" />
          ))}
          {extraCount > 0 && (
            <View className={styles.materialMore}>+{extraCount}</View>
          )}
          {draftMaterials.length === 0 && (
            <View style={{ gridColumn: '1/-1', padding: '48rpx', textAlign: 'center' }}>
              <Text style={{ fontSize: '24rpx', color: '#94A3B8' }}>暂无素材</Text>
            </View>
          )}
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>
          👥 成员确认 ({confirmedMembers.length}/{members.length})
        </Text>
        <View className={styles.membersRow}>
          {confirmedMembers.map(m => (
            <View key={m.id} className={styles.memberItem}>
              <Image className={`${styles.memberAvatar} ${styles.confirmed}`} src={m.avatar} mode="aspectFill" />
              <Text className={styles.memberName}>
                {m.name}
                {m.role === 'leader' && ' 👑'}
              </Text>
              <Text className={styles.memberStatus}>✓ 已确认</Text>
            </View>
          ))}
          {pendingMembers.map(m => (
            <View key={m.id} className={styles.memberItem}>
              <Image className={styles.memberAvatar} src={m.avatar} mode="aspectFill" />
              <Text className={styles.memberName}>
                {m.name}
                {m.role === 'leader' && ' 👑'}
              </Text>
              <Text className={`${styles.memberStatus} ${styles.pending}`}>待确认</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.pageBottomPadding} />

      <View className={styles.bottomBar}>
        <Button className={styles.editBtn} onClick={handleEdit}>
          <Text className={styles.editBtnText}>✏️ 继续编辑</Text>
        </Button>
        <Button className={styles.publishBtn} onClick={handlePublish}>
          <Text className={styles.publishBtnText}>🚀 直接发布</Text>
        </Button>
      </View>
    </View>
  );
};

export default DraftDetailPage;
