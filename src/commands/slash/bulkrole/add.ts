import { string } from "mathjs";
import {SlashCommand} from "../../../@types/command";

export default {
    description: "Creates a bulk role.",
    options: [
        {
            type: "ROLE",
            name: "role",
            description: "The role to add to the bulk role.",
            required: true
        },
        {
            type: "STRING",
            name: "name",
            description: "The name of the bulk role.",
            required: true
        }
    ],
    execute: (interaction, ephemeralPreference, {role: roleId, name}: {role?: string; name?: string}, document) => {
        // when channel id or name is not defined fail
        if (!roleId || !name) {
            return interaction.reply({
                content: "You must provide a channel and a name for the bulk role.",
                ephemeral: true
            });
        }

        if (document.bulkRoles.find(e => e.name === name)) {
            return interaction.reply({
                content: "A bulk role with that name already exists.",
                ephemeral: true,
            });
        }

        // when name contains spaces reject
        if (name.includes(" ")) {
            return interaction.reply({
                content: "Bulk roles cannot contain spaces.",
                ephemeral: true,
            });
        }

        // when name is too long reject
        if (name.length > 32) {
            return interaction.reply({
                content: "Bulk roles cannot be longer than 32 characters.",
                ephemeral: true,
            });
        }

        // when name does not only contain ascii characters reject
        if (!/^[\x00-\x7F]*$/.test(name)) {
            return interaction.reply({
                content: "Bulk roles can only contain ASCII characters.",
                ephemeral: true,
            });
        }

        // when name is not a valid name reject
        if (!/^[a-zA-Z0-9-_]+$/.test(name)) {
            return interaction.reply({
                content: "Bulk roles can only contain letters, numbers, dashes, and underscores.",
                ephemeral: true,
            });
        }

        console.log(roleId)

        document.bulkRoles.push({name, roleId})
        document.safeSave()

        return interaction.reply({
            content: `Bulk role ${name} created.`,
            ephemeral: true,
        });
    }
} as SlashCommand
