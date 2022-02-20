import * as guilds from "../../database/guilds";
import { AutocompleteInteraction } from "discord.js";
import { SlashCommand } from "../../@types/command";

export default async (interaction: AutocompleteInteraction): Promise<void> => {
  const path = [interaction.commandName, interaction.options.getSubcommandGroup(false), interaction.options.getSubcommand(false)].filter(Boolean);

  const commandFile = (await import(`../../commands/slash/${path.join("/")}`)).default as SlashCommand;
  const autocompletes = commandFile.autocompletes || {};

  const { name, value } = interaction.options.getFocused(true);
  const autocomplete = autocompletes[name];

  if (autocomplete && interaction.guildId) {
    const document = await guilds.get(interaction.guildId);
    autocomplete(value, interaction, document).then(response => interaction.respond(response));
  }
};
