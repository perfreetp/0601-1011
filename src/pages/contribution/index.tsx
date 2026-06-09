import React, { useMemo } from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAppStore } from '@/store/appStore';
import PageHeader from '@/components/PageHeader';
import MemberAvatar from '@/components/MemberAvatar';
import styles from './index.module.scss';

const ContributionPage: React.FC = () => {
  const { members, materials, teamName } = useAppStore();

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

  const handleUpload = () => {
    Taro.showToast({ title: '选择照片或视频上传', icon: 'none' });
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
    </View>
  );
};

export default ContributionPage;
