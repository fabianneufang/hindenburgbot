import {GuildHandler} from "../../@types/handlers";
import * as guilds from "../../database/guilds";

export default {
    name: "Test",
    initiate: async (client, guild) => {
        console.log("initiated")
        console.log(guild.id)
        client.on("messageCreate", async message => { if (!message.guild || message.guild.id !== guild.id) return;
            const document = await guilds.get(message.guild.id)
            if (message.content === "1") {
                document.handlerDatabase = {
                    ...document.handlerDatabase,
                    [Math.floor(Math.random() * 10000).toString()]: Math.floor(Math.random() * 10000000000)
                }
                await document.safeSave()
            }
            console.log(document.handlerDatabase, typeof document.handlerDatabase)
            console.log(message.content)
        })

        client.on("messageCreate", async message => { if (!message.guild || message.guild.id !== guild.id) return;
            if (!message.content.toLowerCase().includes("ye")) return;
            const word = message.content.toLowerCase().split(" ").filter(e => e.includes("ye") && e.startsWith("y"))
            if (!word.length) return;
            const document = await guilds.get(message.guild.id)
            // give out word that is used the most in the array
            const mostUsed = word.reduce((a, b) => word.filter(e => e === a).length > word.filter(e => e === b).length ? a : b)
            if (!document.handlerDatabase.yeCounter) document.handlerDatabase = {...document.handlerDatabase, yeCounter: {}}
            if (!document.handlerDatabase.yeCounter[message.author.id]) document.handlerDatabase.yeCounter[message.author.id] = {}
            document.handlerDatabase = {
                ...document.handlerDatabase,
                yeCounter: {
                    ...(document.handlerDatabase.yeCounter || {}),
                    [message.author.id]: {
                        ...document.handlerDatabase.yeCounter[message.author.id],
                        [mostUsed]: (document.handlerDatabase.yeCounter[message.author.id][mostUsed] || 0) + 1
                    }
                }
            }
            await document.safeSave()
        })
    }
} as GuildHandler