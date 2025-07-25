"use client";

import { BUTTON_VARIANT, THEME_COLOR, THEME_SIZE } from "../../types/theme";
import { ButtonHTMLAttributes, PropsWithChildren, useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";
import { getComponentSizeClass } from "../../functions";
import Spinner from "../spinner/spinner";
import useRipple from "../../hooks/useRipple/useRipple";

export type ButtonProps = {
    fullWidth?: boolean;
    className?: string;
    variant?: BUTTON_VARIANT;
    size?: THEME_SIZE;
    loading?: boolean;
    color?: THEME_COLOR;
} & PropsWithChildren &
    ButtonHTMLAttributes<HTMLButtonElement>;

function Button(
    {
        variant,
        color,
        fullWidth,
        type = "button",
        size = "medium",
        loading = false,
        disabled,
        onClick,
        className,
        children,
        ...props
    }: ButtonProps
) {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const { containerRef, createRipple} = useRipple<HTMLButtonElement>(color);

    useEffect(() => {
        const button = buttonRef.current;
        if (!button || !onClick) return;

        containerRef.current = button;

        const handleClick = (e: MouseEvent) => {
            if (disabled) return;

            const reactEvent = {
                ...e,
                currentTarget: button,
                target: button,
                preventDefault: () => e.preventDefault(),
                stopPropagation: () => e.stopPropagation(),
                nativeEvent: e,
            } as unknown as React.MouseEvent<HTMLButtonElement>;

            createRipple(reactEvent);
            onClick(reactEvent);
        }

        button.addEventListener("click", handleClick);
        return () => {
            button.removeEventListener("click", handleClick);
        }
    }, [onClick, color, disabled, createRipple]);


    const mergedClassName = twMerge(
        ["relative", "overflow-hidden", "cursor-pointer"],
        ["flex", "justify-center", "items-center"],
        ["rounded-md", "font-bold"],
        ["transition-all", "duration-300"],
        getComponentSizeClass(size),
        disabled ? getButtonColorClass(variant, "disabled") : getButtonColorClass(variant, color),
        fullWidth && "w-full",
        className,
    );

    return (
        <>
            <button
                ref={buttonRef}
                type={type}
                disabled={disabled}
                className={mergedClassName}
                {...props}>
                {loading ? <Spinner size={size} className={"text-disabled-dark"} /> : children}
            </button>
        </>
    );
}

export default Button;

const outlinedColorClasses: Record<string, string> = {
    primary: twMerge(
        "border-primary-main",
        "hover:border-primary-dark",
        "dark:hover:border-primary-light",
        "text-primary-main",
        "border",
    ),
    secondary: twMerge(
        "border-secondary-main",
        "hover:border-secondary-dark",
        "dark:hover:border-secondary-light",
        "text-secondary-main",
        "border",
    ),
    success: twMerge(
        "border-success-main",
        "hover:border-success-dark",
        "dark:hover:border-success-light",
        "text-success-main",
        "border",
    ),
    warning: twMerge(
        "border-warning-main",
        "hover:border-warning-dark",
        "dark:hover:border-warning-light",
        "text-warning-main",
        "border",
    ),
    error: twMerge(
        "border-error-main",
        "hover:border-error-dark",
        "dark:hover:border-error-light",
        "text-error-main",
        "border",
    ),
    info: twMerge(
        "border-info-main",
        "hover:border-info-dark",
        "dark:hover:border-info-light",
        "text-info-main",
        "border",
    ),
    disabled: twMerge("border-disabled-main", "text-disabled-contrast", "border"),
};

const filledColorClasses: Record<string, string> = {
    primary: twMerge(
        "bg-primary-main",
        "hover:bg-primary-dark",
        "dark:hover:bg-primary-light",
        "text-primary-contrast",
    ),
    secondary: twMerge(
        "bg-secondary-main",
        "hover:bg-secondary-dark",
        "dark:hover:bg-secondary-light",
        "text-secondary-contrast",
    ),
    success: twMerge(
        "bg-success-main",
        "hover:bg-success-dark",
        "dark:hover:bg-success-light",
        "text-success-contrast",
    ),
    warning: twMerge(
        "bg-warning-main",
        "hover:bg-warning-dark",
        "dark:hover:bg-warning-light",
        "text-warning-contrast",
    ),
    error: twMerge(
        "bg-error-main",
        "hover:bg-error-dark",
        "dark:hover:bg-error-light",
        "text-error-contrast",
    ),
    info: twMerge(
        "bg-info-main",
        "hover:bg-info-dark",
        "dark:hover:bg-info-light",
        "text-info-contrast",
    ),
    disabled: twMerge("bg-disabled-main", "text-disabled-contrast"),
};

const textColorClasses: Record<string, string> = {
    primary: twMerge("text-primary-main", "hover:bg-disabled-main"),
    secondary: twMerge("text-secondary-main", "hover:bg-disabled-main"),
    success: twMerge("text-success-main", "hover:bg-disabled-main"),
    warning: twMerge("text-warning-main", "hover:bg-disabled-main"),
    error: twMerge("text-error-main", "hover:bg-disabled-main"),
    info: twMerge("text-info-main", "hover:bg-disabled-main"),
    disabled: twMerge("text-disabled-main"),
};

function getButtonColorClass(
    variant: BUTTON_VARIANT = "filled",
    color: THEME_COLOR = "primary",
): string {
    if (variant === "outlined") {
        return outlinedColorClasses[color];
    } else if (variant === "text") {
        return textColorClasses[color];
    }
    return filledColorClasses[color];
}
