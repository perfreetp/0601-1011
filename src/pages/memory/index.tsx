import React, { useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAppStore } from '@/store/appStore';
import { mockAlbums } from '@/data/memory';
import { generateShareLink } from '@/utils';
import PageHeader from '@/components/PageHeader';
import MemoryCard from '@/components/MemoryCard';
import ProductionCard from '@/components/ProductionCard';
import styles from './index.module.scss';

const MemoryPage: React.FC = () => {
  const { materials, productions } = useAppStore();
  const publishedVideos = productions.filter(p => p.status === 'published');

  const stats = useMemo(() => ({
    photos: materials.filter(m => m.type === 'photo').length,
    videos: materials.filter(m => m.type === 'video').length,
    views: mockAlbums.reduce((sum, a) => sum + a.views, 0)
  }), [materials, mockAlbums]);

  const handleCopyLink = (link: string) => {
    Taro.setClipboardData({
      data: link,
      success: () => Taro.showToast({ title: '链接已复制', icon: 'success' })
    });
  };

  const handleCreateAlbum = () => {
    Taro.showToast({ title: '创建回忆册功能开发中', icon: 'none' });
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
            <Text className={styles.actionDesc}>精选照片生成回忆册</Text>
          </View>
        </View>
        <View className={styles.actionCard} onClick={() => handleCopyLink(generateShareLink('demo'))}>
          <View className={styles.actionIcon}>🔗</View>
          <View className={styles.actionInfo}>
            <Text className={styles.actionName}>分享链接</Text>
            <Text className={styles.actionDesc}>一键分享给队友</Text>
          </View>
        </View>
      </View>

      <View className={styles.sectionHeader}>
        <Text className={styles.sectionTitle}>🖼️ 回忆相册 ({mockAlbums.length})</Text>
        <Text className={styles.sectionAction}>查看全部 ›</Text>
      </View>

      {mockAlbums.length > 0 ? (
        <View className={styles.albumList}>
          {mockAlbums.map(album => (
            <MemoryCard
              key={album.id}
              album={album}
              onClick={(a) => {
                if (a.shareLink) handleCopyLink(a.shareLink);
              }}
            />
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
            <ProductionCard
              key={video.id}
              production={video}
              onClick={() => Taro.navigateTo({ url: `/pages/publish/index?id=${video.id}` })}
            />
          ))}
        </View>
      ) : (
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>🎬</Text>
          <Text className={styles.emptyTitle}>还没有发布视频</Text>
          <Text className={styles.emptyDesc}>去成片页创作你的第一个视频</Text>
        </View>
      )}
    </View>
  );
};

export default MemoryPage;
