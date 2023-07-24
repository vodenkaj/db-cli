import { Box, Text } from "ink";
import React, { useContext, useEffect, useMemo, useState } from "react";
import fuzzy from "fuzzy";

import { InputStateContext } from "@contexts/index.js";
import { toPrefixTree } from "utils.js";

type MatchingAlgorithm = "fuzzy" | "prefix";
type Options = {
    matchingAlgorithm?: MatchingAlgorithm;
    showAllOnEmpty?: boolean;
};

export type SugestionsProps = {
    input: string;
    values: string[];
    setInput?: (value: string) => void;
    options?: Options;
};

export const Suggestions = ({
    input,
    values,
    setInput,
    options = { matchingAlgorithm: "fuzzy", showAllOnEmpty: false },
}: SugestionsProps) => {
    const { inputState } = useContext(InputStateContext);
    const [filteredValues, setFilteredValues] = useState<string[]>([]);
    const [selected, setSelected] = useState(-1);
    const memoizedValues = useMemo(() => {
        if (options.matchingAlgorithm === "prefix") {
            return toPrefixTree(values);
        } else {
            return values;
        }
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
        let fValues;
        if (!input.length && options.showAllOnEmpty) {
            fValues = values;
        } else if (options.matchingAlgorithm === "prefix") {
            fValues =
                (memoizedValues as Record<string, string[]>)[input]?.slice(
                    0,
                    5,
                ) ?? [];
        } else {
            fValues = values.filter((value) => fuzzy.match(input, value));
        }
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
