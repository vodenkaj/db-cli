import { useInput } from "ink";
import React, { PropsWithChildren, useEffect, useState } from "react";

import { InputState } from "@hooks/use-input/use-input.js";

type InputStateContextValues = {
    inputState: InputState;
    mode: InputMode;
    setMode: (mode: InputMode) => void;
};

export const InputStateContext = React.createContext<InputStateContextValues>({
    inputState: {
        lastInput: "",
    },
    mode: "INSERT",
    setMode: () => {},
});

export type InputMode = "COMMAND" | "INSERT" | "NORMAL";
export const InputStateContextProvider = ({ children }: PropsWithChildren) => {
    const [inputState, setInputState] = useState<InputState>({ lastInput: "" });
    const [mode, setMode] = useState<InputMode>("INSERT");
    useInput((input, key) => {
        setInputState({ lastInput: input, lastKey: key });
    });

    useEffect(() => {
        const { lastKey, lastInput } = inputState;
        if (mode === "NORMAL" && lastInput === ":") {
            setMode("COMMAND");
        } else if (mode === "NORMAL" && lastInput === "i") {
            setMode("INSERT");
        } else if (lastKey?.escape) {
            setMode("NORMAL");
        }
    }, [inputState]);

    return (
        <InputStateContext.Provider value={{ mode, inputState, setMode }}>
            {children}
        </InputStateContext.Provider>
    );
};
