import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import classnames from 'classnames';
import { MaterialItem as MaterialItemType } from '@/types';
import { formatDuration, getCategoryLabel } from '@/utils';
import styles from './index.module.scss';

interface MaterialItemProps {
  material: MaterialItemType;
  selected?: boolean;
  selectable?: boolean;
  onSelect?: (id: string) => void;
  onClick?: (material: MaterialItemType) => void;
}

const MaterialItemComponent: React.FC<MaterialItemProps> = ({
  material,
  selected = false,
  selectable = false,
  onSelect,
  onClick
}) => {
  const handleClick = () => {
    if (selectable && onSelect) {
      onSelect(material.id);
    } else if (onClick) {
      onClick(material);
    }
  };

  return (
    <View
      className={classnames(styles.item, {
        [styles.selected]: selected,
        [styles.selectable]: selectable
      })}
      onClick={handleClick}
    >
      <Image
        className={styles.thumbnail}
        src={material.thumbnail}
        mode="aspectFill"
      />

      {selectable && (
        <View className={classnames(styles.checkbox, selected && styles.checked)}>
          {selected && <Text className={styles.checkIcon}>✓</Text>}
        </View>
      )}

      {material.type === 'video' && (
        <View className={styles.videoBadge}>
          <Text className={styles.videoIcon}>▶</Text>
          <Text className={styles.videoDuration}>
            {material.duration ? formatDuration(material.duration) : ''}
          </Text>
        </View>
      )}

      {material.isShaky && (
        <View className={styles.shakyBadge}>
          <Text className={styles.shakyText}>抖动</Text>
        </View>
      )}

      <View className={styles.categoryTag}>
        <Text className={styles.categoryText}>{getCategoryLabel(material.category)}</Text>
      </View>
    </View>
  );
};

export default MaterialItemComponent;
