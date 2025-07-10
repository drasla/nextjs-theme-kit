import { PropsWithChildren, ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { AsideUIProvider, ThemeUIProvider } from "../../providers";
import ToastProvider from "../../providers/toast/toastProvider";

type Props = {
    aside?: ReactNode;
    header?: ReactNode;
    footer?: ReactNode;
    toast?: ReactNode;
} & PropsWithChildren;

function Layout({ aside, header, footer, toast, children }: Props) {
    return (
        <>
            <div className={twMerge(["w-full", "min-h-dvh"], ["flex"])}>
                {aside && <AsideUIProvider>{aside}</AsideUIProvider>}
                <div
                    className={twMerge(
                        ["flex-1", "w-full"],
                        ["flex", "flex-col", "relative"],
                        ["transition-all", "duration-200"],
                        aside ? "lg:ml-(--width-aside)" : "",
                    )}>
                    {header && (
                        <AsideUIProvider>
                            <ThemeUIProvider>{header}</ThemeUIProvider>
                        </AsideUIProvider>
                    )}
                    <main
                        className={twMerge([
                            "w-full",
                            "min-h-[calc(100dvh-var(--height-header))]",
                        ])}>
                        {children}
                    </main>
                    {footer}
                </div>
            </div>
            {toast && <ToastProvider />}
        </>
    );
}

export default Layout;
