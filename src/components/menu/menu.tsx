"use client";

import { createContext, PropsWithChildren, ReactNode, useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { createPortal } from "react-dom";

type MenuContextType = {
    isOpen: boolean;
    onClose: VoidFunction;
};

export const MenuContext = createContext<MenuContextType>({
    isOpen: false,
    onClose: () => {},
});

type MenuProps = {
    trigger: ReactNode;
    align?: "left" | "right";
    className?: string;
} & PropsWithChildren;

function Menu({ children, trigger, align = "left", className }: MenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const anchorRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const [menuPosition, setMenuPosition] = useState<{ top: number; left: number }>({
        top: 0,
        left: 0,
    });

    const handleClick = () => {
        setIsOpen(!isOpen);
    };

    const onClose = () => {
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: Event) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                anchorRef.current &&
                !anchorRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    useEffect(() => {
        if (isOpen && anchorRef.current) {
            const rect = anchorRef.current.getBoundingClientRect();
            setMenuPosition({
                top: rect.bottom + window.scrollY,
                left:
                    align === "left"
                        ? rect.left + window.scrollX
                        : rect.right + window.scrollX - (menuRef.current?.offsetWidth || 0),
            });
        }
    }, [isOpen, align]);

    return (
        <MenuContext.Provider value={{ isOpen, onClose }}>
            <div className={twMerge(["relative", "inline-block"])}>
                <div ref={anchorRef} onClick={handleClick} className={twMerge(["cursor-pointer"])}>
                    {trigger}
                </div>

                {isOpen &&
                    createPortal(
                        <div
                            ref={menuRef}
                            style={{
                                position: "absolute",
                                top: `${menuPosition.top}px`,
                                left: `${menuPosition.left}px`,
                                zIndex: 50,
                            }}
                            className={twMerge(
                                ["bg-light-paper", "dark:bg-dark-paper"],
                                [
                                    "ring-black",
                                    "ring-1",
                                    "ring-opacity-5",
                                    "shadow-lg",
                                    "rounded-md",
                                ],
                                className,
                            )}>
                            {children}
                        </div>,
                        document.body,
                    )}
            </div>
        </MenuContext.Provider>
    );
}

export default Menu;
