import { Box, Text } from "ink";
import React, { useEffect, useMemo } from "react";

import { useInput, InputState as InputState } from "@hooks/use-input/index.js";
import {
    SugestionsProps,
    Suggestions,
} from "@comps/suggestions/suggestions.js";

export type OnInputHandler = (props: {
    inputState: InputState;
    input: string;
    setInput: (input: string) => void;
}) => void;

type Props = {
    prefix?: string;
    isActive: boolean;
    onInputHandler?: OnInputHandler;
    suggestionProps?: Omit<SugestionsProps, "input"> & { input?: string };
};

export const Input = ({
    onInputHandler,
    isActive,
    suggestionProps,
    prefix = "",
}: Props) => {
    const { input, inputState, setInput } = useInput({ isActive });

    useEffect(() => {
        onInputHandler?.({ inputState, input, setInput });
    }, [inputState]);

    const suggestions = useMemo(() => {
        if (!suggestionProps) {
            return null;
        }
        return (
            <Suggestions
                {...suggestionProps}
                input={suggestionProps.input ?? input}
                setInput={setInput}
            />
        );
    }, [suggestionProps]);

    return (
        <Box flexDirection="column">
            <Text>{`${prefix}${input}${isActive ? "│" : ""}`}</Text>
            {suggestions}
        </Box>
    );
};
