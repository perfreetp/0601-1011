import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import { MemoryAlbum } from '@/types';
import { formatDate } from '@/utils';
import styles from './index.module.scss';

interface MemoryCardProps {
  album: MemoryAlbum;
  onClick?: (album: MemoryAlbum) => void;
}

const MemoryCard: React.FC<MemoryCardProps> = ({ album, onClick }) => {
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
      </View>
    </View>
  );
};

export default MemoryCard;
