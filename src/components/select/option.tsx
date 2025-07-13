"use client";

import { PropsWithChildren, useContext } from "react";
import { SelectContext } from "./select";
import { twMerge } from "tailwind-merge";
import { TbCircleCheck } from "react-icons/tb";

type OptionProps = {
    value: string;
    className?: string;
} & PropsWithChildren;

function Option({ value, className, children }: OptionProps) {
    const { onChange, selectedValue } = useContext(SelectContext);

    const isSelected = selectedValue === value;

    const handleClick = () => {
        onChange(value);
    };

    return (
        <div
            onClick={handleClick}
            className={twMerge(
                ["px-4", "py-2", "cursor-pointer"],
                ["flex", "items-center", "gap-2", "justify-between"],
                ["hover:bg-disabled-light", "active:bg-disabled-main"],
                ["transition-colors", "duration-300"],
                isSelected && ["bg-primary-main", "text-primary-contrast"],
                className,
            )}>
            <div className={twMerge("flex-1")}>{children}</div>
            {isSelected && <TbCircleCheck size={24} />}
        </div>
    );
}

export default Option;
