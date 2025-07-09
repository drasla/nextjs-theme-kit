import { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";
import ThemeProvider from "../../providers/theme/themeProvider";
import AsideProvider from "../../providers/aside/asideProvider";

type Props = {
    lang?: string;
} & PropsWithChildren;

async function HTML({ lang, children }: Props) {
    return (
        <ThemeProvider>
            <AsideProvider>
                <html lang={lang || "ko"}>
                    <body className={twMerge("theme-initial")}>{children}</body>
                </html>
            </AsideProvider>
        </ThemeProvider>
    );
}

export default HTML;
