import { fileSync } from "tmp";
import fs from "fs";
import { spawnSync } from "child_process";

export const hideCursor = () => {
    // cursor is messed up, after closing editor,
    // we are hiding it completly instead
    process.stdout.write("\u001B[?25l");
};

export const editTextInEditor = (input: string) => {
    const tmpFile = fileSync();
    fs.writeFileSync(tmpFile.name, input);
    spawnSync(process.env.EDITOR ?? "vim", [tmpFile.name], {
        stdio: "inherit",
    });
    const output = fs.readFileSync(tmpFile.name, { encoding: "utf8" });
    tmpFile.removeCallback();
    hideCursor();

    return output.replaceAll("\n", "");
};

export const toPrefixTree = (keys: string[]) => {
    return keys
        .sort((a, b) => a.length - b.length)
        .reduce<Record<string, string[]>>((obj, key) => {
            let str = "";
            for (const char of key) {
                str += char;
                if (!(str in obj)) {
                    obj[str] = [];
                }
                obj[str].push(key);
            }

            return obj;
        }, {});
};
