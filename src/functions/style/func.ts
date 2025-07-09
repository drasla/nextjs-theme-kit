import { twMerge } from "tailwind-merge";
import { THEME_COLOR, THEME_SIZE } from "../../types/theme";

export function getComponentSizeClass(size?: THEME_SIZE): string {
    switch (size) {
        case "large":
            return twMerge("py-3", "px-4", "text-lg");
        case "small":
            return twMerge("py-1", "px-4", "text-sm");
        default:
            return twMerge("py-2", "px-4", "text-base");
    }
}

export function getBackgroundColorClass(color?: THEME_COLOR): string {
    return `bg-${color}-main`;
}

export function getTextAlignClass(align?: "left" | "center" | "right"): string {
    return `text-${align}`;
}

export function getTextColorClass(color?: THEME_COLOR) {
    return `text-${color}-main`;
}

export function getTextContrastColorClass(color?: THEME_COLOR): string {
    return `text-${color}-contrast`;
}

export const getFlexJustifyClass = (align?: "left" | "center" | "right") => {
    switch (align) {
        case "center":
            return "justify-center";
        case "right":
            return "justify-end";
        default:
            return "justify-start";
    }
};

export function getScrollbarWidth(): number {
    if (typeof window === "undefined") return 0;

    const outer = document.createElement("div");
    outer.style.visibility = "hidden";
    outer.style.overflow = "scroll";
    document.body.appendChild(outer);

    const inner = document.createElement("div");
    outer.appendChild(inner);

    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
    outer.parentNode?.removeChild(outer);

    return scrollbarWidth;
}
