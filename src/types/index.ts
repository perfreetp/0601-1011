export interface Member {
  id: string;
  name: string;
  avatar: string;
  role: 'leader' | 'member';
}

export interface ShotItem {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'completed' | 'skipped';
  priority: 'high' | 'medium' | 'low';
}

export interface ItineraryPoint {
  id: string;
  name: string;
  location: string;
  time: string;
  description: string;
  shots: ShotItem[];
  completed: boolean;
}

export interface DayItinerary {
  id: string;
  date: string;
  dayIndex: number;
  title: string;
  points: ItineraryPoint[];
}

export type MaterialType = 'photo' | 'video';
export type MaterialCategory = 'portrait' | 'landscape' | 'group' | 'other';

export interface MaterialItem {
  id: string;
  type: MaterialType;
  url: string;
  thumbnail: string;
  category: MaterialCategory;
  location: string;
  uploadedBy: string;
  uploadedAt: string;
  duration?: number;
  isShaky?: boolean;
  selected?: boolean;
}

export interface LocationGroup {
  name: string;
  materials: MaterialItem[];
}

export interface Sticker {
  id: string;
  name: string;
  icon: string;
  type: 'route' | 'emoji' | 'text';
}

export interface MusicTrack {
  id: string;
  name: string;
  artist: string;
  duration: string;
}

export interface PublishConfig {
  title: string;
  coverUrl: string;
  duration: string;
  materialIds: string[];
  materialCount: number;
  musicId: string;
  musicName?: string;
  stickerId: string;
  teamWatermark: boolean;
  autoSubtitles: boolean;
  routeStickers: boolean;
  removeShaky: boolean;
  mergeMulti: boolean;
  confirmedMemberIds: string[];
}

export interface Production extends PublishConfig {
  id: string;
  status: 'draft' | 'processing' | 'ready' | 'published';
  createdAt: string;
  updatedAt: string;
  teamName?: string;
  hasWatermark?: boolean;
  hasSubtitles?: boolean;
  hasStickers?: boolean;
  progress?: number;
  albumId?: string;
}

export interface MemoryAlbum {
  id: string;
  title: string;
  coverUrl: string;
  photos: string[];
  createdAt: string;
  shareLink?: string;
  views: number;
  productionId?: string;
  confirmedMemberIds?: string[];
}

export interface Draft extends PublishConfig {
  id: string;
  updatedAt: string;
  thumbnail: string;
  progress: number;
}
