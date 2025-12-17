import { create } from 'zustand';

interface AppState {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    user: { name: string; hospital: string } | null;
    setUser: (user: any) => void;
}

export const useStore = create<AppState>((set) => ({
    isSidebarOpen: true,
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    user: { name: "Dr. Smith", hospital: "General Hospital" },
    setUser: (user) => set({ user }),
}));
