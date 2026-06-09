import { MemoryAlbum } from '@/types';

export const mockAlbums: MemoryAlbum[] = [
  {
    id: 'al1',
    title: '稻城亚丁 · 雪山圣湖之旅',
    coverUrl: 'https://picsum.photos/id/1015/600/400',
    photos: [
      'https://picsum.photos/id/1015/400/400',
      'https://picsum.photos/id/1018/400/400',
      'https://picsum.photos/id/1036/400/400',
      'https://picsum.photos/id/1039/400/400',
      'https://picsum.photos/id/1044/400/400',
      'https://picsum.photos/id/64/400/400',
      'https://picsum.photos/id/91/400/400',
      'https://picsum.photos/id/177/400/400',
      'https://picsum.photos/id/338/400/400'
    ],
    createdAt: '2024-06-10 21:00',
    shareLink: 'https://tripclip.app/album/al1',
    views: 156,
    productionId: 'prod1',
    confirmedMemberIds: ['1', '2', '3', '4']
  },
  {
    id: 'al2',
    title: '亚丁景区徒步回忆',
    coverUrl: 'https://picsum.photos/id/1018/600/400',
    photos: [
      'https://picsum.photos/id/1018/400/400',
      'https://picsum.photos/id/1005/400/400',
      'https://picsum.photos/id/1027/400/400',
      'https://picsum.photos/id/1036/400/400',
      'https://picsum.photos/id/1044/400/400'
    ],
    createdAt: '2024-06-11 20:30',
    shareLink: 'https://tripclip.app/album/al2',
    views: 89,
    confirmedMemberIds: ['1']
  }
];
