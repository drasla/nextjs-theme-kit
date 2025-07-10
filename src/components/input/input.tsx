"use client";

import {
    ChangeEventHandler,
    InputHTMLAttributes,
    PropsWithChildren,
    forwardRef,
    ReactNode,
    ForwardedRef,
} from "react";
import { twMerge } from "tailwind-merge";
import { THEME_COLOR, THEME_SIZE } from "../../types/theme";
import { getComponentSizeClass, getTextAlignClass } from "../../functions";
import InputClient from "./client";

export type InputProps = {
    className?: string;
    label?: string;
    size?: THEME_SIZE;
    disabled?: boolean;
    value?: string;
    color?: THEME_COLOR;
    fullWidth?: boolean;
    shrink?: boolean;
    error?: string;
    onChange?: ChangeEventHandler<HTMLInputElement>;
    formatMode?: "numeric" | "uppercase" | "lowercase" | "alphanumeric";
    prefix?: ReactNode;
    suffix?: ReactNode;
    textAlign?: "left" | "center" | "right";
    inputPrefix?: string;
    inputSuffix?: string;
    helperText?: string;
} & PropsWithChildren &
    Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "prefix">;

function Input(
    {
        className,
        size,
        textAlign,
        fullWidth,
        type,
        label,
        value,
        error,
        placeholder,
        disabled,
        shrink: shrinkProp,
        prefix,
        suffix,
        inputPrefix,
        inputSuffix,
        helperText,
        onChange,
        onKeyDown,
        formatMode,
        ...props
    }: InputProps,
    ref: ForwardedRef<HTMLInputElement>,
) {
    const shrink = shrinkProp || !!prefix;
    const displayValue = `${inputPrefix}${value}${inputSuffix}`;
    const isActive = value !== "" || !!prefix;

    const fieldsetClassName = twMerge(
        ["absolute", "inset-0"],
        ["rounded-lg", "border", "border-disabled-main"],
        ["transition-colors", "pointer-event-none"],
        error ? "border-error-main" : "",
    );
    const legendClassName = twMerge(["invisible", "ml-2.5", "px-0.5", "h-0"]);
    const innerContainerClassName = twMerge(
        ["flex", "items-center", "gap-3", "px-3"],
        getComponentSizeClass(size),
    );
    const floatingLabelClassName = twMerge(
        ["absolute", "left-3", "px-1"],
        ["pointer-events-none", "transition-all", "duration-200"],
        isActive
            ? ["text-xs", "-top-2", "transform-none"]
            : ["text-base", "top-1/2", "-translate-y-1/2"],
        error && "text-error-main",
    );
    const inputClassName = twMerge(
        ["flex-1", "outline-none", "bg-transparent", "z-1"],
        getTextAlignClass(textAlign),
    );

    return (
        <>
            <div className={twMerge("w-full", className)}>
                <div className={twMerge(["relative", fullWidth && "w-full"])}>
                    <fieldset className={fieldsetClassName}>
                        {isActive && label && <legend className={legendClassName}>{label}</legend>}
                    </fieldset>

                    <div className={innerContainerClassName}>
                        {prefix && <div>{prefix}</div>}
                        <input
                            ref={ref}
                            className={inputClassName}
                            type={type}
                            placeholder={label && !isActive ? undefined : placeholder}
                            value={displayValue}
                            disabled={disabled}
                            {...props}
                        />
                        {suffix && <div>{suffix}</div>}
                    </div>

                    {label && <label className={floatingLabelClassName}>{label}</label>}
                </div>
                {(error || helperText) && (
                    <div
                        className={twMerge(
                            ["text-xs", "mt-1", "px-3"],
                            error ? "text-error-main" : "text-disabled-contrast",
                        )}>
                        {error || helperText}
                    </div>
                )}
            </div>
            {(onChange || onKeyDown || formatMode) && (
                <InputClient
                    inputRef={ref}
                    value={value}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    formatMode={formatMode}
                    inputPrefix={inputPrefix}
                    inputSuffix={inputSuffix}
                    shrink={shrink}
                    prefix={prefix}
                    error={error}
                />
            )}
        </>
    );
}

const ForwardedInput = forwardRef(Input);
ForwardedInput.displayName = "Input";

export default ForwardedInput;
