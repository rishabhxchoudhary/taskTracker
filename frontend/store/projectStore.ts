import { create } from 'zustand';
import { Project, ProjectStore } from '../types/types';
import { CalendarDate, getLocalTimeZone, today } from '@internationalized/date';

export const useProjectStore = create<ProjectStore>((set) => ({
    currentProject: null,
    currentDate: today(getLocalTimeZone()),
    setCurrentProject: async (project: Project) => {
        set({ currentProject: project });
    },
    setCurrentDate: async (date: CalendarDate) => {
        set({ currentDate: date });
    }
}))