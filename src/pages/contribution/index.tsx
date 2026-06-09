import React, { useMemo, useState } from 'react';
import { View, Text, Image, Button, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { useAppStore } from '@/store/appStore';
import { MaterialCategory, MaterialType } from '@/types';
import PageHeader from '@/components/PageHeader';
import MemberAvatar from '@/components/MemberAvatar';
import styles from './index.module.scss';

const PICSUM_PORTRAIT = [1027, 1062, 1074, 177, 338, 342, 433, 64, 65, 1005];
const PICSUM_LANDSCAPE = [1015, 1018, 1019, 1025, 1036, 1037, 1039, 1043, 1044, 1045];
const PICSUM_GROUP = [1027, 1083, 1084, 237, 240, 449, 450, 541, 550];
const PICSUM_OTHER = [106, 121, 122, 129, 145, 150, 152, 153, 167];

const randomOf = (arr: number[]) => arr[Math.floor(Math.random() * arr.length)];

const ContributionPage: React.FC = () => {
  const { members, materials, teamName, itinerary, addMaterial } = useAppStore();

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState<MaterialType>('photo');
  const [uploadCategory, setUploadCategory] = useState<MaterialCategory>('landscape');
  const [uploadLocation, setUploadLocation] = useState('');

  const locationOptions = useMemo(() => {
    const locs = new Set<string>();
    itinerary.forEach(day => day.points.forEach(p => locs.add(p.location)));
    return Array.from(locs).slice(0, 6);
  }, [itinerary]);

  const memberStats = useMemo(() => {
    return members.map(m => ({
      ...m,
      count: materials.filter(mat => mat.uploadedBy === m.id).length
    }));
  }, [members, materials]);

  const totalPhotos = materials.filter(m => m.type === 'photo').length;
  const totalVideos = materials.filter(m => m.type === 'video').length;

  const recentContributions = useMemo(() => {
    return memberStats
      .filter(m => m.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [memberStats]);

  const leader = members.find(m => m.role === 'leader') || members[0];

  const handleUpload = () => {
    setUploadType('photo');
    setUploadCategory('landscape');
    setUploadLocation(locationOptions[0] || '');
    setShowUploadModal(true);
  };

  const doUpload = () => {
    const picId = uploadCategory === 'portrait'
      ? randomOf(PICSUM_PORTRAIT)
      : uploadCategory === 'landscape'
      ? randomOf(PICSUM_LANDSCAPE)
      : uploadCategory === 'group'
      ? randomOf(PICSUM_GROUP)
      : randomOf(PICSUM_OTHER);

    const url = `https://picsum.photos/id/${picId}/800/600`;
    const thumbnail = `https://picsum.photos/id/${picId}/400/400`;

    addMaterial({
      type: uploadType,
      url,
      thumbnail,
      category: uploadCategory,
      location: uploadLocation || '未分类',
      uploadedBy: leader.id,
      duration: uploadType === 'video' ? Math.floor(Math.random() * 60) + 10 : undefined,
      isShaky: Math.random() < 0.25
    });

    setShowUploadModal(false);
    Taro.showToast({ title: '上传成功', icon: 'success' });
  };

  const handleBatchUpload = () => {
    const count = Math.floor(Math.random() * 3) + 2;
    for (let i = 0; i < count; i++) {
      const cat: MaterialCategory = (['portrait', 'landscape', 'group', 'other'] as MaterialCategory[])[
        Math.floor(Math.random() * 4)
      ];
      const picId = cat === 'portrait'
        ? randomOf(PICSUM_PORTRAIT)
        : cat === 'landscape'
        ? randomOf(PICSUM_LANDSCAPE)
        : cat === 'group'
        ? randomOf(PICSUM_GROUP)
        : randomOf(PICSUM_OTHER);

      const url = `https://picsum.photos/id/${picId}/800/600`;
      const thumbnail = `https://picsum.photos/id/${picId}/400/400`;
      const t: MaterialType = Math.random() < 0.7 ? 'photo' : 'video';
      const loc = locationOptions[Math.floor(Math.random() * locationOptions.length)] || '未分类';

      addMaterial({
        type: t,
        url,
        thumbnail,
        category: cat,
        location: loc,
        uploadedBy: leader.id,
        duration: t === 'video' ? Math.floor(Math.random() * 60) + 10 : undefined,
        isShaky: Math.random() < 0.25
      });
    }
    setShowUploadModal(false);
    Taro.showToast({ title: `已上传 ${count} 个素材`, icon: 'success' });
  };

  const handleInvite = () => {
    Taro.showToast({ title: '邀请链接已复制', icon: 'success' });
    Taro.setClipboardData({ data: `https://tripclip.app/invite/${teamName}` });
  };

  return (
    <View className="pageContainer">
      <PageHeader
        title="成员投稿"
        subtitle={`${teamName} · ${members.length} 位成员`}
      />

      <View className={styles.uploadCard} onClick={handleUpload}>
        <Text className={styles.uploadIcon}>📤</Text>
        <Text className={styles.uploadTitle}>上传我的素材</Text>
        <Text className={styles.uploadDesc}>支持照片和视频，自动同步到团队相册</Text>
      </View>

      <View className={styles.memberStats}>
        <View className={styles.statCard}>
          <Text className={styles.statValue}>{totalPhotos}</Text>
          <Text className={styles.statLabel}>张照片</Text>
        </View>
        <View className={styles.statCard}>
          <Text className={styles.statValue}>{totalVideos}</Text>
          <Text className={styles.statLabel}>段视频</Text>
        </View>
      </View>

      <View className={styles.membersSection}>
        <Text className={styles.sectionTitle}>👥 团队成员</Text>
        <View className={styles.membersGrid}>
          {members.map(member => {
            const stat = memberStats.find(s => s.id === member.id);
            return (
              <View key={member.id} className={styles.memberItem}>
                <MemberAvatar member={member} size="lg" />
                <Text style={{ fontSize: '24rpx', color: '#64748B', marginTop: '12rpx', textAlign: 'center' }}>
                  {member.name}
                </Text>
                <Text style={{ fontSize: '22rpx', color: '#3B82F6', marginTop: '4rpx', fontWeight: '500' }}>
                  {stat?.count || 0} 素材
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      <View className={styles.recentSection}>
        <Text className={styles.sectionTitle}>🏆 投稿排行</Text>
        <View className={styles.recentList}>
          {recentContributions.length > 0 ? (
            recentContributions.map((member, idx) => (
              <View key={member.id} className={styles.recentItem}>
                <Image className={styles.recentAvatar} src={member.avatar} mode="aspectFill" />
                <View className={styles.recentInfo}>
                  <Text className={styles.recentName}>
                    {idx + 1}. {member.name}
                    {member.role === 'leader' && ' 👑'}
                  </Text>
                  <Text className={styles.recentDesc}>已贡献素材</Text>
                </View>
                <Text className={styles.recentCount}>{member.count} 个</Text>
              </View>
            ))
          ) : (
            <View style={{ padding: '48rpx', textAlign: 'center' }}>
              <Text style={{ fontSize: '26rpx', color: '#94A3B8' }}>暂无投稿记录</Text>
            </View>
          )}
        </View>
      </View>

      <View className={styles.inviteCard}>
        <View className={styles.inviteInfo}>
          <Text className={styles.inviteTitle}>💌 邀请更多成员</Text>
          <Text className={styles.inviteDesc}>分享链接给队友，一起记录旅程</Text>
        </View>
        <Button className={styles.inviteBtn} onClick={handleInvite}>
          <Text className={styles.inviteBtnText}>邀请</Text>
        </Button>
      </View>

      {showUploadModal && (
        <View className={styles.modalMask} onClick={() => setShowUploadModal(false)}>
          <View className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <Text className={styles.modalTitle}>📤 上传素材</Text>

            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>选择类型</Text>
              <View className={styles.segmentRow}>
                <View
                  className={classnames(styles.segmentItem, uploadType === 'photo' && styles.active)}
                  onClick={() => setUploadType('photo')}
                >
                  <Text className={styles.segmentIcon}>🖼️</Text>
                  <Text className={styles.segmentText}>照片</Text>
                </View>
                <View
                  className={classnames(styles.segmentItem, uploadType === 'video' && styles.active)}
                  onClick={() => setUploadType('video')}
                >
                  <Text className={styles.segmentIcon}>🎬</Text>
                  <Text className={styles.segmentText}>视频</Text>
                </View>
              </View>
            </View>

            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>内容分类</Text>
              <View className={styles.segmentRow}>
                {([
                  { k: 'portrait', label: '人像', icon: '👤' },
                  { k: 'landscape', label: '风景', icon: '🏔️' },
                  { k: 'group', label: '合影', icon: '👥' },
                  { k: 'other', label: '其他', icon: '📷' }
                ] as { k: MaterialCategory; label: string; icon: string }[]).map(cat => (
                  <View
                    key={cat.k}
                    className={classnames(styles.segmentItem, uploadCategory === cat.k && styles.active)}
                    onClick={() => setUploadCategory(cat.k)}
                  >
                    <Text className={styles.segmentIcon}>{cat.icon}</Text>
                    <Text className={styles.segmentText}>{cat.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>拍摄地点</Text>
              <View className={styles.locationTags}>
                {locationOptions.length > 0 ? locationOptions.map(loc => (
                  <View
                    key={loc}
                    className={classnames(styles.tagItem, uploadLocation === loc && styles.active)}
                    onClick={() => setUploadLocation(loc)}
                  >
                    <Text className={styles.tagText}>{loc}</Text>
                  </View>
                )) : null}
              </View>
              <Input
                className={styles.formInput}
                value={uploadLocation}
                onInput={(e) => setUploadLocation(e.detail.value)}
                placeholder="或手动输入地点"
              />
            </View>

            <View className={styles.modalButtons}>
              <Button className={styles.modalCancel} onClick={() => setShowUploadModal(false)}>
                <Text className={styles.modalCancelText}>取消</Text>
              </Button>
              <Button className={styles.modalSecondary} onClick={handleBatchUpload}>
                <Text className={styles.modalSecondaryText}>随机批量</Text>
              </Button>
              <Button className={styles.modalConfirm} onClick={doUpload}>
                <Text className={styles.modalConfirmText}>确认上传</Text>
              </Button>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default ContributionPage;
