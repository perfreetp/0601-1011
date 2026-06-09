import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAppStore } from '@/store/appStore';
import { mockMusicTracks } from '@/data/material';
import { formatDateTime, getCategoryLabel } from '@/utils';
import PageHeader from '@/components/PageHeader';
import ProductionCard from '@/components/ProductionCard';
import styles from './index.module.scss';

const getMusicName = (musicId?: string, musicName?: string) => {
  if (musicName) return musicName;
  if (!musicId) return '';
  return mockMusicTracks.find(m => m.id === musicId)?.name || '';
};

const ProductionPage: React.FC = () => {
  const { productions, selectedMaterials, drafts } = useAppStore();

  const handleCreate = () => {
    if (selectedMaterials.length === 0) {
      Taro.showToast({ title: '请先在素材页选择素材', icon: 'none' });
      setTimeout(() => {
        Taro.switchTab({ url: '/pages/material/index' });
      }, 1500);
      return;
    }
    Taro.navigateTo({ url: '/pages/publish/index' });
  };

  const handleEditDraft = (draftId: string) => {
    Taro.navigateTo({ url: `/pages/draft-detail/index?draftId=${draftId}` });
  };

  const features = [
    { icon: '✂️', name: '智能防抖', desc: '自动检测并裁剪抖动片段' },
    { icon: '🎵', name: '智能配乐', desc: '匹配旅行风格背景音乐' },
    { icon: '📝', name: '自动字幕', desc: 'AI识别语音生成字幕' },
    { icon: '🎨', name: '路线贴纸', desc: '添加行程地点标记' },
    { icon: '🖼️', name: '封面选择', desc: '智能推荐精彩帧' },
    { icon: '💧', name: '队名水印', desc: '添加团队专属标识' }
  ];

  const tools = [
    { icon: '📹', name: '视频防抖优化', desc: '一键稳定抖动的视频片段' },
    { icon: '👥', name: '多人素材合并', desc: '智能合并所有成员的素材' },
    { icon: '📱', name: '竖版视频导出', desc: '导出9:16竖屏短视频' },
    { icon: '💾', name: '草稿保存', desc: '随时保存编辑进度' }
  ];

  return (
    <View className="pageContainer">
      <PageHeader
        title="自动成片"
        subtitle="AI 智能剪辑，一键生成旅行大片"
      />

      <View className={styles.createCard} onClick={handleCreate}>
        <View className={styles.createInfo}>
          <Text className={styles.createTitle}>🎬 创建新视频</Text>
          <Text className={styles.createDesc}>
            {selectedMaterials.length > 0
              ? `已选择 ${selectedMaterials.length} 个素材，点击开始创作`
              : '前往素材页选择照片和视频'
            }
          </Text>
        </View>
        <View className={styles.createBtn}>
          <Text className={styles.createIcon}>+</Text>
        </View>
      </View>

      <Text className={styles.sectionTitle}>✨ 智能功能</Text>
      <View className={styles.featureGrid}>
        {features.map(f => (
          <View key={f.name} className={styles.featureCard}>
            <Text className={styles.featureIcon}>{f.icon}</Text>
            <Text className={styles.featureName}>{f.name}</Text>
            <Text className={styles.featureDesc}>{f.desc}</Text>
          </View>
        ))}
      </View>

      {drafts.length > 0 && (
        <View className={styles.draftsSection}>
          <Text className={styles.sectionTitle}>📝 编辑草稿 ({drafts.length})</Text>
          <View className={styles.draftList}>
            {drafts.map(draft => (
              <View
                key={draft.id}
                className={styles.draftItem}
                onClick={() => handleEditDraft(draft.id)}
              >
                <Image className={styles.draftThumb} src={draft.thumbnail} mode="aspectFill" />
                <View className={styles.draftContent}>
                  <Text className={styles.draftTitle}>{draft.title}</Text>
                  <View className={styles.draftMeta}>
                    <Text className={styles.draftTime}>{formatDateTime(draft.updatedAt)}</Text>
                    <Text className={styles.draftTime}>· {draft.materialCount} 素材</Text>
                    {getMusicName(draft.musicId, draft.musicName) && <Text className={styles.draftTime}>· 🎵 {getMusicName(draft.musicId, draft.musicName)}</Text>}
                  </View>
                  <View className={styles.draftTags}>
                    {draft.teamWatermark && <Text className={styles.draftTag}>💧 水印</Text>}
                    {draft.autoSubtitles && <Text className={styles.draftTag}>📝 字幕</Text>}
                    {draft.routeStickers && <Text className={styles.draftTag}>📍 贴纸</Text>}
                    {draft.confirmedMemberIds.length > 0 && (
                      <Text className={styles.draftTag}>👥 {draft.confirmedMemberIds.length}人确认</Text>
                    )}
                  </View>
                  <View className={styles.progressBar}>
                    <View className={styles.progressFill} style={{ width: `${draft.progress}%` }} />
                  </View>
                  <Text className={styles.progressHint}>点击继续编辑 · 进度 {draft.progress}%</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      <Text className={styles.sectionTitle}>🎥 我的作品 ({productions.length})</Text>
      {productions.length > 0 ? (
        <View className={styles.productionsGrid}>
          {productions.map(p => (
            <ProductionCard
              key={p.id}
              production={p}
              onClick={() => Taro.navigateTo({ url: `/pages/publish/index?id=${p.id}` })}
            />
          ))}
        </View>
      ) : (
        <View style={{ textAlign: 'center', padding: '64rpx 0' }}>
          <Text style={{ fontSize: '60rpx', display: 'block', marginBottom: '16rpx' }}>🎬</Text>
          <Text style={{ fontSize: '26rpx', color: '#94A3B8' }}>还没有作品，开始创作吧</Text>
        </View>
      )}

      <Text className={styles.sectionTitle}>🛠️ 创作工具</Text>
      <View className={styles.toolSection}>
        <View className={styles.toolList}>
          {tools.map(tool => (
            <View key={tool.name} className={styles.toolItem}>
              <Text className={styles.toolIcon}>{tool.icon}</Text>
              <View className={styles.toolInfo}>
                <Text className={styles.toolName}>{tool.name}</Text>
                <Text className={styles.toolDesc}>{tool.desc}</Text>
              </View>
              <Text className={styles.toolArrow}>›</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default ProductionPage;
