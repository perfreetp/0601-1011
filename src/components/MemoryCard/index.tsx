import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import classnames from 'classnames';
import { MemoryAlbum, Member } from '@/types';
import { formatDate } from '@/utils';
import styles from './index.module.scss';

interface MemoryCardProps {
  album: MemoryAlbum;
  members?: Member[];
  onClick?: (album: MemoryAlbum) => void;
}

const MemoryCard: React.FC<MemoryCardProps> = ({ album, members = [], onClick }) => {
  const confirmedMembers = members.filter(m => album.confirmedMemberIds?.includes(m.id));
  const displayMembers = confirmedMembers.slice(0, 4);
  const extraCount = Math.max(0, confirmedMembers.length - 4);

  return (
    <View className={styles.card} onClick={() => onClick && onClick(album)}>
      <View className={styles.coverWrapper}>
        <Image className={styles.cover} src={album.coverUrl} mode="aspectFill" />
        <View className={styles.photoCount}>
          <Text className={styles.photoCountText}>📷 {album.photos.length}张</Text>
        </View>
      </View>
      <View className={styles.content}>
        <Text className={styles.title}>{album.title}</Text>
        <View className={styles.metaRow}>
          <Text className={styles.metaText}>{formatDate(album.createdAt, 'MM月DD日')}</Text>
          <Text className={styles.metaText}>👁 {album.views}</Text>
        </View>
        {confirmedMembers.length > 0 && (
          <View className={styles.memberRow}>
            <View className={styles.memberAvatars}>
              {displayMembers.map((m, idx) => (
                <Image
                  key={m.id}
                  className={classnames(styles.memberAvatar, idx > 0 && styles.avatarOverlap)}
                  src={m.avatar}
                  mode="aspectFill"
                  style={{ zIndex: displayMembers.length - idx }}
                />
              ))}
              {extraCount > 0 && (
                <View className={classnames(styles.memberAvatar, styles.avatarExtra, displayMembers.length > 0 && styles.avatarOverlap)}>
                  <Text className={styles.avatarExtraText}>+{extraCount}</Text>
                </View>
              )}
            </View>
            <Text className={styles.memberCount}>{confirmedMembers.length}人确认</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default MemoryCard;
