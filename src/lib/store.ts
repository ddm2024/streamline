import { create } from 'zustand'

interface AppStore {
  sidebarOpen: boolean
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
}

export const useAppStore = create<AppStore>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}))

interface UserStore {
  orgId: string | null
  userId: string | null
  role: string | null
  setUser: (user: { orgId: string; userId: string; role: string }) => void
  clearUser: () => void
}

export const useUserStore = create<UserStore>((set) => ({
  orgId: null,
  userId: null,
  role: null,
  setUser: ({ orgId, userId, role }) => set({ orgId, userId, role }),
  clearUser: () => set({ orgId: null, userId: null, role: null }),
}))
