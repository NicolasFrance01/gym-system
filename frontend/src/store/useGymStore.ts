import { create } from 'zustand';

export interface Member {
  id: number;
  dni: string;
  name: string;
  status: 'AL DIA' | 'POR VENCER' | 'DEUDA';
  photo_url: string | null;
}

interface GymStore {
  currentMember: Member | null;
  setCurrentMember: (member: Member | null) => void;
  isAlarmActive: boolean;
  setAlarmActive: (active: boolean) => void;
}

export const useGymStore = create<GymStore>((set) => ({
  currentMember: null,
  setCurrentMember: (member) => set({ currentMember: member }),
  isAlarmActive: false,
  setAlarmActive: (active) => set({ isAlarmActive: active }),
}));
