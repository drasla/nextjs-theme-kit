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
                label={"Shorten"}
                color={"warning"}
                placeholder={"입력값을 넣어야 함"}
                onChange={e => setString(e.target.value)}
            />
        </main>
    );
}

export default RootPage;
