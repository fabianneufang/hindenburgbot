import {MentionCommand} from "../../@types/command";
import {getMember} from "../../constants/resolvers";
import {BulkRole} from "../../database/models/Guild";

export default {
    execute: async (message, reply, args, document, {content}) => {
        if (!message.guild) return reply("This command can only be used in a server.");
        const roles = content
            .split("\n")
            .map(e => e.split(","))
        let botMsg = await reply("Processing...");
        let givenRoles = 0
        for (const role of roles) {
            try {
                if (!document.bulkRoles.find(e => e.name.toLowerCase() === role[1].toLowerCase())) {
                    message.reply(`Role **${role[1]}**not found!`)
                    continue
                }
                const user = await getMember(role[0], message.guild)
                if (!user) {
                    message.reply(`User **${role[0]}**not found!`)
                    continue
                }
                for (const existingBulkRole of document.bulkRoles) {
                    if (user.roles.cache.find(e => e.id === existingBulkRole.roleId)) {
                        await user.roles.remove(existingBulkRole.roleId)
                    }
                }
                await user.roles.add((document.bulkRoles.find(e => e.name.toLowerCase() === role[1].toLowerCase()) as BulkRole).roleId)
                givenRoles++
            } catch (e) {
                message.reply(`An error occured while trying to add roles for **${role[1]}**`)
            }
        }
        return botMsg.edit(`Successfully changed roles for ${givenRoles}.`);
    }
} as MentionCommand
