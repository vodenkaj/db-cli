import { Box, Text } from "ink";
import Spinner from "ink-spinner";
import { MongoClient } from "mongodb";
import React, { useContext } from "react";
import { useEffect, useState } from "react";
import XRegExp from "xregexp";

import { Input, OnInputHandler } from "@comps/input/input.js";
import { InputStateContext } from "@contexts/input-state/input-state.js";
import { PageProps } from "types.js";
import { editTextInEditor } from "utils.js";
import {
    MongoCommandInvoker,
    isValidCollectionCommand,
    isValidGeneralCommand,
} from "./commands.js";

export const Mongo = ({ uri }: PageProps & { uri: string }) => {
    const { mode } = useContext(InputStateContext);

    const [invoker, setInvoker] = useState<MongoCommandInvoker>();
    const [localInput, setLocalInput] = useState("");

    useEffect(() => {
        (async () => {
            const mongo = new MongoClient(uri);
            await mongo.connect();
            const invoker = new MongoCommandInvoker(mongo);
            await invoker.prepareCommandNames();
            setInvoker(invoker);
            console.log("Connected!");
        })();
    }, []);

    const inputHandler: OnInputHandler = async ({
        inputState,
        input,
        setInput,
    }) => {
        if (inputState.lastKey?.return) {
            if (!input.length) {
                return;
            }

            try {
                const [generalCommand = null, ...generalArgs] =
                    input.split(/ /);
                const [
                    _,
                    collectionName,
                    collectionCommand,
                    collectionArgs = null,
                ] = input.split(/^db\.(\w+)\.(\w+)\((.*)\)/);
                if (isValidGeneralCommand(generalCommand)) {
                    invoker?.invokeGeneralCommand(
                        generalCommand,
                        ...generalArgs,
                    );
                } else if (isValidCollectionCommand(collectionCommand)) {
                    let args;
                    if (collectionArgs?.match(/^{.*}$/)) {
                        const [filter, proj = ""] = XRegExp.matchRecursive(
                            collectionArgs ?? "",
                            "\\{",
                            "\\}",
                            "g",
                        );
                        args = [filter, proj].map((v) => eval(`({${v}})`));
                    } else if (collectionArgs?.match(/^\[.*\]$/)) {
                        const [aggregation] = XRegExp.matchRecursive(
                            collectionArgs ?? "",
                            "\\[",
                            "\\]",
                        );
                        args = eval(`([${aggregation}])`);
                    }
                    invoker?.invokeCollectionCommand(
                        collectionCommand,
                        collectionName,
                        args ?? [],
                    );
                } else {
                    console.error("Invalid command");
                }
            } catch (e) {
                console.error(e);
            }
            setInput("");
            setLocalInput("");
        } else if (inputState.lastKey?.ctrl && inputState.lastInput === "e") {
            setInput(editTextInEditor(input));
        }
        setLocalInput(input);
    };

    if (!invoker || !invoker.commandNames) {
        return (
            <Box>
                <Spinner />
                <Text color="green">{"Connecting to the database."}</Text>
            </Box>
        );
    }

    return (
        <Box>
            <Input
                isActive={mode === "INSERT"}
                prefix={`${invoker.db.databaseName}> `}
                onInputHandler={inputHandler}
                suggestionProps={{
                    input: localInput,
                    values: invoker.commandNames,
                    options: {
                        matchingAlgorithm: "prefix",
                    },
                }}
            />
        </Box>
    );
};
