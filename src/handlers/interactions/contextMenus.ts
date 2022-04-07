import { ContextMenuCommand } from "../../@types/command";
import { ContextMenuInteraction } from "discord.js";
import { GuildDocument } from "../../database/models/Guild";
import config from "../../config";
import {asyncImport} from "../../utils/import";
import {join} from "path";
import {catalog} from "../../guilds/catalog";

export default async (interaction: ContextMenuInteraction, document: GuildDocument): Promise<void> => {
  if (!interaction.guild) return;
  const commands = config.guild ? interaction.client.guilds.cache.get(config.guild)?.commands : interaction.client.application?.commands;
  const command = commands?.cache.find(c => c.name === interaction.commandName);

  if (command) {
    const commandFile =
        (await asyncImport(join(__dirname, `../../commands/${interaction.targetType === "USER" ? "user" : "message"}/${command.name}`)) ||
         await asyncImport(join(__dirname, `../../guilds/${Object.keys(catalog).find(key => catalog[key] === interaction.guildId)}/commands/${interaction.targetType === "USER" ? "user" : "message"}/${command.name}`)))
            .default as ContextMenuCommand

    commandFile.execute(interaction, false, interaction.targetId, document);
  }
};
