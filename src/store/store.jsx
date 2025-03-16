import { create } from "zustand";
import { persist } from "zustand/middleware";

const useStore = create(
  persist(
    (set, get) => ({
      loggedIn: false,
      userData: null,
      taskArray: [],
      doingArray: [],
      doneArray: [],
      accessToken: null,
      refreshToken: null,
      setLoggedIn: (loggedIn, accessToken, refreshToken) =>
        set({ loggedIn, accessToken, refreshToken }),
      setUserData: (loggedIn, userData) => set({ userData, loggedIn }),
      setTaskArray: (taskArray) => set({ taskArray }),
      setDoingArray: (doingArray) => set({ doingArray }),
      setDoneArray: (doneArray) => set({ doneArray }),
      initialAuth: () => {
        const storedLoggedIn = localStorage.getItem("loggedIn");
        if (storedLoggedIn) {
          set({ loggedIn: JSON.parse(storedLoggedIn) });
        }
      },
    }),
    {
      name: "taskflow-storage",
      storage: {
        getItem: (name) => localStorage.getItem(name),
        setItem: (name, value) => localStorage.setItem(name, value),
        removeItem: (name) => localStorage.removeItem(name),
      },
      partialize: (state) => ({
        loggedIn: state.loggedIn,
        userData: state.userData,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);

export default useStore;
