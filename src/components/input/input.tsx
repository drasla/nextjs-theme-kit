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
        name,
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
        readOnly,
        color,
        ...props
    }: InputProps,
    ref: ForwardedRef<HTMLInputElement>,
) {
    const shrink = shrinkProp || !!prefix;
    const displayValue =
        value !== undefined ? `${inputPrefix ?? ""}${value}${inputSuffix ?? ""}` : undefined;

    const fieldsetClassName = twMerge(
        ["absolute", "inset-0"],
        ["rounded-lg", "border", "border-disabled-main"],
        ["transition-colors", "pointer-event-none"],
        error ? "border-error-main" : "",
    );
    const legendClassName = twMerge(["hidden", "ml-2.5", "px-0.5", "h-0"]);
    const innerContainerClassName = twMerge(
        ["flex", "items-center", "gap-3", "px-3"],
        getComponentSizeClass(size),
    );
    const floatingLabelClassName = twMerge(
        ["absolute", "left-4", "px-1"],
        ["pointer-events-none", "transition-all", "duration-200"],
        ["text-base", "top-1/2", "-translate-y-1/2"], // 기본 상태로 설정
        error && "text-error-main",
    );
    const inputClassName = twMerge(
        ["flex-1", "outline-none", "bg-transparent", "z-1"],
        getTextAlignClass(textAlign),
    );

    const inputProps =
        value !== undefined
            ? {
                  value: displayValue,
                  onChange: onChange || (() => {}),
              }
            : {};

    return (
        <>
            <div className={twMerge("w-full", className)}>
                <div className={twMerge(["relative", fullWidth && "w-full"])}>
                    <fieldset className={fieldsetClassName}>
                        {label && <legend className={legendClassName}>{label}</legend>}
                    </fieldset>

                    <div className={innerContainerClassName}>
                        {prefix && <div>{prefix}</div>}
                        <input
                            ref={ref}
                            id={name}
                            name={name}
                            className={inputClassName}
                            type={type}
                            placeholder={!label ? placeholder : undefined}
                            value={displayValue}
                            disabled={disabled}
                            readOnly={readOnly}
                            {...inputProps}
                            {...props}
                        />
                        {suffix && <div>{suffix}</div>}
                    </div>

                    {label && (
                        <label htmlFor={name} className={floatingLabelClassName}>
                            {label}
                        </label>
                    )}
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
            <InputClient
                inputRef={ref}
                value={value || ""}
                onChange={onChange}
                onKeyDown={onKeyDown}
                formatMode={formatMode}
                inputPrefix={inputPrefix}
                inputSuffix={inputSuffix}
                shrink={shrink}
                prefix={prefix}
                error={error}
                label={label}
                name={name}
                placeholder={placeholder}
                color={color}
            />
        </>
    );
}

const ForwardedInput = forwardRef(Input);
ForwardedInput.displayName = "Input";

export default ForwardedInput;
