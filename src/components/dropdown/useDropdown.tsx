"use client";

import { HorizontalAlign, VerticalAlign } from "../../types/theme";
import {
    MouseEvent,
    ReactNode,
    RefObject,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { twMerge } from "tailwind-merge";
import { createPortal } from "react-dom";
import { MenuContext } from "../menu/menu";

type UseDropdownProps<T extends HTMLElement = HTMLElement> = {
    horizontal?: HorizontalAlign;
    vertical?: VerticalAlign;
    className?: string;
    offset?: { x?: number; y?: number };
    initialOpen?: boolean;
    anchorRef?: RefObject<T>;
};

function useDropdown<T extends HTMLElement = HTMLElement>({
    className,
    horizontal = "left",
    vertical = "bottom",
    offset = { x: 0, y: 0 },
    initialOpen = false,
    anchorRef: externalAnchorRef,
}: UseDropdownProps<T> = {}) {
    const [isOpen, setIsOpen] = useState(initialOpen);
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);
    const [isPositionCalculated, setIsPositionCalculated] = useState(false);

    const menuRef = useRef<HTMLDivElement>(null);
    const internalAnchorRef = useRef<T>(null);
    const effectiveAnchorRef = externalAnchorRef || internalAnchorRef;

    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, width: 0 });
    const resizeTimerRef = useRef<NodeJS.Timeout | null>(null);

    const open = useCallback((event?: MouseEvent<HTMLElement>) => {
        if (event) {
            event.stopPropagation();
            setAnchor(event.currentTarget);
        }
        setIsPositionCalculated(false);
        setIsOpen(true);
    }, []);

    const close = useCallback(() => {
        setIsOpen(false);
        setIsPositionCalculated(false);
    }, []);

    const toggle = useCallback(
        (event?: MouseEvent<HTMLElement>) => {
            if (isOpen) {
                close();
            } else {
                open(event);
            }
        },
        [isOpen, open, close],
    );

    const calculatePosition = useCallback(() => {
        const anchorElement = anchor || effectiveAnchorRef.current;

        if (anchorElement) {
            const rect = anchorElement.getBoundingClientRect();
            const menuWidth: number = rect.width;
            let menuHeight: number = rect.height;

            if (menuRef.current) {
                menuHeight = menuRef.current.offsetHeight;
            } else {
                const dummyMenu = document.createElement("div");
                dummyMenu.className = twMerge(["absolute", "min-w-[10rem]", "py-1", className]);
                dummyMenu.style.visibility = "hidden";
                document.body.appendChild(dummyMenu);
                menuHeight = dummyMenu.offsetHeight;
                document.body.removeChild(dummyMenu);
            }

            let top: number;
            if (vertical === "bottom") {
                top = rect.bottom + window.scrollY + (offset.y || 0);
            } else {
                top = rect.top + window.scrollY - menuHeight - (offset.y || 0);
            }

            let left: number;
            if (horizontal === "left") {
                left = rect.left + window.scrollX + (offset.x || 0);
            } else if (horizontal == "right") {
                left = rect.right + window.scrollX - menuWidth + (offset.x || 0);
            } else {
                left =
                    rect.left + rect.width / 2 - menuWidth / 2 + window.scrollX + (offset.x || 0);
            }

            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            if (left + menuWidth > viewportWidth) {
                left = Math.max(0, viewportWidth - menuWidth);
            }

            if (left < 0) {
                left = 0;
            }

            if (top + menuHeight > viewportHeight + window.scrollY) {
                top = rect.top + window.scrollY - menuHeight - (offset.y || 0);
            }

            if (top < window.scrollY) {
                top = rect.bottom + window.scrollY + (offset.y || 0);
            }

            setMenuPosition({ top, left, width: menuWidth });
            setIsPositionCalculated(true);
        }
    }, [anchor, horizontal, vertical, offset.x, offset.y, effectiveAnchorRef, className]);

    const handleResize = useCallback(() => {
        if (resizeTimerRef.current) {
            clearTimeout(resizeTimerRef.current);
        }

        resizeTimerRef.current = setTimeout(() => {
            if (isOpen) {
                calculatePosition();
            }
        }, 100);
    }, [isOpen, calculatePosition]);

    useEffect(() => {
        const handleClickOutside = (event: Event) => {
            const anchorElement = anchor || effectiveAnchorRef.current;

            if (
                isOpen &&
                menuRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                anchorElement &&
                !anchorElement.contains(event.target as Node)
            ) {
                close();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, anchor, close, effectiveAnchorRef]);

    useEffect(() => {
        if (isOpen) {
            calculatePosition();
        }
    }, [isOpen, calculatePosition]);

    useEffect(() => {
        if (isOpen) {
            window.addEventListener("resize", handleResize);
            window.addEventListener("scroll", handleResize);

            return () => {
                window.removeEventListener("resize", handleResize);
                window.removeEventListener("scroll", handleResize);

                if (resizeTimerRef.current) {
                    clearTimeout(resizeTimerRef.current);
                }
            };
        }
    }, [isOpen, handleResize]);

    const renderMenu = useCallback(
        (children: ReactNode) => {
            if (!isOpen || !isPositionCalculated) return null;

            return createPortal(
                <MenuContext.Provider value={{ isOpen, onClose: close }}>
                    <div
                        ref={menuRef}
                        style={{
                            top: `${menuPosition.top}px`,
                            left: `${menuPosition.left}px`,
                            width: `${menuPosition.width}px`,
                        }}
                        className={twMerge(
                            ["absolute", "py-1", "min-w-[10rem]", "z-50"],
                            ["opacity-100", "transition-opacity", "duration-500"],
                            ["theme-paper", "rounded-lg", "shadow-md", "border", "theme-border"],
                            className,
                        )}>
                        {children}
                    </div>
                </MenuContext.Provider>,
                document.body,
            );
        },
        [isOpen, isPositionCalculated, menuPosition, className, close],
    );

    return {
        isOpen,
        open,
        close,
        toggle,
        renderMenu,
        menuRef,
        anchorRef: internalAnchorRef,
        calculatePosition,
    };
}

export default useDropdown;
