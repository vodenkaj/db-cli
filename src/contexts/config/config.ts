import React from "react";

type Config = {
    urls: {
        type: "mongo";
        uri: string;
    }[];
};

export const ConfigContext = React.createContext<Config>({
    urls: [],
});

export const loadConfig = (): Config => {
    return {
        urls: [{ type: "mongo", uri: "mongodb://localhost:27017/" }],
    };
};
