import { PropsWithChildren } from "react";
import { AsideStateProvider } from "./client";

function AsideProvider({ children }: PropsWithChildren) {
    return (
        <>
            {children}
            <AsideStateProvider />
        </>
    );
}

export default AsideProvider;
