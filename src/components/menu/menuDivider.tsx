import { twMerge } from "tailwind-merge";

type MenuDividerProps = {
    className?: string;
};

function MenuDivider({ className }: MenuDividerProps) {
    return (
        <div
            className={twMerge(
                ["h-px", "my-1"],
                ["bg-light-divider", "dark:bg-dark-divider"],
                className,
            )}
        />
    );
}

export default MenuDivider;
