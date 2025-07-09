import { BUTTON_VARIANT, THEME_COLOR, THEME_SIZE } from "../../types/theme";
import { ButtonHTMLAttributes, ForwardedRef, forwardRef, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";
import { getComponentSizeClass } from "../../functions";
import ButtonClient from "./client";

export type ButtonProps = {
    className?: string;
    variant?: BUTTON_VARIANT;
    size?: THEME_SIZE;
    loading?: boolean;
    color?: THEME_COLOR;
} & PropsWithChildren &
    ButtonHTMLAttributes<HTMLButtonElement>;

function Button({
    variant,
    color,
    type = "button",
    size = "medium",
    loading = false,
    disabled,
    onClick,
    className,
    children,
    ...props
}: ButtonProps, ref: ForwardedRef<HTMLButtonElement>) {
    const mergedClassName = twMerge(
        "relative overflow-hidden cursor-pointer",
        "rounded-md font-bold",
        "transition-all duration-300",
        getComponentSizeClass(size),
        disabled || loading
            ? getButtonColorClass(variant, "disabled")
            : getButtonColorClass(variant, color),
        className,
    );

    return (
        <>
            <button
                ref={ref}
                type={type}
                disabled={disabled || loading}
                className={mergedClassName}
                {...props}>
                {loading ? "Loading..." : children}
            </button>
            {onClick && (
                <ButtonClient
                    buttonRef={ref}
                    onClick={onClick}
                    color={color}
                    disabled={disabled || loading}
                />
            )}
        </>
    );
}

const ForwardedButton = forwardRef(Button);
ForwardedButton.displayName = "Button";

export default ForwardedButton;

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
