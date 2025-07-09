"use client";

import { THEME_COLOR } from "../../types/theme";
import { MouseEvent, useRef } from "react";
import { twMerge } from "tailwind-merge";
import { getBackgroundColorClass } from "../../functions";

function useRipple<T extends HTMLElement>(color?: THEME_COLOR) {
    const containerRef = useRef<T>(null);

    function createRipple(e: MouseEvent) {
        const container = containerRef.current;
        if (!container) return;

        const circle = document.createElement("span");
        const diameter = Math.max(container.clientWidth, container.clientHeight);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${e.pageX - container.getBoundingClientRect().left - radius}px`;
        circle.style.top = `${e.pageY - container.getBoundingClientRect().top - radius}px`;
        circle.className = twMerge("ripple", getBackgroundColorClass(color));

        const ripple = container.getElementsByClassName("ripple")[0];
        if (ripple) {
            ripple.remove();
        }
        container.appendChild(circle);
    }

    return { containerRef, createRipple };
}

export default useRipple;
