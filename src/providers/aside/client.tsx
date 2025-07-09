"use client";

import {
    createContext,
    PropsWithChildren,
    useContext,
    useEffect,
    useState,
} from "react";

type AsideContextType = {
    open: boolean;
    setOpen: (value: boolean) => void;
};

let openState: boolean = false;
const listeners = new Set<(open: boolean) => void>();

function toggleOpen(newOpen: boolean) {
    openState = newOpen;
    listeners.forEach(listener => listener(newOpen));
}

export const AsideContext = createContext<AsideContextType>({
    open: openState,
    setOpen: toggleOpen,
});

export function AsideStateProvider() {
    useEffect(() => {
        const LG = 1024;
        let prevIsLg = window.innerWidth >= LG;

        function handleResize() {
            const isLg = window.innerWidth >= LG;
            if (prevIsLg !== isLg) {
                openState = false;
                listeners.forEach(listener => listener(openState));
            }
            prevIsLg = isLg;
        }

        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return null;
}

export function AsideUIProvider({ children }: PropsWithChildren) {
    const [open, setOpenState] = useState<boolean>(openState);

    useEffect(() => {
        const listener = (nextOpen: boolean) => setOpenState(nextOpen);
        listeners.add(listener);
        setOpenState(openState);
        return () => {
            listeners.delete(listener);
        };
    }, []);

    const setOpen = (next: boolean) => {
        toggleOpen(next);
    };

    return <AsideContext.Provider value={{ open, setOpen }}>{children}</AsideContext.Provider>;
}

export function useAside() {
    const context = useContext(AsideContext);
    if (!context) throw new Error("useAside must be used within a AsideProvider");
    return context;
}
