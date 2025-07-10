import { THEME_SIZE } from "../../types/theme";
import { twMerge } from "tailwind-merge";

type Props = {
    className?: string;
    size?: THEME_SIZE;
};

function Spinner({ className, size = "medium" }: Props) {
    const sizeClasses = {
        small: "w-4 h-4",
        medium: "w-5 h-5",
        large: "w-6 h-6",
    };

    const mergedClassName = twMerge(["animate-spin", "text-current"], sizeClasses[size], className);

    return (
        <svg
            className={mergedClassName}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24">
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    );
}

export default Spinner;
