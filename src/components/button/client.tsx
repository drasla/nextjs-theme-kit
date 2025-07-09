"use client";

import useRipple from "../../hooks/useRipple/useRipple";
import {
    ForwardedRef,
    MouseEventHandler,
    RefObject,
    useEffect,
    MouseEvent as ReactMouseEvent,
} from "react";
import { THEME_COLOR } from "../../types/theme";

export type ButtonClientProps = {
    buttonRef: ForwardedRef<HTMLButtonElement>;
    onClick: MouseEventHandler<HTMLButtonElement>;
    color?: THEME_COLOR;
    disabled?: boolean;
    loading?: boolean;
};

function ButtonClient({ buttonRef, color, disabled, loading, onClick }: ButtonClientProps) {
    const { containerRef, createRipple } = useRipple<HTMLButtonElement>(color);

    useEffect(() => {
        const button = (buttonRef as RefObject<HTMLButtonElement>)?.current;
        if (!button) return;

        const handleClick = (e: Event) => {
            if (disabled) return;

            const mouseEvent = e as MouseEvent;

            createRipple(mouseEvent as any);

            const reactEvent = {
                ...mouseEvent,
                currentTarget: button,
                target: button,
                preventDefault: () => e.preventDefault(),
                stopPropagation: () => e.stopPropagation(),
                nativeEvent: mouseEvent,
            } as unknown as ReactMouseEvent<HTMLButtonElement>;

            onClick(reactEvent);
        };

        button.addEventListener("click", handleClick);

        return () => {
            button.removeEventListener("click", handleClick);
        };
    }, [onClick, color, disabled, containerRef, createRipple]);

    return null;
}

export default ButtonClient;
