import { MaterialItem, LocationGroup, Sticker, MusicTrack } from '@/types';

export const mockMaterials: MaterialItem[] = [
  {
    id: 'm1', type: 'photo', url: 'https://picsum.photos/id/1015/600/600',
    thumbnail: 'https://picsum.photos/id/1015/300/300',
    category: 'landscape', location: '稻城亚丁机场', uploadedBy: '1', uploadedAt: '2024-06-10 10:00'
  },
  {
    id: 'm2', type: 'photo', url: 'https://picsum.photos/id/64/600/600',
    thumbnail: 'https://picsum.photos/id/64/300/300',
    category: 'portrait', location: '稻城亚丁机场', uploadedBy: '2', uploadedAt: '2024-06-10 10:05'
  },
  {
    id: 'm3', type: 'photo', url: 'https://picsum.photos/id/1018/600/600',
    thumbnail: 'https://picsum.photos/id/1018/300/300',
    category: 'landscape', location: '稻城亚丁机场', uploadedBy: '3', uploadedAt: '2024-06-10 10:10'
  },
  {
    id: 'm4', type: 'video', url: 'https://picsum.photos/id/1036/600/600',
    thumbnail: 'https://picsum.photos/id/1036/300/300',
    category: 'landscape', location: '稻城亚丁机场', uploadedBy: '1', uploadedAt: '2024-06-10 10:15',
    duration: 15, isShaky: true
  },
  {
    id: 'm5', type: 'photo', url: 'https://picsum.photos/id/1039/600/600',
    thumbnail: 'https://picsum.photos/id/1039/300/300',
    category: 'landscape', location: '双流机场', uploadedBy: '4', uploadedAt: '2024-06-10 06:45'
  },
  {
    id: 'm6', type: 'photo', url: 'https://picsum.photos/id/91/600/600',
    thumbnail: 'https://picsum.photos/id/91/300/300',
    category: 'portrait', location: '双流机场', uploadedBy: '5', uploadedAt: '2024-06-10 06:50'
  },
  {
    id: 'm7', type: 'photo', url: 'https://picsum.photos/id/177/600/600',
    thumbnail: 'https://picsum.photos/id/177/300/300',
    category: 'group', location: '双流机场', uploadedBy: '1', uploadedAt: '2024-06-10 07:00'
  },
  {
    id: 'm8', type: 'video', url: 'https://picsum.photos/id/1044/600/600',
    thumbnail: 'https://picsum.photos/id/1044/300/300',
    category: 'group', location: '双流机场', uploadedBy: '2', uploadedAt: '2024-06-10 07:05',
    duration: 22
  },
  {
    id: 'm9', type: 'photo', url: 'https://picsum.photos/id/338/600/600',
    thumbnail: 'https://picsum.photos/id/338/300/300',
    category: 'portrait', location: '稻城县城', uploadedBy: '3', uploadedAt: '2024-06-10 14:30'
  },
  {
    id: 'm10', type: 'photo', url: 'https://picsum.photos/id/1027/600/600',
    thumbnail: 'https://picsum.photos/id/1027/300/300',
    category: 'portrait', location: '稻城县城', uploadedBy: '4', uploadedAt: '2024-06-10 14:35'
  },
  {
    id: 'm11', type: 'photo', url: 'https://picsum.photos/id/1005/600/600',
    thumbnail: 'https://picsum.photos/id/1005/300/300',
    category: 'landscape', location: '稻城县城', uploadedBy: '5', uploadedAt: '2024-06-10 14:40'
  },
  {
    id: 'm12', type: 'video', url: 'https://picsum.photos/id/1015/600/600',
    thumbnail: 'https://picsum.photos/id/1015/300/300',
    category: 'landscape', location: '稻城县城', uploadedBy: '6', uploadedAt: '2024-06-10 14:45',
    duration: 8, isShaky: true
  }
];

export const mockLocationGroups: LocationGroup[] = [
  {
    name: '双流机场',
    materials: mockMaterials.filter(m => m.location === '双流机场')
  },
  {
    name: '稻城亚丁机场',
    materials: mockMaterials.filter(m => m.location === '稻城亚丁机场')
  },
  {
    name: '稻城县城',
    materials: mockMaterials.filter(m => m.location === '稻城县城')
  }
];

export const mockStickers: Sticker[] = [
  { id: 'st1', name: '路线标记', icon: '📍', type: 'route' },
  { id: 'st2', name: '相机', icon: '📷', type: 'route' },
  { id: 'st3', name: '山脉', icon: '🏔️', type: 'route' },
  { id: 'st4', name: '太阳', icon: '☀️', type: 'emoji' },
  { id: 'st5', name: '爱心', icon: '❤️', type: 'emoji' },
  { id: 'st6', name: '星星', icon: '✨', type: 'emoji' },
  { id: 'st7', name: '出发', icon: '🚀', type: 'emoji' },
  { id: 'st8', name: '日期', icon: '📅', type: 'text' }
];

export const mockMusicTracks: MusicTrack[] = [
  { id: 'mu1', name: '风的旅行', artist: '轻音乐精选', duration: '3:25' },
  { id: 'mu2', name: '山川之美', artist: '自然之声', duration: '4:12' },
  { id: 'mu3', name: '青春记忆', artist: '流行纯音乐', duration: '3:48' },
  { id: 'mu4', name: '远方的呼唤', artist: '民族音乐', duration: '4:30' },
  { id: 'mu5', name: '快乐时光', artist: '欢快旋律', duration: '2:58' },
  { id: 'mu6', name: '星空漫步', artist: '电子轻音乐', duration: '3:55' }
];
