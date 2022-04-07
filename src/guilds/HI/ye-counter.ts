import {GuildHandler} from "../../@types/handlers";
import * as guilds from "../../database/guilds";

export default {
    name: "Ye-Counter",
    initiate: async (client, guild) => {
        client.on("messageCreate", async message => { if (!message.guild || message.guild.id !== guild.id) return;
            if (!message.content.toLowerCase().includes("ye")) return;
            const document = await guilds.get(message.guild.id)
            const word = message.content.toLowerCase().split(" ").filter(e => e.includes("ye"))
            // give out word that is used the most in the array
            const mostUsed = word.reduce((a, b) => word.filter(e => e === a).length > word.filter(e => e === b).length ? a : b)
            // if (!document.handlerDatabase.yeCounter) document.handlerDatabase = {...document.handlerDatabase, yeCounter: {}}
            // if (!document.handlerDatabase.yeCounter[message.author.id]) document.handlerDatabase.yeCounter[message.author.id] = {}
            document.handlerDatabase = {
                ...document.handlerDatabase,
                yeCounter: {
                    ...(document.handlerDatabase.yeCounter || {}),
                    [message.author.id]: {
                        [mostUsed]: ((document.handlerDatabase.yeCounter && document.handlerDatabase.yeCounter[message.author.id]) ? document.handlerDatabase.yeCounter[message.author.id][mostUsed] || 0 : 0) + 1
                    }
                }
            }
            await document.safeSave()
        })
    }
} as GuildHandler