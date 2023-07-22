import React, { useContext } from "react";

import { InputStateContext } from "@contexts/index.js";
import { Input, OnInputHandler } from "@comps/input/input.js";
import { PageProps } from "types.js";
import { Box, Text } from "ink";

export const Command = ({ setPage }: PageProps) => {
    const isValidCommand = (value: string): value is keyof typeof commands => {
        return value in commands;
    };
    const commands = {
        q: () => {
            process.exit();
        },
        connections: () => {
            setPage("connections");
        },
    };
    const { mode, setMode } = useContext(InputStateContext);

    const inputHandler: OnInputHandler = ({ inputState, setInput, input }) => {
        if (mode !== "COMMAND") {
            return;
        }

        if (inputState.lastKey?.return) {
            if (isValidCommand(input)) {
                commands[input]();
            } else {
                console.error("Invalid command");
            }
            setMode("INSERT");
            setInput("");
        }
    };

    return (
        <Box marginTop={1}>
            <Text
                bold
                backgroundColor={mode === "COMMAND" ? "red" : "white"}
                color={"black"}
            >
                {`  ${mode}  `}
            </Text>
            <Input
                isActive={mode === "COMMAND"}
                onInputHandler={inputHandler}
                prefix={mode === "COMMAND" ? ":" : ""}
            />
        </Box>
    );
};
