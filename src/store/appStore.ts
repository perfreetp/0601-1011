import { create } from 'zustand';
import dayjs from 'dayjs';
import {
  DayItinerary,
  MaterialItem,
  Production,
  Member,
  MemoryAlbum,
  Draft,
  PublishConfig,
  ItineraryPoint,
  MaterialCategory,
  MaterialType
} from '@/types';
import { mockItinerary, mockMembers } from '@/data/itinerary';
import { mockMaterials } from '@/data/material';
import { mockProductions, mockDrafts } from '@/data/production';
import { mockAlbums } from '@/data/memory';
import { generateShareLink } from '@/utils';
import { mockMusicTracks } from '@/data/material';

const genId = (prefix: string) => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

const nowStr = () => dayjs().format('YYYY-MM-DD HH:mm');
const nowDateStr = () => dayjs().format('YYYY-MM-DD');

interface AppState {
  teamName: string;
  itinerary: DayItinerary[];
  materials: MaterialItem[];
  productions: Production[];
  drafts: Draft[];
  albums: MemoryAlbum[];
  members: Member[];
  selectedMaterials: string[];
  currentDay: number;

  setCurrentDay: (day: number) => void;
  toggleMaterialSelect: (id: string) => void;
  clearMaterialSelect: () => void;
  selectAllMaterials: () => void;
  updateShotStatus: (dayId: string, pointId: string, shotId: string, status: 'pending' | 'completed' | 'skipped') => void;

  addDay: (title?: string) => void;
  addPoint: (dayId: string, point: Omit<ItineraryPoint, 'id' | 'completed' | 'shots'> & { shots?: string[] }) => void;

  addMaterial: (data: {
    type: MaterialType;
    url: string;
    thumbnail: string;
    category: MaterialCategory;
    location: string;
    uploadedBy: string;
    duration?: number;
    isShaky?: boolean;
  }) => void;

  saveDraft: (config: PublishConfig & { thumbnail?: string; progress?: number }, existingId?: string) => string;
  getDraft: (id: string) => Draft | undefined;

  publishVideo: (config: PublishConfig) => { productionId: string; albumId: string };
  getProduction: (id: string) => Production | undefined;

  createAlbum: (options?: { title?: string; photoUrls?: string[]; productionId?: string; confirmedMemberIds?: string[] }) => MemoryAlbum;
  incrementAlbumViews: (albumId: string) => void;
  getAlbumById: (id: string) => MemoryAlbum | undefined;
}

export const useAppStore = create<AppState>((set, get) => ({
  teamName: '稻城探险队',
  itinerary: mockItinerary,
  materials: mockMaterials,
  productions: mockProductions,
  drafts: mockDrafts,
  albums: mockAlbums,
  members: mockMembers,
  selectedMaterials: [],
  currentDay: 0,

  setCurrentDay: (day: number) => set({ currentDay: day }),

  toggleMaterialSelect: (id: string) => {
    const { selectedMaterials } = get();
    if (selectedMaterials.includes(id)) {
      set({ selectedMaterials: selectedMaterials.filter(m => m !== id) });
    } else {
      set({ selectedMaterials: [...selectedMaterials, id] });
    }
  },

  clearMaterialSelect: () => set({ selectedMaterials: [] }),

  selectAllMaterials: () => {
    const { materials } = get();
    set({ selectedMaterials: materials.map(m => m.id) });
  },

  updateShotStatus: (dayId, pointId, shotId, status) => {
    const { itinerary } = get();
    const newItinerary = itinerary.map(day => {
      if (day.id !== dayId) return day;
      return {
        ...day,
        points: day.points.map(point => {
          if (point.id !== pointId) return point;
          const newShots = point.shots.map(shot => {
            if (shot.id !== shotId) return shot;
            return { ...shot, status };
          });
          const allDone = newShots.every(s => s.status !== 'pending');
          return {
            ...point,
            shots: newShots,
            completed: allDone
          };
        })
      };
    });
    set({ itinerary: newItinerary });
  },

  addDay: (title) => {
    const { itinerary } = get();
    const nextIndex = itinerary.length + 1;
    const date = dayjs().add(itinerary.length, 'day').format('YYYY-MM-DD');
    const newDay: DayItinerary = {
      id: genId('day'),
      date,
      dayIndex: nextIndex,
      title: title || `第${nextIndex}天行程`,
      points: []
    };
    set({ itinerary: [...itinerary, newDay] });
  },

  addPoint: (dayId, point) => {
    const { itinerary } = get();
    const newPoint: ItineraryPoint = {
      id: genId('pt'),
      name: point.name,
      location: point.location,
      time: point.time,
      description: point.description,
      completed: false,
      shots: (point.shots || []).map(name => ({
        id: genId('shot'),
        name,
        description: '',
        status: 'pending' as const,
        priority: 'medium' as const
      }))
    };
    const newItinerary = itinerary.map(day => {
      if (day.id !== dayId) return day;
      return { ...day, points: [...day.points, newPoint] };
    });
    set({ itinerary: newItinerary });
  },

  addMaterial: (data) => {
    const newMaterial: MaterialItem = {
      id: genId('mat'),
      type: data.type,
      url: data.url,
      thumbnail: data.thumbnail,
      category: data.category,
      location: data.location,
      uploadedBy: data.uploadedBy,
      uploadedAt: nowStr(),
      duration: data.duration,
      isShaky: data.isShaky
    };
    set({ materials: [newMaterial, ...get().materials] });
  },

  saveDraft: (config, existingId) => {
    const { drafts, selectedMaterials, materials } = get();
    const materialIds = config.materialIds.length > 0 ? config.materialIds : selectedMaterials;
    const actualMaterialIds = materialIds.filter(id => materials.some(m => m.id === id));
    const materialCount = actualMaterialIds.length;
    const musicTrack = mockMusicTracks.find(m => m.id === config.musicId);

    if (existingId) {
      const newDrafts = drafts.map(d => {
        if (d.id !== existingId) return d;
        return {
          ...d,
          ...config,
          materialIds: actualMaterialIds,
          materialCount,
          musicName: musicTrack?.name || d.musicName,
          updatedAt: nowStr(),
          thumbnail: config.thumbnail || d.thumbnail,
          progress: config.progress ?? Math.min((d.progress || 0) + 10, 95)
        };
      });
      set({ drafts: newDrafts });
      return existingId;
    } else {
      const id = genId('draft');
      const newDraft: Draft = {
        id,
        ...config,
        materialIds: actualMaterialIds,
        materialCount,
        musicName: musicTrack?.name,
        updatedAt: nowStr(),
        thumbnail: config.thumbnail || config.coverUrl,
        progress: config.progress ?? 20
      };
      set({ drafts: [newDraft, ...drafts] });
      return id;
    }
  },

  getDraft: (id) => get().drafts.find(d => d.id === id),

  publishVideo: (config) => {
    const { productions, members, selectedMaterials, materials } = get();
    const materialIds = config.materialIds.length > 0 ? config.materialIds : selectedMaterials;
    const actualMaterialIds = materialIds.filter(id => materials.some(m => m.id === id));
    const materialCount = actualMaterialIds.length;
    const musicTrack = mockMusicTracks.find(m => m.id === config.musicId);
    const productionId = genId('prod');

    const videoPhotoUrls = materials
      .filter(m => actualMaterialIds.includes(m.id))
      .map(m => m.url);

    const album = get().createAlbum({
      title: config.title,
      productionId,
      confirmedMemberIds: config.confirmedMemberIds,
      photoUrls: videoPhotoUrls
    });

    const newProduction: Production = {
      id: productionId,
      ...config,
      materialIds: actualMaterialIds,
      materialCount,
      musicName: musicTrack?.name,
      status: 'published',
      createdAt: nowStr(),
      updatedAt: nowStr(),
      teamName: get().teamName,
      hasWatermark: config.teamWatermark,
      hasSubtitles: config.autoSubtitles,
      hasStickers: config.routeStickers,
      progress: 100,
      albumId: album.id
    };
    set({
      productions: [newProduction, ...productions],
      drafts: get().drafts.filter(d => {
        const sameTitle = d.title === config.title;
        const sameMaterials = d.materialIds.join(',') === materialIds.join(',');
        return !(sameTitle && sameMaterials);
      })
    });
    return { productionId, albumId: album.id };
  },

  getProduction: (id) => get().productions.find(p => p.id === id),

  createAlbum: (options) => {
    const { albums, materials, selectedMaterials } = get();
    const albumId = genId('al');

    let photoUrls = options?.photoUrls;
    if (!photoUrls || photoUrls.length === 0) {
      const sourceIds = selectedMaterials.length > 0 ? selectedMaterials : materials.slice(0, 9).map(m => m.id);
      photoUrls = materials
        .filter(m => sourceIds.includes(m.id))
        .slice(0, 9)
        .map(m => m.url);
      if (photoUrls.length === 0) {
        photoUrls = materials.slice(0, 9).map(m => m.url);
      }
    }

    const newAlbum: MemoryAlbum = {
      id: albumId,
      title: options?.title || `${get().teamName}的旅行相册`,
      coverUrl: photoUrls[0] || 'https://picsum.photos/id/1018/600/400',
      photos: photoUrls,
      createdAt: nowStr(),
      shareLink: generateShareLink(albumId),
      views: 0,
      productionId: options?.productionId,
      confirmedMemberIds: options?.confirmedMemberIds || []
    };
    set({ albums: [newAlbum, ...albums] });
    return newAlbum;
  },

  incrementAlbumViews: (albumId) => {
    const { albums } = get();
    set({
      albums: albums.map(a => a.id === albumId ? { ...a, views: a.views + 1 } : a)
    });
  },

  getAlbumById: (id) => get().albums.find(a => a.id === id)
}));
