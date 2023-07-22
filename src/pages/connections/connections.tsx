import { Box, Text } from "ink";
import React, { useContext, useState } from "react";
import fuzzy from "fuzzy";

import { ConfigContext } from "@contexts/index.js";
import { Input, OnInputHandler } from "@comps/input/input.js";
import { InputStateContext } from "@contexts/index.js";

import { PageProps } from "types.js";

export const Connections = ({ setPage }: PageProps) => {
    const { urls } = useContext(ConfigContext);
    const { mode } = useContext(InputStateContext);

    const [filteredUrls, setUrls] = useState(urls);
    const [url, setUrl] = useState(urls[0]);

    const inputHandler: OnInputHandler = ({ inputState, input }) => {
        if (inputState?.lastKey?.return && url) {
            setPage("mongo", { uri: url.uri });
            return;
        }
        const filtered = urls.filter(({ uri }) => fuzzy.match(input, uri));
        setUrls(filtered);
        setUrl(filteredUrls[0]);
    };

    return (
        <Box flexDirection="column">
            <Box borderStyle="classic" width={100}>
                {filteredUrls.map((url, idx) => (
                    <Text key={`text_${idx}`} backgroundColor="grey">
                        {url.uri}
                    </Text>
                ))}
            </Box>
            <Input
                onInputHandler={inputHandler}
                isActive={mode === "INSERT"}
                prefix="> "
            />
        </Box>
    );
};
