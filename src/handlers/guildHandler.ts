import {Client} from "discord.js";
import {catalog} from "../guilds/catalog";
import fs from "fs";
import {join} from "path";
import {hindenburgLogger} from "../utils/logger/hindenburg";
import {GuildHandler} from "../@types/handlers";

export default async (client: Client): Promise<void> => {
    let handlers: GuildHandler[] = []
    for (const guild in catalog) {
        if (!client.guilds.cache.find(e => e.id === catalog[guild])) continue;
        handlers = [...handlers, ...await nestHandlers(`../guilds/${guild}`, catalog[guild])]
    }
    for (const handler of handlers) {
        handler.initiate(client, await client.guilds.fetch(handler.guildId as string))
    }
}

function nestHandlers(relativePath: string, guildId: string): Promise<GuildHandler[]> {
    return new Promise(resolve => {
        fs.readdir(join(__dirname, relativePath), async (err, files) => {
            if (err) return hindenburgLogger.error(err);

            let arr: GuildHandler[] = [];
            if (files) {
                for (const file of files) {
                    if (
                        file === "commands"
                    ) continue;
                    if (file.endsWith(".js") && !file.startsWith("_")) {
                        const handler: GuildHandler = (await import(`${relativePath}/${file}`)).default;
                        arr = [...arr, {
                            ...handler,
                            guildId
                        }]
                    } else if (!file.includes(".")) {
                        arr = [...arr, ...await nestHandlers(`${relativePath}/${file}`, guildId)]
                    }
                }
            }
            return resolve(arr)
        })
    })
}