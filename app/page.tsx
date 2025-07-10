"use client";

import Input from "../src/components/input/input";
import { useState } from "react";

function RootPage() {
    const [string, setString] = useState("");
    return (
        <main className={"pt-20"}>
            <Input
                name={"url"}
                value={string}
                label={"Shorten URL"}
                onChange={e => setString(e.target.value)}
            />
        </main>
    );
}

export default RootPage;
