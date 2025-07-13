"use client";

import { PropsWithChildren, ReactNode, useContext } from "react";
import { MenuContext } from "./menu";
import { twMerge } from "tailwind-merge";

type MenuItemProps = {
    onClick?: VoidFunction;
    disabled?: boolean;
    className?: string;
    icon?: ReactNode;
} & PropsWithChildren;

function MenuItem({ children, onClick, disabled = false, className, icon }: MenuItemProps) {
    const { onClose } = useContext(MenuContext);

    const handleClick = () => {
        if (disabled) return;

        if (onClick) {
            onClick();
            onClose();
        }
    };

    return (
        <div
            className={twMerge(
                ["px-4", "py-2"],
                ["text-sm", "text-light-text", "dark:text-dark-text"],
                ["flex", "items-center", "gap-2"],
                disabled
                    ? ["opacity-50", "cursor-not-allowed"]
                    : ["hover:bg-gray-100", "dark:hover:bg-gray-800", "cursor-pointer"],
                className,
            )}
            onClick={handleClick}>
            {icon && <span className={twMerge(["flex-shrink-0"])}>{icon}</span>}
            {children}
        </div>
    );
}

export default MenuItem;
