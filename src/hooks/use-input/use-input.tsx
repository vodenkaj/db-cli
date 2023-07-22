import { Key, useInput as inkUseInput } from "ink";
import { useState } from "react";

export type InputState = {
    lastKey?: Key;
    lastInput: string;
};

const validKey = ["shift"] as const;

export const useInput = (props?: Parameters<typeof inkUseInput>[1]) => {
    const [input, setInput] = useState("");
    const [inputState, setInputState] = useState<InputState>({ lastInput: "" });

    const handleInput = (newInput: string, key: Key) => {
        if (key.delete) {
            setInput(input.substring(0, input.length - 1));
        } else if (
            !Object.entries(key).some(
                ([key, value]) => value && !validKey.includes(key as any),
            )
        ) {
            setInput(input + newInput);
        }
        setInputState({ lastInput: newInput, lastKey: key });
    };
    inkUseInput(handleInput, props);

    return {
        inputState,
        setInput,
        input,
    };
};
