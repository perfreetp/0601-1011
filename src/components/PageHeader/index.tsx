import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  rightContent?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, rightContent }) => {
  return (
    <View className={styles.header}>
      <View className={styles.headerContent}>
        <View className={styles.titleArea}>
          <Text className={styles.title}>{title}</Text>
          {subtitle && <Text className={styles.subtitle}>{subtitle}</Text>}
        </View>
        {rightContent && <View className={styles.rightArea}>{rightContent}</View>}
      </View>
    </View>
  );
};

export default PageHeader;
