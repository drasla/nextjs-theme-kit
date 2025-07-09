import { PropsWithChildren } from "react";
import { ToastStateProvider } from "./client";

function ToastProvider({ children }: PropsWithChildren) {
    return (
        <>
            {children}
            <ToastStateProvider />
        </>
    );
}

export default ToastProvider;
