import { PropsWithChildren } from "react";
import { HTML, Layout } from "../src";
import "../src/styles/index.css";

function RootLayout({ children }: PropsWithChildren) {
    return (
        <HTML>
            <Layout>{children}</Layout>
        </HTML>
    );
}

export default RootLayout;
