import React, { useState } from 'react';
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
  const { teamName, members, selectedMaterials, productions } = useAppStore();
  const id = router.params.id;

  const production = id ? productions.find(p => p.id === id) : null;

  const [title, setTitle] = useState(production?.title || `${teamName}的旅行回忆`);
  const [teamWatermark, setTeamWatermark] = useState(true);
  const [autoSubtitles, setAutoSubtitles] = useState(true);
  const [routeStickers, setRouteStickers] = useState(true);
  const [removeShaky, setRemoveShaky] = useState(true);
  const [mergeMulti, setMergeMulti] = useState(true);
  const [selectedMusic, setSelectedMusic] = useState(mockMusicTracks[0].id);
  const [selectedSticker, setSelectedSticker] = useState(mockStickers[0].id);

  const confirmedMembers = members.slice(0, 4).map(m => m.id);
  const coverUrl = production?.coverUrl || 'https://picsum.photos/id/1018/400/700';
  const duration = production?.duration || '2:15';
  const materialCount = production?.materialCount || selectedMaterials.length || 12;

  const handleSave = () => {
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
      content: '发布后将通知所有成员确认，确定发布吗？',
      success: (res) => {
        if (res.confirm) {
          Taro.showLoading({ title: '正在发布...', mask: true });
          setTimeout(() => {
            Taro.hideLoading();
            Taro.showToast({ title: '发布成功！', icon: 'success' });
            setTimeout(() => {
              Taro.switchTab({ url: '/pages/memory/index' });
            }, 1500);
          }, 2000);
        }
      }
    });
  };

  return (
    <View className="pageContainer">
      <PageHeader
        title="发布视频"
        subtitle={`已选 ${materialCount} 个素材`}
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
          <Text className={styles.previewTeam}>{teamName}</Text>
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
                className={styles.musicItem}
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
            {members.map(member => (
              <View key={member.id} className={styles.memberConfirmItem}>
                <Image
                  className={styles.memberConfirmAvatar}
                  src={member.avatar}
                  mode="aspectFill"
                />
                <Text className={classnames(
                  styles.memberConfirmStatus,
                  !confirmedMembers.includes(member.id) && styles.pending
                )}>
                  {confirmedMembers.includes(member.id) ? '✓ 已确认' : '待确认'}
                </Text>
              </View>
            ))}
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
