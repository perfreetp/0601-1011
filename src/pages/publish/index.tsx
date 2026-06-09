import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, Input, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import { useAppStore } from '@/store/appStore';
import { mockStickers, mockMusicTracks } from '@/data/material';
import PageHeader from '@/components/PageHeader';
import MemberAvatar from '@/components/MemberAvatar';
import styles from './index.module.scss';

const PublishPage: React.FC = () => {
  const router = useRouter();
  const {
    teamName,
    members,
    selectedMaterials,
    materials,
    saveDraft,
    getDraft,
    getProduction,
    publishVideo
  } = useAppStore();

  const draftId = router.params.draftId;
  const prodId = router.params.id;

  const sourceDraft = draftId ? getDraft(draftId) : undefined;
  const sourceProd = prodId ? getProduction(prodId) : undefined;
  const source = sourceDraft || sourceProd;

  const initialMaterials = source?.materialIds?.length > 0
    ? source.materialIds.filter(id => materials.some(m => m.id === id))
    : selectedMaterials.filter(id => materials.some(m => m.id === id));
  const initialMatCount = initialMaterials.length;

  const matForCover = materials.find(m => initialMaterials.includes(m.id));
  const initialCover = source?.coverUrl || matForCover?.thumbnail || matForCover?.url || 'https://picsum.photos/id/1018/400/700';

  const [title, setTitle] = useState(source?.title || `${teamName}的旅行回忆`);
  const [teamWatermark, setTeamWatermark] = useState(source?.teamWatermark ?? true);
  const [autoSubtitles, setAutoSubtitles] = useState(source?.autoSubtitles ?? true);
  const [routeStickers, setRouteStickers] = useState(source?.routeStickers ?? true);
  const [removeShaky, setRemoveShaky] = useState(source?.removeShaky ?? true);
  const [mergeMulti, setMergeMulti] = useState(source?.mergeMulti ?? true);
  const [selectedMusic, setSelectedMusic] = useState(source?.musicId || mockMusicTracks[0].id);
  const [selectedSticker, setSelectedSticker] = useState(source?.stickerId || mockStickers[0].id);
  const [confirmedMembers, setConfirmedMembers] = useState<string[]>(
    source?.confirmedMemberIds || members.slice(0, 2).map(m => m.id)
  );
  const [coverUrl] = useState(initialCover);
  const [duration] = useState(source?.duration || '2:15');
  const [currentDraftId, setCurrentDraftId] = useState<string | undefined>(draftId);

  const materialCount = initialMatCount;
  const musicTrack = mockMusicTracks.find(m => m.id === selectedMusic);

  const toggleMember = (mid: string) => {
    setConfirmedMembers(prev =>
      prev.includes(mid) ? prev.filter(i => i !== mid) : [...prev, mid]
    );
  };

  const getPublishConfig = () => ({
    title,
    coverUrl,
    duration,
    materialIds: initialMaterials,
    materialCount,
    musicId: selectedMusic,
    musicName: musicTrack?.name,
    stickerId: selectedSticker,
    teamWatermark,
    autoSubtitles,
    routeStickers,
    removeShaky,
    mergeMulti,
    confirmedMemberIds: confirmedMembers
  });

  const handleSave = () => {
    const config = getPublishConfig();
    const id = saveDraft({
      ...config,
      thumbnail: coverUrl
    }, currentDraftId);
    setCurrentDraftId(id);
    Taro.showToast({ title: '草稿已保存', icon: 'success' });
  };

  const handleExport = () => {
    Taro.showLoading({ title: '正在导出竖版视频...', mask: true });
    setTimeout(() => {
      Taro.hideLoading();
      Taro.showToast({ title: '导出成功，已保存到相册', icon: 'success' });
    }, 2000);
  };

  const handlePublish = () => {
    Taro.showModal({
      title: '发布确认',
      content: `将生成「${title}」并同步到回忆册，确定发布吗？`,
      success: (res) => {
        if (res.confirm) {
          Taro.showLoading({ title: '正在生成视频和相册...', mask: true });
          const config = getPublishConfig();
          setTimeout(() => {
            const { productionId, albumId } = publishVideo(config);
            Taro.hideLoading();
            Taro.showToast({ title: '发布成功！', icon: 'success' });
            setTimeout(() => {
              Taro.showModal({
                title: '发布完成',
                content: `视频ID: ${productionId.slice(0, 12)}...\n相册ID: ${albumId.slice(0, 12)}...\n已自动同步到回忆册`,
                showCancel: false,
                success: () => {
                  Taro.switchTab({ url: '/pages/memory/index' });
                }
              });
            }, 800);
          }, 1800);
        }
      }
    });
  };

  return (
    <View className="pageContainer">
      <PageHeader
        title="发布视频"
        subtitle={`已选 ${materialCount} 个素材${sourceDraft ? ' · 继续编辑草稿' : sourceProd ? ' · 查看作品' : ''}`}
      />

      <View className={styles.previewArea}>
        <Image className={styles.previewImage} src={coverUrl} mode="aspectFill" />
        <View className={styles.playBtn}>
          <Text className={styles.playIcon}>▶</Text>
        </View>
        <View className={styles.previewDuration}>
          <Text className={styles.previewDurationText}>{duration}</Text>
        </View>
        <View className={styles.previewOverlay}>
          {teamWatermark && <Text className={styles.previewTeam}>{teamName}</Text>}
          <Text className={styles.previewTitle}>{title}</Text>
        </View>
      </View>

      <ScrollView scrollY style={{ height: 'calc(100vh - 900rpx)' }}>
        <View className={styles.formSection}>
          <Text className={styles.formLabel}>📝 视频标题</Text>
          <Input
            className={styles.formInput}
            value={title}
            onInput={(e) => setTitle(e.detail.value)}
            placeholder="输入视频标题"
            maxlength={50}
          />
        </View>

        <View className={styles.formSection}>
          <Text className={styles.formLabel}>🎵 背景音乐</Text>
          <View className={styles.musicSelector}>
            {mockMusicTracks.slice(0, 3).map(track => (
              <View
                key={track.id}
                className={classnames(styles.musicItem, selectedMusic === track.id && styles.active)}
                onClick={() => setSelectedMusic(track.id)}
              >
                <View className={styles.musicInfo}>
                  <View className={styles.musicPlayIcon}>
                    <Text>{selectedMusic === track.id ? '⏸' : '▶'}</Text>
                  </View>
                  <View>
                    <Text className={styles.musicName}>{track.name}</Text>
                    <Text className={styles.musicArtist}>{track.artist}</Text>
                  </View>
                </View>
                <Text className={styles.musicDuration}>{track.duration}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.formSection}>
          <Text className={styles.formLabel}>🎨 路线贴纸</Text>
          <View className={styles.stickerSelector}>
            {mockStickers.map(s => (
              <View
                key={s.id}
                className={classnames(styles.stickerItem, selectedSticker === s.id && styles.active)}
                onClick={() => setSelectedSticker(s.id)}
              >
                <Text>{s.icon}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.formSection}>
          <Text className={styles.formLabel}>⚙️ 视频设置</Text>

          <View className={styles.switchRow}>
            <View className={styles.switchInfo}>
              <Text className={styles.switchIcon}>💧</Text>
              <View>
                <Text className={styles.switchLabel}>队名水印</Text>
                <Text className={styles.switchValue}>添加「{teamName}」水印</Text>
              </View>
            </View>
            <View
              className={classnames(styles.switchControl, teamWatermark && styles.on)}
              onClick={() => setTeamWatermark(!teamWatermark)}
            >
              <View className={styles.switchThumb} />
            </View>
          </View>

          <View className={styles.switchRow}>
            <View className={styles.switchInfo}>
              <Text className={styles.switchIcon}>📝</Text>
              <View>
                <Text className={styles.switchLabel}>自动字幕</Text>
                <Text className={styles.switchValue}>AI 识别语音生成字幕</Text>
              </View>
            </View>
            <View
              className={classnames(styles.switchControl, autoSubtitles && styles.on)}
              onClick={() => setAutoSubtitles(!autoSubtitles)}
            >
              <View className={styles.switchThumb} />
            </View>
          </View>

          <View className={styles.switchRow}>
            <View className={styles.switchInfo}>
              <Text className={styles.switchIcon}>📍</Text>
              <View>
                <Text className={styles.switchLabel}>路线贴纸</Text>
                <Text className={styles.switchValue}>添加行程地点标记</Text>
              </View>
            </View>
            <View
              className={classnames(styles.switchControl, routeStickers && styles.on)}
              onClick={() => setRouteStickers(!routeStickers)}
            >
              <View className={styles.switchThumb} />
            </View>
          </View>

          <View className={styles.switchRow}>
            <View className={styles.switchInfo}>
              <Text className={styles.switchIcon}>✂️</Text>
              <View>
                <Text className={styles.switchLabel}>智能防抖</Text>
                <Text className={styles.switchValue}>自动裁剪抖动片段</Text>
              </View>
            </View>
            <View
              className={classnames(styles.switchControl, removeShaky && styles.on)}
              onClick={() => setRemoveShaky(!removeShaky)}
            >
              <View className={styles.switchThumb} />
            </View>
          </View>

          <View className={styles.switchRow}>
            <View className={styles.switchInfo}>
              <Text className={styles.switchIcon}>👥</Text>
              <View>
                <Text className={styles.switchLabel}>多人素材合并</Text>
                <Text className={styles.switchValue}>合并所有成员上传的素材</Text>
              </View>
            </View>
            <View
              className={classnames(styles.switchControl, mergeMulti && styles.on)}
              onClick={() => setMergeMulti(!mergeMulti)}
            >
              <View className={styles.switchThumb} />
            </View>
          </View>
        </View>

        <View className={styles.formSection}>
          <Text className={styles.formLabel}>👥 成员确认 ({confirmedMembers.length}/{members.length})</Text>
          <View className={styles.memberList}>
            {members.map(member => {
              const isConfirmed = confirmedMembers.includes(member.id);
              return (
                <View
                  key={member.id}
                  className={classnames(styles.memberConfirmItem, isConfirmed && styles.confirmed)}
                  onClick={() => toggleMember(member.id)}
                >
                  <Image
                    className={styles.memberConfirmAvatar}
                    src={member.avatar}
                    mode="aspectFill"
                  />
                  <Text className={styles.memberConfirmName}>
                    {member.name}
                    {member.role === 'leader' && ' 👑'}
                  </Text>
                  <Text className={classnames(
                    styles.memberConfirmStatus,
                    !isConfirmed && styles.pending
                  )}>
                    {isConfirmed ? '✓ 已确认' : '待确认'}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <View className={styles.pageBottomPadding} />
      </ScrollView>

      <View className={styles.bottomBar}>
        <Button className={styles.saveBtn} onClick={handleSave}>
          <Text className={styles.saveBtnText}>💾 保存草稿</Text>
        </Button>
        <Button className={styles.exportBtn} onClick={handleExport}>
          <Text className={styles.exportBtnText}>📱 导出视频</Text>
        </Button>
        <Button className={styles.publishBtn} onClick={handlePublish}>
          <Text className={styles.publishBtnText}>🚀 发布</Text>
        </Button>
      </View>
    </View>
  );
};

export default PublishPage;
