import { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";
import ThemeProvider from "../../providers/theme/themeProvider";
import AsideProvider from "../../providers/aside/asideProvider";

type Props = {
    lang?: string;
    className?: string;
} & PropsWithChildren;

async function HTML({ lang, className, children }: Props) {
    return (
        <ThemeProvider>
            <AsideProvider>
                <html lang={lang || "en"}>
                    <body className={twMerge("theme-initial", className)}>{children}</body>
                </html>
            </AsideProvider>
        </ThemeProvider>
    );
}

export default HTML;
