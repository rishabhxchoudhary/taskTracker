import { create } from 'zustand';
import { Project, ProjectStore } from '../types/types';
import { CalendarDate, getLocalTimeZone, today } from '@internationalized/date';
import { toast } from 'sonner';

export const useProjectStore = create<ProjectStore>((set) => ({
    currentProject: null,
    currentDate: today(getLocalTimeZone()),
    setCurrentProject: async (project: Project) => {
        set({ currentProject: project });
        set({ currentDate: today(getLocalTimeZone()) });
        toast.success("Project Selected Successfully");
    },
    setCurrentDate: async (date: CalendarDate) => {
        set({ currentDate: date });
        toast.success("Date Selected Successfully");
    }
}))