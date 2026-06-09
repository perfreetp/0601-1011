import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';

export interface FilterTag {
  key: string;
  label: string;
  count?: number;
}

interface TagFilterProps {
  tags: FilterTag[];
  activeKey: string;
  onChange: (key: string) => void;
}

const TagFilter: React.FC<TagFilterProps> = ({ tags, activeKey, onChange }) => {
  return (
    <ScrollView className={styles.container} scrollX enableFlex>
      <View className={styles.tagsWrapper}>
        {tags.map(tag => (
          <View
            key={tag.key}
            className={classnames(styles.tag, activeKey === tag.key && styles.active)}
            onClick={() => onChange(tag.key)}
          >
            <Text className={styles.tagLabel}>{tag.label}</Text>
            {tag.count !== undefined && (
              <Text className={classnames(styles.tagCount, activeKey === tag.key && styles.activeCount)}>
                {tag.count}
              </Text>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default TagFilter;
