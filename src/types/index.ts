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

export interface Production {
  id: string;
  title: string;
  coverUrl: string;
  status: 'draft' | 'processing' | 'ready' | 'published';
  createdAt: string;
  duration: string;
  materialCount: number;
  teamName?: string;
  hasWatermark?: boolean;
  hasSubtitles?: boolean;
  hasStickers?: boolean;
  musicName?: string;
}

export interface MemoryAlbum {
  id: string;
  title: string;
  coverUrl: string;
  photos: string[];
  createdAt: string;
  shareLink?: string;
  views: number;
}

export interface Draft {
  id: string;
  title: string;
  updatedAt: string;
  thumbnail: string;
  progress: number;
}
