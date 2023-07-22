import React, { useState } from "react";

import { ConfigContext, loadConfig } from "@contexts/index.js";
import { PageName, PageProps, PagePropsWithoutSetPage, pages } from "types.js";
import { Command } from "@comps/command/command.js";
import { InputStateContextProvider } from "@contexts/input-state/input-state.js";

export default function App() {
    const [Page, setPage] = useState<typeof pages[PageName]>(
        () => pages.connections,
    );

    const [props, setProps] = useState<PagePropsWithoutSetPage<PageName>>();

    const handleSetPage = ((page, args) => {
        setPage(() => pages[page]);
        setProps(args);
    }) as PageProps["setPage"];

    return (
        <ConfigContext.Provider value={loadConfig()}>
            <InputStateContextProvider>
                {/* @ts-ignore-next-line*/}
                <Page setPage={handleSetPage} {...props} />
                <Command setPage={handleSetPage} />
            </InputStateContextProvider>
        </ConfigContext.Provider>
    );
}
