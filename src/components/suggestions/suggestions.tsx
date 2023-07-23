import { Box, Text } from "ink";
import React, { useContext, useEffect, useMemo, useState } from "react";

import { InputStateContext } from "@contexts/index.js";
import { toPrefixTree } from "utils.js";

export type SugestionsProps = {
    input: string;
    values: string[];
    setInput?: (value: string) => void;
};

export const Suggestions = ({ input, values, setInput }: SugestionsProps) => {
    const { inputState } = useContext(InputStateContext);
    const [filteredValues, setFilteredValues] = useState<string[]>([]);
    const [selected, setSelected] = useState(-1);
    const prefixTree = useMemo(() => {
        return toPrefixTree(values);
    }, [values]);

    useEffect(() => {
        if (inputState.lastKey?.tab) {
            const idx = Math.min(
                Math.max((inputState.lastKey.shift ? -1 : 1) + selected, 0),
                filteredValues.length - 1,
            );
            setSelected(idx);

            if (filteredValues[idx] && setInput) {
                setInput(filteredValues[idx]);
                setSelected(0);
            }
        }
        if (inputState.lastKey?.return || inputState.lastKey?.delete) {
            setSelected(-1);
        }
    }, [inputState]);

    useEffect(() => {
        const fValues = prefixTree[input]?.slice(0, 5) ?? [];
        setFilteredValues(fValues);
    }, [input, values]);

    return (
        <Box flexDirection="column">
            {filteredValues.map((value, id) => (
                <Text
                    key={`${value}-${id}`}
                    backgroundColor={id === selected ? "gray" : "black"}
                >
                    {value}
                </Text>
            ))}
        </Box>
    );
};
