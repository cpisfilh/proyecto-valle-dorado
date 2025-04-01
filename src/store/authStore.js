import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
    persist(
        (set) => ({
            token: null,
            setToken: (token) => set({ token }),
            currentUser: null,
            setCurrentUser: (user) => set({ currentUser: user }),
            logout: () => set({ token: null, currentUser: null }),
        }),
        {
            name: "auth"
        }
    )
)

export default useAuthStore