import { Connections } from "pages/index.js";
import { Mongo } from "pages/mongo/mongo.js";

export const pages = {
    connections: Connections,
    mongo: Mongo,
} as const;

export type PageName = keyof typeof pages;

export type PagePropsWithoutSetPage<T extends PageName> = Omit<
    Parameters<typeof pages[T]>[number],
    "setPage"
>;

export type PageProps = {
    setPage: <T extends PageName>(
        page: T,
        ...args: PagePropsWithoutSetPage<T> extends Record<PropertyKey, never>
            ? [props?: PagePropsWithoutSetPage<T>]
            : [props: PagePropsWithoutSetPage<T>]
    ) => void;
};
