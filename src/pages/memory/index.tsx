import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, Input, Button, Image, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import { useAppStore } from '@/store/appStore';
import PageHeader from '@/components/PageHeader';
import MemoryCard from '@/components/MemoryCard';
import ProductionCard from '@/components/ProductionCard';
import styles from './index.module.scss';

const MemoryPage: React.FC = () => {
  const {
    materials,
    productions,
    albums,
    members,
    teamName,
    selectedMaterials,
    createAlbum,
    incrementAlbumViews,
    latestPublishedAlbumId,
    clearLatestPublishedAlbum
  } = useAppStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [albumTitle, setAlbumTitle] = useState(`${teamName}的旅行相册`);
  const [latestAlbum, setLatestAlbum] = useState<string | null>(null);
  const [highlightAlbumId, setHighlightAlbumId] = useState<string | null>(null);
  const [highlightProdId, setHighlightProdId] = useState<string | null>(null);
  const scrollViewRef = React.useRef<any>(null);

  useDidShow(() => {
    if (latestPublishedAlbumId) {
      const targetAlbum = albums.find(a => a.id === latestPublishedAlbumId);
      setHighlightAlbumId(latestPublishedAlbumId);
      setLatestAlbum(latestPublishedAlbumId);
      if (targetAlbum?.productionId) {
        setHighlightProdId(targetAlbum.productionId);
      }
      setTimeout(() => {
        Taro.pageScrollTo({
          scrollTop: 0,
          duration: 300
        });
      }, 100);
      setTimeout(() => {
        clearLatestPublishedAlbum();
      }, 3000);
    }
  });

  useEffect(() => {
    if (highlightAlbumId) {
      const timer = setTimeout(() => {
        setHighlightAlbumId(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [highlightAlbumId]);

  useEffect(() => {
    if (highlightProdId) {
      const timer = setTimeout(() => {
        setHighlightProdId(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [highlightProdId]);

  const publishedVideos = useMemo(
    () => productions.filter(p => p.status === 'published'),
    [productions]
  );

  const stats = useMemo(() => ({
    photos: materials.filter(m => m.type === 'photo').length,
    videos: materials.filter(m => m.type === 'video').length,
    views: albums.reduce((sum, a) => sum + a.views, 0)
  }), [materials, albums]);

  const handleCopyLink = (link: string, albumId: string) => {
    const album = albums.find(a => a.id === albumId);
    if (album) {
      const prod = productions.find(p => p.id === album.productionId);
      const confirmedCount = album.confirmedMemberIds?.length || 0;
      const videoInfo = prod
        ? `\n🎬 对应视频：${prod.title}（${prod.duration}）`
        : '';
      Taro.showModal({
        title: '📖 分享预览',
        content: `「${album.title}」\n🖼️ ${album.photos.length} 张照片\n👥 ${confirmedCount}/${members.length} 人已确认${videoInfo}\n\n复制链接后可分享给队友查看完整相册`,
        confirmText: '复制链接',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            incrementAlbumViews(albumId);
            Taro.setClipboardData({
              data: link,
              success: () => Taro.showToast({ title: '链接已复制', icon: 'success' })
            });
          }
        }
      });
    } else {
      incrementAlbumViews(albumId);
      Taro.setClipboardData({
        data: link,
        success: () => Taro.showToast({ title: '链接已复制', icon: 'success' })
      });
    }
  };

  const handleCreateAlbum = () => {
    if (materials.length === 0 && selectedMaterials.length === 0) {
      Taro.showToast({ title: '暂无素材可生成相册', icon: 'none' });
      return;
    }
    setAlbumTitle(`${teamName}的旅行相册`);
    setShowCreateModal(true);
  };

  const doCreateAlbum = () => {
    const album = createAlbum({ title: albumTitle.trim() || `${teamName}的旅行相册` });
    setLatestAlbum(album.id);
    setShowCreateModal(false);
    Taro.showModal({
      title: '相册创建成功',
      content: `相册「${album.title}」已创建，包含 ${album.photos.length} 张照片，是否立即复制分享链接？`,
      confirmText: '复制链接',
      success: (res) => {
        if (res.confirm && album.shareLink) {
          handleCopyLink(album.shareLink, album.id);
        }
      }
    });
  };

  const handleQuickShare = () => {
    if (albums.length === 0) {
      Taro.showToast({ title: '还没有相册，先创建一本吧', icon: 'none' });
      return;
    }
    const recent = latestAlbum ? albums.find(a => a.id === latestAlbum) : albums[0];
    if (recent && recent.shareLink) {
      handleCopyLink(recent.shareLink, recent.id);
    }
  };

  const getConfirmedMemberNames = (ids: string[]) => {
    return ids.map(id => members.find(m => m.id === id)?.name).filter(Boolean).join('、');
  };

  return (
    <View className="pageContainer">
      <PageHeader
        title="回忆册"
        subtitle="珍藏每一段美好旅程"
      />

      <View className={styles.statsCard}>
        <Text className={styles.statsTitle}>📚 我的旅行档案</Text>
        <View className={styles.statsGrid}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{stats.photos}</Text>
            <Text className={styles.statLabel}>张照片</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{stats.videos}</Text>
            <Text className={styles.statLabel}>段视频</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{stats.views}</Text>
            <Text className={styles.statLabel}>次浏览</Text>
          </View>
        </View>
      </View>

      <View className={styles.quickActions}>
        <View className={styles.actionCard} onClick={handleCreateAlbum}>
          <View className={styles.actionIcon}>📖</View>
          <View className={styles.actionInfo}>
            <Text className={styles.actionName}>创建相册</Text>
            <Text className={styles.actionDesc}>
              {selectedMaterials.length > 0
                ? `从已选 ${selectedMaterials.length} 个素材生成`
                : '精选照片生成回忆册'
              }
            </Text>
          </View>
        </View>
        <View className={styles.actionCard} onClick={handleQuickShare}>
          <View className={styles.actionIcon}>🔗</View>
          <View className={styles.actionInfo}>
            <Text className={styles.actionName}>分享链接</Text>
            <Text className={styles.actionDesc}>
              {albums.length > 0 ? '一键分享最新相册' : '先创建相册后分享'}
            </Text>
          </View>
        </View>
      </View>

      <View className={styles.sectionHeader}>
        <Text className={styles.sectionTitle}>🖼️ 回忆相册 ({albums.length})</Text>
        <Text className={styles.sectionAction}>查看全部 ›</Text>
      </View>

      {albums.length > 0 ? (
        <View className={styles.albumList}>
          {albums.map(album => (
            <View
              key={album.id}
              className={classnames(highlightAlbumId === album.id && styles.highlightItem)}
            >
              <MemoryCard
                album={album}
                members={members}
                onClick={(a) => {
                  Taro.navigateTo({
                    url: `/pages/album-detail/index?albumId=${a.id}${a.productionId ? `&productionId=${a.productionId}` : ''}`
                  });
                }}
              />
              {highlightAlbumId === album.id && (
                <View className={styles.newBadge}>
                  <Text className={styles.newBadgeText}>✨ 刚发布</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      ) : (
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>📖</Text>
          <Text className={styles.emptyTitle}>还没有回忆相册</Text>
          <Text className={styles.emptyDesc}>创建你的第一本旅行回忆册吧</Text>
        </View>
      )}

      <View className={styles.sectionHeader}>
        <Text className={styles.sectionTitle}>🎬 旅行视频 ({publishedVideos.length})</Text>
        <Text className={styles.sectionAction}>查看全部 ›</Text>
      </View>

      {publishedVideos.length > 0 ? (
        <View className={styles.videoList}>
          {publishedVideos.map(video => (
            <View
              key={video.id}
              className={classnames(highlightProdId === video.id && styles.highlightItem)}
            >
              <ProductionCard
                production={video}
                members={members}
                onClick={() => Taro.navigateTo({
                  url: `/pages/album-detail/index?productionId=${video.id}${video.albumId ? `&albumId=${video.albumId}` : ''}`
                })}
              />
              {highlightProdId === video.id && (
                <View className={styles.newBadge}>
                  <Text className={styles.newBadgeText}>✨ 刚发布</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      ) : (
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>🎬</Text>
          <Text className={styles.emptyTitle}>还没有发布视频</Text>
          <Text className={styles.emptyDesc}>去成片页创作你的第一个视频</Text>
        </View>
      )}

      {showCreateModal && (
        <View className={styles.modalMask} onClick={() => setShowCreateModal(false)}>
          <View className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <Text className={styles.modalTitle}>📖 创建回忆相册</Text>

            <View className={styles.modalPreview}>
              <Text className={styles.modalPreviewLabel}>将包含以下素材：</Text>
              <View className={styles.modalPreviewGrid}>
                {(selectedMaterials.length > 0
                  ? materials.filter(m => selectedMaterials.includes(m.id)).slice(0, 9)
                  : materials.slice(0, 9)
                ).map((m, idx) => (
                  <Image key={m.id + idx} src={m.thumbnail} className={styles.modalPreviewItem} mode="aspectFill" />
                ))}
              </View>
              <Text className={styles.modalPreviewCount}>
                共 {selectedMaterials.length > 0 ? selectedMaterials.length : Math.min(materials.length, 9)} 个素材
              </Text>
            </View>

            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>相册名称</Text>
              <Input
                className={styles.formInput}
                value={albumTitle}
                onInput={(e) => setAlbumTitle(e.detail.value)}
                placeholder="输入相册名称"
                maxlength={30}
              />
            </View>

            <View className={styles.modalButtons}>
              <Button className={styles.modalCancel} onClick={() => setShowCreateModal(false)}>
                <Text className={styles.modalCancelText}>取消</Text>
              </Button>
              <Button className={styles.modalConfirm} onClick={doCreateAlbum}>
                <Text className={styles.modalConfirmText}>创建相册</Text>
              </Button>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default MemoryPage;
