import { ContextMenuCommand } from "../../@types/command";
import { ContextMenuInteraction } from "discord.js";
import { GuildDocument } from "../../database/models/Guild";
import config from "../../config";

export default async (interaction: ContextMenuInteraction, document: GuildDocument): Promise<void> => {
  if (!interaction.guild) return;
  const commands = config.guild ? interaction.client.guilds.cache.get(config.guild)?.commands : interaction.client.application?.commands;
  const command = commands?.cache.find(c => c.name === interaction.commandName);

  if (command) {
    const commandFile = (await import(`../../commands/${interaction.targetType === "USER" ? "user" : "message"}/${command.name}`)).default as ContextMenuCommand;

    commandFile.execute(interaction, false, interaction.targetId, document);
  }
};
