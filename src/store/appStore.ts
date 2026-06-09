import { create } from 'zustand';
import { DayItinerary, MaterialItem, Production, Member } from '@/types';
import { mockItinerary, mockMembers } from '@/data/itinerary';
import { mockMaterials } from '@/data/material';
import { mockProductions } from '@/data/production';

interface AppState {
  teamName: string;
  itinerary: DayItinerary[];
  materials: MaterialItem[];
  productions: Production[];
  members: Member[];
  selectedMaterials: string[];
  currentDay: number;
  setCurrentDay: (day: number) => void;
  toggleMaterialSelect: (id: string) => void;
  clearMaterialSelect: () => void;
  selectAllMaterials: () => void;
  updateShotStatus: (dayId: string, pointId: string, shotId: string, status: 'pending' | 'completed' | 'skipped') => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  teamName: '稻城探险队',
  itinerary: mockItinerary,
  materials: mockMaterials,
  productions: mockProductions,
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
          return {
            ...point,
            shots: point.shots.map(shot => {
              if (shot.id !== shotId) return shot;
              return { ...shot, status };
            })
          };
        })
      };
    });
    set({ itinerary: newItinerary });
  }
}));
