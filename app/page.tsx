"use client";

import Input from "../src/components/input/input";
import { useState } from "react";
import Select from "../src/components/select/select";
import Option from "../src/components/select/option";
import Button from "../src/components/button/button";

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
            <Select displayValue={""}>
                <Option value={"1"}>Value1</Option>
                <Option value={"2"}>Value2</Option>
            </Select>
            <Button onClick={() => console.log("!")}>버튼</Button>
        </main>
    );
}

export default RootPage;
