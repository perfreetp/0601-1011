import { Production, Draft } from '@/types';

export const mockProductions: Production[] = [
  {
    id: 'prod1',
    title: '稻城亚丁之旅 - 第一天',
    coverUrl: 'https://picsum.photos/id/1015/400/600',
    status: 'published',
    createdAt: '2024-06-10 20:30',
    duration: '1:45',
    materialCount: 18,
    teamName: '稻城探险队',
    hasWatermark: true,
    hasSubtitles: true,
    hasStickers: true,
    musicName: '风的旅行'
  },
  {
    id: 'prod2',
    title: '亚丁景区徒步纪录',
    coverUrl: 'https://picsum.photos/id/1018/400/600',
    status: 'processing',
    createdAt: '2024-06-11 18:45',
    duration: '2:30',
    materialCount: 32,
    teamName: '稻城探险队',
    hasWatermark: true,
    hasSubtitles: true,
    musicName: '山川之美'
  },
  {
    id: 'prod3',
    title: '牛奶海登顶纪念',
    coverUrl: 'https://picsum.photos/id/1036/400/600',
    status: 'ready',
    createdAt: '2024-06-12 16:20',
    duration: '2:10',
    materialCount: 25,
    teamName: '稻城探险队',
    hasWatermark: true,
    hasSubtitles: false,
    hasStickers: true,
    musicName: '远方的呼唤'
  }
];

export const mockDrafts: Draft[] = [
  {
    id: 'draft1',
    title: '五色海震撼瞬间',
    updatedAt: '2024-06-12 17:30',
    thumbnail: 'https://picsum.photos/id/1044/400/400',
    progress: 65
  },
  {
    id: 'draft2',
    title: '冲古寺晨光',
    updatedAt: '2024-06-11 22:15',
    thumbnail: 'https://picsum.photos/id/1039/400/400',
    progress: 30
  }
];
