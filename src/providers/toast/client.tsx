"use client";

import { createContext, useContext, useState } from "react";
import { THEME_COLOR } from "../../types/theme";
import { twMerge } from "tailwind-merge";
import { getBackgroundColorClass } from "../../functions";

type ToastContextType = (msg: string) => void;

export const ToastContext = createContext<ToastContextType>(() => {});

export type ToastType = {
    id: string;
    color: THEME_COLOR;
    message: string;
};

export function ToastStateProvider() {
    const [toasts, setToasts] = useState<ToastType[]>([]);

    const showToast = (message: string, color: THEME_COLOR = "primary") => {
        const id = Date.now().toString();
        setToasts(prev => [...prev, { id, message, color }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id));
        }, 3000);
    };

    return (
        <ToastContext.Provider value={showToast}>
            <div
                className={twMerge(
                    ["fixed", "bottom-4", "right-4", "space-y-2", "z-50"],
                    ["flex", "flex-col-reverse", "space-y-reverse", "space-y-2"],
                )}>
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={twMerge(
                            ["px-4", "py-2", "rounded-md"],
                            getBackgroundColorClass(toast.color),
                        )}>
                        {toast.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast must be used within a ToastProvider");
    return context;
};
