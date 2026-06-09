import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import classnames from 'classnames';
import { Member } from '@/types';
import styles from './index.module.scss';

interface MemberAvatarProps {
  member: Member;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
}

const MemberAvatar: React.FC<MemberAvatarProps> = ({ member, size = 'md', showName = false }) => {
  return (
    <View className={classnames(styles.wrapper, styles[size])}>
      <View className={styles.avatarWrapper}>
        <Image className={styles.avatar} src={member.avatar} mode="aspectFill" />
        {member.role === 'leader' && (
          <View className={styles.leaderBadge}>
            <Text className={styles.leaderIcon}>👑</Text>
          </View>
        )}
      </View>
      {showName && (
        <Text className={styles.name}>{member.name}</Text>
      )}
    </View>
  );
};

export default MemberAvatar;
