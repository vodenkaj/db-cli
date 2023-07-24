import { Box } from "ink";
import React, { useContext, useMemo, useState } from "react";

import { ConfigContext } from "@contexts/index.js";
import { Input, OnInputHandler } from "@comps/input/input.js";
import { InputStateContext } from "@contexts/index.js";

import { PageProps } from "types.js";

export const Connections = ({ setPage }: PageProps) => {
    const { urls } = useContext(ConfigContext);
    const { mode } = useContext(InputStateContext);

    const urlsArray = useMemo(() => urls.map(({ uri }) => uri), [urls]);

    const inputHandler: OnInputHandler = ({ inputState, input }) => {
        if (inputState?.lastKey?.return && input.length) {
            setPage("mongo", { uri: input });
            return;
        }
    };

    return (
        <Box flexDirection="column">
            <Input
                onInputHandler={inputHandler}
                isActive={mode === "INSERT"}
                prefix="> "
                suggestionProps={{
                    values: urlsArray,
                    options: {
                        matchingAlgorithm: "fuzzy",
                        showAllOnEmpty: true,
                    },
                }}
            />
        </Box>
    );
};
