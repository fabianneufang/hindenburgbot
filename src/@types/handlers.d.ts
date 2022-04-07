import {Client, Guild} from "discord.js";

export type GuildHandler = {
    name: string;
    guildId?: string;
    initiate(client: Client, guild: Guild): Promise<void>;
}