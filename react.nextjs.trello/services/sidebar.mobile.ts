import { create } from "zustand";

type MobileSidebarMobileStore = {
    isOpen: boolean;
    onOpen: () => void,
    onClose: () => void,
};

export const useSidebarMobile = create<MobileSidebarMobileStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false })
}));