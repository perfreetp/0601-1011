import React, { useState, useMemo } from 'react';
import { View, Text, Image, ScrollView, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { useAppStore } from '@/store/appStore';
import { getCategoryLabel, formatDuration } from '@/utils';
import { MaterialCategory } from '@/types';
import PageHeader from '@/components/PageHeader';
import TagFilter, { FilterTag } from '@/components/TagFilter';
import styles from './index.module.scss';

const MaterialPage: React.FC = () => {
  const { materials, selectedMaterials, toggleMaterialSelect, clearMaterialSelect, selectAllMaterials } = useAppStore();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categoryTags: FilterTag[] = useMemo(() => [
    { key: 'all', label: '全部', count: materials.length },
    { key: 'portrait', label: '人像', count: materials.filter(m => m.category === 'portrait').length },
    { key: 'landscape', label: '风景', count: materials.filter(m => m.category === 'landscape').length },
    { key: 'group', label: '合影', count: materials.filter(m => m.category === 'group').length },
    { key: 'other', label: '其他', count: materials.filter(m => m.category === 'other').length }
  ], [materials]);

  const filteredMaterials = useMemo(() => {
    if (activeCategory === 'all') return materials;
    return materials.filter(m => m.category === activeCategory as MaterialCategory);
  }, [materials, activeCategory]);

  const locationGroups = useMemo(() => {
    const groups: Record<string, typeof materials> = {};
    filteredMaterials.forEach(m => {
      if (!groups[m.location]) groups[m.location] = [];
      groups[m.location].push(m);
    });
    return Object.entries(groups).map(([name, items]) => ({ name, items }));
  }, [filteredMaterials]);

  const handleUpload = () => {
    Taro.navigateTo({ url: '/pages/contribution/index' });
  };

  const handleProduce = () => {
    if (selectedMaterials.length === 0) {
      Taro.showToast({ title: '请先选择素材', icon: 'none' });
      return;
    }
    Taro.switchTab({ url: '/pages/production/index' });
  };

  const handleToggleAll = () => {
    if (selectedMaterials.length === filteredMaterials.length) {
      clearMaterialSelect();
    } else {
      selectAllMaterials();
    }
  };

  const isAllSelected = filteredMaterials.length > 0 && selectedMaterials.length === filteredMaterials.length;

  return (
    <View className="pageContainer">
      <View className={styles.headerRow}>
        <PageHeader
          title="素材相册"
          subtitle={`${materials.length} 个素材已上传`}
        />
        <Button className={styles.uploadBtn} onClick={handleUpload}>
          <Text className={styles.uploadBtnText}>📤 投稿</Text>
        </Button>
      </View>

      <TagFilter
        tags={categoryTags}
        activeKey={activeCategory}
        onChange={setActiveCategory}
      />

      {selectedMaterials.length > 0 && (
        <View className={styles.selectModeBar}>
          <Text className={styles.selectInfo}>已选择 {selectedMaterials.length} 个素材</Text>
          <View className={styles.selectActions}>
            <Text className={styles.selectAction} onClick={clearMaterialSelect}>清除</Text>
            <Text className={styles.selectActionPrimary} onClick={handleProduce}>去成片</Text>
          </View>
        </View>
      )}

      <View className={styles.statsBar}>
        <Text className={styles.statsText}>共 {filteredMaterials.length} 个素材</Text>
        <Text className={styles.toggleSelectBtn} onClick={handleToggleAll}>
          {isAllSelected ? '取消全选' : '全选'}
        </Text>
      </View>

      <ScrollView scrollY style={{ height: 'calc(100vh - 400rpx)' }}>
        {locationGroups.length > 0 ? (
          locationGroups.map(group => (
            <View key={group.name} className={styles.locationGroup}>
              <View className={styles.groupHeader}>
                <Text className={styles.groupTitle}>📍 {group.name}</Text>
                <Text className={styles.groupCount}>{group.items.length}</Text>
              </View>
              <View className={styles.materialGrid}>
                {group.items.map(material => (
                  <View
                    key={material.id}
                    className={classnames(styles.materialItem, selectedMaterials.includes(material.id) && styles.selected)}
                    onClick={() => toggleMaterialSelect(material.id)}
                  >
                    <Image
                      className={styles.materialThumb}
                      src={material.thumbnail}
                      mode="aspectFill"
                    />
                    <View
                      className={classnames(styles.checkCircle, selectedMaterials.includes(material.id) && styles.checked)}
                    >
                      {selectedMaterials.includes(material.id) && (
                        <Text className={styles.checkIcon}>✓</Text>
                      )}
                    </View>
                    <View className={styles.categoryLabel}>
                      <Text className={styles.categoryText}>{getCategoryLabel(material.category)}</Text>
                    </View>
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
                  </View>
                ))}
              </View>
            </View>
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📷</Text>
            <Text className={styles.emptyTitle}>暂无素材</Text>
            <Text className={styles.emptyDesc}>点击右上角按钮上传素材</Text>
          </View>
        )}
        <View className={styles.pageBottomPadding} />
      </ScrollView>

      {selectedMaterials.length > 0 && (
        <View className={styles.bottomBar}>
          <Text className={styles.selectedInfo}>
            已选 <Text className={styles.selectedCount}>{selectedMaterials.length}</Text> 个素材
          </Text>
          <Button className={styles.produceBtn} onClick={handleProduce}>
            <Text className={styles.produceBtnText}>🎬 自动成片</Text>
          </Button>
        </View>
      )}
    </View>
  );
};

export default MaterialPage;
