import { Db, MongoClient } from "mongodb";

type GeneralCommand = typeof generalCommands[number];
type CollectionCommand = typeof collectionCommands[number];
type Command = GeneralCommand | CollectionCommand;

const collectionCommands = [
    "aggregate",
    "bulkWrite",
    "countDocuments",
    "deleteMany",
    "deleteOne",
    "distinct",
    "estimatedDocumentCount",
    "find",
    "findOne",
    "renameCollection",
    "findOneAndDelete",
    "findOneAndReplace",
    "findOneAndUpdate",
    "insertMany",
    "insertOne",
    "isCapped",
    "replaceOne",
    "updateMany",
    "updateOne",
    "compactStructuredEncryptionData",
    "convertToCapped",
    "createIndexes",
    "createIndex",
    "ensureIndex",
    "getIndexes",
    "getIndexSpecs",
    "getIndices",
    "getIndexKeys",
    "dropIndexes",
    "dropIndex",
    "totalIndexSize",
    "getDB",
    "getMongo",
    "dataSize",
    "storageSize",
    "totalSize",
    "drop",
    "exists",
    "getFullName",
    "getName",
    "runCommand",
    "explain",
    "stats",
    "latencyStats",
    "initializeOrderedBulkOp",
    "initializeUnorderedBulkOp",
    "getPlanCache",
    "validate",
    "hideIndex",
    "unhideIndex",
] as const;
const generalCommands = ["use"] as const;

const implementedCommands: Command[] = [
    "use",
    "findOne",
    "find",
    "aggregate",
    "countDocuments",
];

export class MongoCommandInvoker {
    client: MongoClient;
    db: Db;
    commandNames?: string[];

    constructor(client: MongoClient) {
        this.client = client;
        this.db = client.db();
    }

    async invokeGeneralCommand(command: GeneralCommand, ...args: any[]) {
        return await commands[command].bind(this)(args[0], args[1]);
    }

    async invokeCollectionCommand(
        command: CollectionCommand,
        collectionName: string,
        args: Record<any, any>[],
    ) {
        return await commands[command].bind(this)(collectionName, args);
    }

    async prepareCommandNames() {
        const collections = (await this.db.collections()).map(
            ({ collectionName }) => collectionName,
        );
        const collectionCommandsKeys = collectionCommands
            .filter((cmd) => implementedCommands.includes(cmd))
            .flatMap((cmd) =>
                collections.map((collection) => `db.${collection}.${cmd}`),
            );
        this.commandNames = [...collectionCommandsKeys, ...generalCommands];

        return this.commandNames;
    }
}

export const isValidGeneralCommand = (
    command?: string | null,
): command is GeneralCommand => {
    return generalCommands.includes(command as any);
};

export const isValidCollectionCommand = (
    command?: string | null,
): command is CollectionCommand => {
    return collectionCommands.includes(command as any);
};

export const commands: Record<
    Command,
    (
        this: MongoCommandInvoker,
        value: string,
        args: Record<any, any>[],
    ) => Promise<void> | void
> = {
    use: async function (
        this: MongoCommandInvoker,
        name: string,
    ): Promise<void> {
        console.log(name);
        this.db = this.client.db(name);
        await this.prepareCommandNames();
    },
    aggregate: async function (this, collection, filter): Promise<void> {
        const results = [];
        for await (const doc of this.db
            .collection(collection)
            .aggregate(filter)) {
            results.push(doc);
        }
        console.log(JSON.stringify(results));
    },
    bulkWrite: function (this: MongoCommandInvoker): Promise<void> {
        throw new Error("Function not implemented.");
    },
    countDocuments: async function (this, collection, args): Promise<void> {
        const count = await this.db
            .collection(collection)
            .countDocuments(args[0]);
        console.log(count);
    },
    deleteMany: function (this: MongoCommandInvoker): Promise<void> {
        throw new Error("Function not implemented.");
    },
    deleteOne: function (this: MongoCommandInvoker): Promise<void> {
        throw new Error("Function not implemented.");
    },
    distinct: function (this: MongoCommandInvoker): Promise<void> {
        throw new Error("Function not implemented.");
    },
    estimatedDocumentCount: function (
        this: MongoCommandInvoker,
    ): Promise<void> {
        throw new Error("Function not implemented.");
    },
    find: async function (
        this: MongoCommandInvoker,
        collection: string,
    ): Promise<void> {
        const data = await this.db.collection(collection).findOne();
        console.log(data);
    },
    findOne: async function (
        this: MongoCommandInvoker,
        collection,
        filter,
    ): Promise<void> {
        const data = await this.db.collection(collection).findOne(filter[0]);
        console.log(JSON.stringify(data));
    },
    renameCollection: function (this: MongoCommandInvoker): Promise<void> {
        throw new Error("Function not implemented.");
    },
    findOneAndDelete: function (this: MongoCommandInvoker): Promise<void> {
        throw new Error("Function not implemented.");
    },
    findOneAndReplace: function (this: MongoCommandInvoker): Promise<void> {
        throw new Error("Function not implemented.");
    },
    findOneAndUpdate: function (this: MongoCommandInvoker): Promise<void> {
        throw new Error("Function not implemented.");
    },
    insertMany: function (this: MongoCommandInvoker): Promise<void> {
        throw new Error("Function not implemented.");
    },
    insertOne: function (this: MongoCommandInvoker): Promise<void> {
        throw new Error("Function not implemented.");
    },
    isCapped: function (this: MongoCommandInvoker): Promise<void> {
        throw new Error("Function not implemented.");
    },
    replaceOne: function (this: MongoCommandInvoker): Promise<void> {
        throw new Error("Function not implemented.");
    },
    updateMany: function (this: MongoCommandInvoker): Promise<void> {
        throw new Error("Function not implemented.");
    },
    updateOne: function (this: MongoCommandInvoker): Promise<void> {
        throw new Error("Function not implemented.");
    },
    compactStructuredEncryptionData: function (
        this: MongoCommandInvoker,
    ): Promise<void> {
        throw new Error("Function not implemented.");
    },
    convertToCapped: function (this: MongoCommandInvoker): Promise<void> {
        throw new Error("Function not implemented.");
    },
    createIndexes: function (this: MongoCommandInvoker): Promise<void> {
        throw new Error("Function not implemented.");
    },
    createIndex: function (this: MongoCommandInvoker): Promise<void> {
        throw new Error("Function not implemented.");
    },
    ensureIndex: function (this: MongoCommandInvoker): Promise<void> {
        throw new Error("Function not implemented.");
    },
    getIndexes: function (this: MongoCommandInvoker): Promise<void> {
        throw new Error("Function not implemented.");
    },
    getIndexSpecs: function (this: MongoCommandInvoker): Promise<void> {
        throw new Error("Function not implemented.");
    },
    getIndices: function (this: MongoCommandInvoker): Promise<void> {
        throw new Error("Function not implemented.");
    },
    getIndexKeys: function (this: MongoCommandInvoker): Promise<void> {
        throw new Error("Function not implemented.");
    },
    dropIndexes: function (this: MongoCommandInvoker): Promise<void> {
        throw new Error("Function not implemented.");
    },
    dropIndex: function (this: MongoCommandInvoker): Promise<void> {
        throw new Error("Function not implemented.");
    },
    totalIndexSize: function (this: MongoCommandInvoker): Promise<void> {
        throw new Error("Function not implemented.");
    },
    getDB: function (this: MongoCommandInvoker): Promise<void> {
        throw new Error("Function not implemented.");
    },
    getMongo: function (this: MongoCommandInvoker): Promise<void> {
        throw new Error("Function not implemented.");
    },
    dataSize: function (this: MongoCommandInvoker): Promise<void> {
        throw new Error("Function not implemented.");
    },
    storageSize: function (this: MongoCommandInvoker): Promise<void> {
        throw new Error("Function not implemented.");
    },
    totalSize: function (this: MongoCommandInvoker): Promise<void> {
        throw new Error("Function not implemented.");
    },
    drop: function (this: MongoCommandInvoker): Promise<void> {
        throw new Error("Function not implemented.");
    },
    exists: function (this: MongoCommandInvoker): Promise<void> {
        throw new Error("Function not implemented.");
    },
    getFullName: function (this: MongoCommandInvoker): Promise<void> {
        throw new Error("Function not implemented.");
    },
    getName: function (this: MongoCommandInvoker): Promise<void> {
        throw new Error("Function not implemented.");
    },
    runCommand: function (this: MongoCommandInvoker): Promise<void> {
        throw new Error("Function not implemented.");
    },
    explain: function (this: MongoCommandInvoker): Promise<void> {
        throw new Error("Function not implemented.");
    },
    stats: function (this: MongoCommandInvoker): Promise<void> {
        throw new Error("Function not implemented.");
    },
    latencyStats: function (this: MongoCommandInvoker): Promise<void> {
        throw new Error("Function not implemented.");
    },
    initializeOrderedBulkOp: function (
        this: MongoCommandInvoker,
    ): Promise<void> {
        throw new Error("Function not implemented.");
    },
    initializeUnorderedBulkOp: function (
        this: MongoCommandInvoker,
    ): Promise<void> {
        throw new Error("Function not implemented.");
    },
    getPlanCache: function (this: MongoCommandInvoker): Promise<void> {
        throw new Error("Function not implemented.");
    },
    validate: function (this: MongoCommandInvoker): Promise<void> {
        throw new Error("Function not implemented.");
    },
    hideIndex: function (this: MongoCommandInvoker): Promise<void> {
        throw new Error("Function not implemented.");
    },
    unhideIndex: function (this: MongoCommandInvoker): Promise<void> {
        throw new Error("Function not implemented.");
    },
};
