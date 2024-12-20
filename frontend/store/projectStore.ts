import { create } from 'zustand';
import { Project, ProjectStore } from '../types/types';

export const useProjectAuth = create<ProjectStore>((set) => ({
    project: null,
    setProject: async (project: Project) => {
        set({ project });
    }
}))