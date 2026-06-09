import React, { useMemo, useState } from 'react';
import { View, Text, Image, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { useAppStore } from '@/store/appStore';
import { MaterialCategory, MaterialType } from '@/types';
import PageHeader from '@/components/PageHeader';
import MemberAvatar from '@/components/MemberAvatar';
import styles from './index.module.scss';

interface PicPoolItem { id: number; cat: MaterialCategory }

const PICSUM_POOL: PicPoolItem[] = [
  { id: 1027, cat: 'portrait' },
  { id: 1062, cat: 'portrait' },
  { id: 1074, cat: 'portrait' },
  { id: 177, cat: 'group' },
  { id: 338, cat: 'group' },
  { id: 64, cat: 'group' },
  { id: 1015, cat: 'landscape' },
  { id: 1018, cat: 'landscape' },
  { id: 1036, cat: 'landscape' },
  { id: 1039, cat: 'landscape' },
  { id: 1043, cat: 'landscape' },
  { id: 1044, cat: 'landscape' },
  { id: 106, cat: 'other' },
  { id: 122, cat: 'other' },
  { id: 152, cat: 'other' },
  { id: 342, cat: 'portrait' },
  { id: 433, cat: 'group' },
  { id: 541, cat: 'group' },
  { id: 1045, cat: 'landscape' },
  { id: 1025, cat: 'landscape' },
  { id: 100, cat: 'landscape' },
  { id: 111, cat: 'other' },
  { id: 129, cat: 'other' },
  { id: 150, cat: 'other' },
];

type Stage = 'home' | 'pick' | 'confirm';

interface PendingMaterial {
  id: string;
  picId?: number;
  type: MaterialType;
  category: MaterialCategory;
  url: string;
  thumbnail: string;
  location: string;
  duration?: number;
}

const ContributionPage: React.FC = () => {
  const { members, materials, teamName, itinerary, addMaterial } = useAppStore();

  const [stage, setStage] = useState<Stage>('home');
  const [selectedPicIds, setSelectedPicIds] = useState<number[]>([]);
  const [pending, setPending] = useState<PendingMaterial[]>([]);

  const leader = members.find(m => m.role === 'leader') || members[0];

  const locationOptions = useMemo(() => {
    const locs = new Set<string>();
    itinerary.forEach(day => day.points.forEach(p => locs.add(p.location)));
    return Array.from(locs).slice(0, 6);
  }, [itinerary]);

  const candidatePhotos = useMemo(() => {
    const shuffled = [...PICSUM_POOL].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 18);
  }, []);

  const memberStats = useMemo(() => (
    members.map(m => ({
      ...m,
      count: materials.filter(mat => mat.uploadedBy === m.id).length
    }))
  ), [members, materials]);

  const totalPhotos = materials.filter(m => m.type === 'photo').length;
  const totalVideos = materials.filter(m => m.type === 'video').length;

  const recentContributions = useMemo(() => (
    memberStats
      .filter(m => m.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  ), [memberStats]);

  const togglePicSelect = (picId: number) => {
    setSelectedPicIds(prev =>
      prev.includes(picId)
        ? prev.filter(id => id !== picId)
        : [...prev, picId]
    );
  };

  const handleChooseFromAlbum = () => {
    Taro.chooseMedia({
      count: 9,
      mediaType: ['image', 'video'],
      sourceType: ['album'],
      success: (res) => {
        if (!res.tempFiles || res.tempFiles.length === 0) {
          Taro.showToast({ title: '未选择任何素材', icon: 'none' });
          return;
        }
        const defaultLoc = locationOptions[0] || '稻城亚丁';
        const list: PendingMaterial[] = res.tempFiles.map((file, idx) => {
          const rand = Math.random().toString(36).slice(2, 7);
          const fileType = (file as any).fileType || (file as any).mediaType;
          const isVideo = fileType === 'video' || (file as any).duration !== undefined;
          const thumbnail = (file as any).thumbTempFilePath || file.tempFilePath;
          return {
            id: `pending_real_${idx}_${rand}`,
            type: isVideo ? 'video' : 'photo',
            category: 'landscape',
            url: file.tempFilePath,
            thumbnail,
            location: defaultLoc,
            duration: (file as any).duration
          };
        });
        setPending(list);
        setStage('confirm');
      },
      fail: (err) => {
        console.warn('chooseMedia failed, fallback to mock picker:', err);
        setStage('pick');
      }
    });
  };

  const goToConfirm = () => {
    if (selectedPicIds.length === 0) {
      Taro.showToast({ title: '请选择至少1个素材', icon: 'none' });
      return;
    }
    const defaultLoc = locationOptions[0] || '稻城亚丁';
    const list: PendingMaterial[] = selectedPicIds.map(picId => {
      const found = PICSUM_POOL.find(p => p.id === picId);
      const rand = Math.random().toString(36).slice(2, 7);
      return {
        id: `pending_${picId}_${rand}`,
        picId,
        type: Math.random() < 0.7 ? 'photo' : 'video',
        category: found?.cat || 'landscape',
        url: `https://picsum.photos/id/${picId}/800/600`,
        thumbnail: `https://picsum.photos/id/${picId}/400/400`,
        location: defaultLoc
      };
    });
    setPending(list);
    setStage('confirm');
  };

  const updatePending = (pid: string, field: 'location' | 'category' | 'type', value: string) => {
    setPending(prev =>
      prev.map(item =>
        item.id === pid ? { ...item, [field]: value } : item
      )
    );
  };

  const doConfirmUpload = () => {
    let photoCount = 0;
    let videoCount = 0;
    pending.forEach(item => {
      const isVideo = item.type === 'video';
      if (isVideo) {
        videoCount++;
      } else {
        photoCount++;
      }
      addMaterial({
        type: item.type,
        url: item.url,
        thumbnail: item.thumbnail,
        category: item.category,
        location: item.location || '未分类',
        uploadedBy: leader.id,
        duration: isVideo ? (item.duration || Math.floor(Math.random() * 60) + 10) : undefined,
        isShaky: Math.random() < 0.25
      });
    });

    setStage('home');
    setSelectedPicIds([]);
    setPending([]);

    const parts: string[] = [];
    if (photoCount > 0) parts.push(`${photoCount}张`);
    if (videoCount > 0) parts.push(`${videoCount}段`);
    Taro.showToast({
      title: `已上传 ${parts.join('/')} 素材`,
      icon: 'success'
    });

    setTimeout(() => {
      Taro.switchTab({ url: '/pages/material/index' });
    }, 800);
  };

  const handleInvite = () => {
    Taro.showToast({ title: '邀请链接已复制', icon: 'success' });
    Taro.setClipboardData({ data: `https://tripclip.app/invite/${teamName}` });
  };

  const renderHome = () => (
    <>
      <View className={styles.uploadCard} onClick={handleChooseFromAlbum}>
        <Text className={styles.uploadIcon}>📤</Text>
        <Text className={styles.uploadTitle}>上传我的素材</Text>
        <Text className={styles.uploadDesc}>从手机相册选择照片和视频，多选后进入确认上传</Text>
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
    </>
  );

  const renderPick = () => (
    <>
      <PageHeader
        title="选择素材"
        subtitle={`已选 ${selectedPicIds.length} / ${candidatePhotos.length}`}
      />

      <View className={styles.selectHint}>
        <Text className={styles.selectHintText}>
          请从相册多选照片/视频，点击缩略图选中或取消
        </Text>
      </View>

      <View className={styles.pickerGrid}>
        {candidatePhotos.map(item => {
          const selected = selectedPicIds.includes(item.id);
          const catIcon = item.cat === 'portrait'
            ? '👤'
            : item.cat === 'landscape'
            ? '🏔️'
            : item.cat === 'group'
            ? '👥'
            : '📷';
          const orderIdx = selectedPicIds.indexOf(item.id);
          return (
            <View
              key={item.id}
              className={classnames(styles.pickerItem, selected && styles.selected)}
              onClick={() => togglePicSelect(item.id)}
            >
              <Image
                src={`https://picsum.photos/id/${item.id}/400/400`}
                className={styles.pickerImage}
                mode="aspectFill"
              />
              <View className={classnames(styles.pickerBadge, selected && styles.checked)}>
                <Text className={styles.pickerCheck}>✓</Text>
              </View>
              {selected && (
                <View className={styles.pickerIndex}>
                  <Text className={styles.pickerIndexText}>{orderIdx + 1}</Text>
                </View>
              )}
              <View className={styles.pickerType}>
                <Text className={styles.pickerTypeText}>{catIcon}</Text>
              </View>
            </View>
          );
        })}
      </View>

      <View className={styles.pickerBottomBar}>
        <Button
          className={styles.pickerCancelBtn}
          onClick={() => {
            setSelectedPicIds([]);
            setStage('home');
          }}
        >
          <Text className={styles.pickerCancelText}>取消</Text>
        </Button>
        <Button
          className={styles.pickerConfirmBtn}
          onClick={goToConfirm}
        >
          <Text className={styles.pickerConfirmText}>
            下一步 ({selectedPicIds.length})
          </Text>
        </Button>
      </View>
    </>
  );

  const renderConfirm = () => (
    <>
      <PageHeader
        title="确认上传"
        subtitle={`${pending.length} 个素材待上传`}
      />

      <View className={styles.confirmHeader}>
        <Text className={styles.confirmHint}>
          给每个素材补充地点和分类信息，确认后加入团队相册
        </Text>
      </View>

      <ScrollView scrollY className={styles.confirmList}>
        {pending.map((item, idx) => (
          <View key={item.id} className={styles.confirmItem}>
            <Image
              src={item.thumbnail}
              className={styles.confirmThumb}
              mode="aspectFill"
            />

            <View className={styles.confirmInfo}>
              <Text className={styles.confirmIndex}>#{idx + 1}</Text>

              <View className={styles.confirmRow}>
                <Text className={styles.confirmLabel}>类型</Text>
                <View className={styles.confirmTypeRow}>
                  {(['photo', 'video'] as MaterialType[]).map(t => (
                    <Text
                      key={t}
                      className={classnames(styles.typeChip, item.type === t && styles.active)}
                      onClick={() => updatePending(item.id, 'type', t)}
                    >
                      {t === 'photo' ? '🖼️ 照片' : '🎬 视频'}
                    </Text>
                  ))}
                </View>
              </View>

              <View className={styles.confirmRow}>
                <Text className={styles.confirmLabel}>分类</Text>
                <View className={styles.confirmCategoryRow}>
                  {(['portrait', 'landscape', 'group', 'other'] as MaterialCategory[]).map(c => {
                    const label = c === 'portrait'
                      ? '👤 人像'
                      : c === 'landscape'
                      ? '🏔️ 风景'
                      : c === 'group'
                      ? '👥 合影'
                      : '📷 其他';
                    return (
                      <Text
                        key={c}
                        className={classnames(styles.catChip, item.category === c && styles.active)}
                        onClick={() => updatePending(item.id, 'category', c)}
                      >
                        {label}
                      </Text>
                    );
                  })}
                </View>
              </View>

              <View className={styles.confirmRow}>
                <Text className={styles.confirmLabel}>地点</Text>
                <View className={styles.locationRow}>
                  {locationOptions.map(loc => (
                    <Text
                      key={loc}
                      className={classnames(styles.locChip, item.location === loc && styles.active)}
                      onClick={() => updatePending(item.id, 'location', loc)}
                    >
                      {loc}
                    </Text>
                  ))}
                </View>
              </View>
            </View>
          </View>
        ))}
        <View className={styles.confirmPadding} />
      </ScrollView>

      <View className={styles.pickerBottomBar}>
        <Button
          className={styles.pickerCancelBtn}
          onClick={() => setStage('pick')}
        >
          <Text className={styles.pickerCancelText}>返回</Text>
        </Button>
        <Button
          className={styles.pickerConfirmBtn}
          onClick={doConfirmUpload}
        >
          <Text className={styles.pickerConfirmText}>
            确认上传 ({pending.length})
          </Text>
        </Button>
      </View>
    </>
  );

  return (
    <View className="pageContainer">
      {stage === 'home' && (
        <>
          <PageHeader
            title="成员投稿"
            subtitle={`${teamName} · ${members.length} 位成员`}
          />
          {renderHome()}
        </>
      )}

      {stage === 'pick' && renderPick()}
      {stage === 'confirm' && renderConfirm()}
    </View>
  );
};

export default ContributionPage;
