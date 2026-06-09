import React, { useMemo } from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import { useAppStore } from '@/store/appStore';
import { formatDate, formatDateTime } from '@/utils';
import PageHeader from '@/components/PageHeader';
import styles from './index.module.scss';

const AlbumDetailPage: React.FC = () => {
  const router = useRouter();
  const albumId = router.params.albumId;
  const productionId = router.params.productionId;

  const { albums, productions, members, getAlbumById, incrementAlbumViews, getProduction } = useAppStore();

  const album = useMemo(() => {
    if (albumId) return albums.find(a => a.id === albumId);
    if (productionId) {
      const prod = productions.find(p => p.id === productionId);
      if (prod?.albumId) return albums.find(a => a.id === prod.albumId);
    }
    return albums.find(a => a.productionId === productionId);
  }, [albumId, productionId, albums, productions]);

  const production = useMemo(() => {
    if (!album) return undefined;
    if (album.productionId) return productions.find(p => p.id === album.productionId);
    if (productionId) return productions.find(p => p.id === productionId);
    return undefined;
  }, [album, productionId, productions]);

  const confirmedMembers = members.filter(m => album?.confirmedMemberIds?.includes(m.id));
  const pendingMembers = members.filter(m => !album?.confirmedMemberIds?.includes(m.id));

  if (!album) {
    return (
      <View className="pageContainer">
        <PageHeader title="回忆相册" subtitle="相册不存在" />
        <View style={{ textAlign: 'center', padding: '120rpx 0' }}>
          <Text style={{ fontSize: '80rpx', display: 'block', marginBottom: '24rpx' }}>📖</Text>
          <Text style={{ fontSize: '28rpx', color: '#94A3B8' }}>相册不存在或已被删除</Text>
        </View>
      </View>
    );
  }

  const handleCopyLink = () => {
    if (album.shareLink) {
      incrementAlbumViews(album.id);
      Taro.setClipboardData({
        data: album.shareLink,
        success: () => {
          Taro.showToast({ title: '链接已复制', icon: 'success' });
        }
      });
    }
  };

  const handleViewVideo = () => {
    if (production) {
      Taro.navigateTo({ url: `/pages/publish/index?id=${production.id}` });
    }
  };

  return (
    <View className="pageContainer">
      <PageHeader title="回忆相册" subtitle={`${album.photos.length} 张照片`} />

      <View className={styles.coverSection}>
        <Image className={styles.coverImage} src={album.coverUrl} mode="aspectFill" />
        <View className={styles.coverOverlay}>
          <Text className={styles.coverTitle}>{album.title}</Text>
          <View className={styles.coverMeta}>
            <Text className={styles.coverMetaText}>{formatDate(album.createdAt, 'YYYY-MM-DD')}</Text>
            <Text className={styles.coverMetaText}>·</Text>
            <Text className={styles.coverMetaText}>{album.views} 次浏览</Text>
          </View>
        </View>
      </View>

      <View className={styles.infoCard}>
        <View className={styles.shareRow}>
          <View className={styles.shareInfo}>
            <Text className={styles.shareLabel}>🔗 分享链接</Text>
            <Text className={styles.shareLink}>{album.shareLink}</Text>
          </View>
          <Button className={styles.shareBtn} onClick={handleCopyLink}>
            <Text className={styles.shareBtnText}>复制</Text>
          </Button>
        </View>

        <View className={styles.statsRow}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{album.photos.length}</Text>
            <Text className={styles.statLabel}>张照片</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{confirmedMembers.length}</Text>
            <Text className={styles.statLabel}>人确认</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{album.views}</Text>
            <Text className={styles.statLabel}>次浏览</Text>
          </View>
        </View>
      </View>

      {production ? (
        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>🎬 对应视频</Text>
          </View>
          <View className={styles.videoCard} onClick={handleViewVideo}>
            <View className={styles.videoCover}>
              <Image className={styles.videoCoverImage} src={production.coverUrl} mode="aspectFill" />
              <View className={styles.videoPlayIcon}>
                <Text className={styles.videoPlayIconText}>▶</Text>
              </View>
            </View>
            <View className={styles.videoInfo}>
              <Text className={styles.videoTitle}>{production.title}</Text>
              <Text className={styles.videoMeta}>
                {production.duration} · {formatDateTime(production.createdAt)}
              </Text>
              <View className={styles.videoTagRow}>
                {production.hasWatermark && <Text className={styles.videoTag}>💧 水印</Text>}
                {production.hasSubtitles && <Text className={styles.videoTag}>📝 字幕</Text>}
                {production.hasStickers && <Text className={styles.videoTag}>📍 贴纸</Text>}
                {production.musicName && <Text className={styles.videoTag}>🎵 {production.musicName}</Text>}
              </View>
            </View>
          </View>
        </View>
      ) : (
        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>🎬 对应视频</Text>
          </View>
          <View className={styles.emptyVideo}>
            <Text className={styles.emptyIcon}>🎥</Text>
            <Text className={styles.emptyText}>此相册暂无对应视频</Text>
          </View>
        </View>
      )}

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>🖼️ 照片素材</Text>
          <Text className={styles.sectionCount}>共 {album.photos.length} 张</Text>
        </View>
        <View className={styles.photoGrid}>
          {album.photos.map((photo, idx) => (
            <View key={idx} className={styles.photoItem}>
              <Image className={styles.photoImage} src={photo} mode="aspectFill" />
            </View>
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>
            👥 成员确认 ({confirmedMembers.length}/{members.length})
          </Text>
        </View>
        <View className={styles.membersSection}>
          <View className={styles.membersGrid}>
            {confirmedMembers.map(m => (
              <View key={m.id} className={styles.memberItem}>
                <Image
                  className={classnames(styles.memberAvatar, styles.confirmed)}
                  src={m.avatar}
                  mode="aspectFill"
                />
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
                <Text className={classnames(styles.memberStatus, styles.pending)}>待确认</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

export default AlbumDetailPage;
