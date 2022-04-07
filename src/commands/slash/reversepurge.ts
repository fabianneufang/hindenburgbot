import { TextChannel } from "discord.js";
import {SlashCommand} from "../../@types/command";

export default {
    description: "Purge from a message ID all the way to present time.",
    options: [
        {
            type: "STRING",
            name: "message",
            description: "The message to purge after",
            required: true
        },
        {
            type: "BOOLEAN",
            name: "self",
            description: "Delete the message too",
            required: false
        }
    ],
    execute: async (interaction, _, {message: messageId, self}: {message: string, self?: boolean}) => {
        self = self ?? false;
        let after = parseInt(messageId)
        if (!after) return interaction.reply({
            content: "Invalid message ID.",
            ephemeral: true
        })
        if (!interaction.channel) return interaction.reply({
            content: "Can only be run in servers.",
            ephemeral: true
        })

        await interaction.deferReply({
            ephemeral: true
        })

        after += 1;
        let processing = true, amount = 0;
        while (processing) {
            let id = after.toString()
            let messages = (await interaction.channel.messages.fetch({limit: 100, after: id})).filter(m => parseInt(m.id) > after, true).map(e => e)
            if (!messages.length) processing = false;
            else {
                await (interaction.channel as TextChannel).bulkDelete(messages)
                amount += messages.length;
            }
        }
  
        if (self) {
            (await interaction.channel.messages.fetch(messageId)).delete()
            amount += 1
        }

        interaction.editReply({
            content: ":white_check_mark: Purged " + amount + " messages."
        })
    }
} as SlashCommand
