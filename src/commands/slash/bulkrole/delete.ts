import {SlashCommand} from "../../../@types/command";
import {bulkRoleList} from "../../../constants/autocompleters";

export default {
    description: "Deletes a bulk role",
    options: [
        {
            type: "STRING",
            name: "bulkrole",
            description: "The bulk role to delete",
            required: true,
            autocomplete: true
        }
    ],
    autocompletes: {
        bulkrole: bulkRoleList
    },
    execute: (interaction, _, {bulkrole}: {bulkrole: string}, document) => {
        console.log(bulkrole)
        if (!document.bulkRoles.find(e => e.roleId === bulkrole)) {
            return interaction.reply({
                content: "That bulk role doesn't exist",
                ephemeral: true
            });
        }

        document.bulkRoles = document.bulkRoles.filter(e => e.roleId !== bulkrole);
        document.safeSave();

        return interaction.reply({
            content: `Bulk role **${bulkrole}** deleted`,
            ephemeral: true
        });
    }
} as SlashCommand
