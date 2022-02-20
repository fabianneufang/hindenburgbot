import {SlashCommand} from "../../@types/command";
import * as fetch from "node-fetch";
import {APIInvite, InviteTargetType, RESTPostAPIChannelInviteJSONBody, RouteBases, Routes} from "discord-api-types/v10";
import config from "../../config";
import {activityList} from "../../constants/autocompleters";

export default {
    description: "Start or join a voice channel activity",
    options: [
        {
            type: "CHANNEL",
            name: "channel",
            description: "The voice channel to do the activity in",
            channelTypes: ["GUILD_VOICE"],
            required: true,
        },
        {
            type: "STRING",
            name: "activity",
            description: "Which activity to do in the channel",
            required: true,
            autocomplete: true
        }
    ],
    autocompletes: {
        activity: activityList
    },
    execute: async (interaction, ephemeralPreference, {channel: channelId, activity: activityId}: {channel: string, activity: string}) => {
        const r = await fetch.default(`${RouteBases.api}${Routes.channelInvites(channelId)}`, {
            method: "POST",
            headers: {
                authorization: `Bot ${config.client.token}`,
                "content-type": "application/json"
            },
            body: JSON.stringify({
                max_age: 0,
                target_type: InviteTargetType.EmbeddedApplication,
                target_application_id: activityId
            } as RESTPostAPIChannelInviteJSONBody)
        })

        const invite = await r.json() as APIInvite

        if (r.status !== 200) {
            interaction.reply({
                content: `An error occured: ${(invite as any).message}\nMake sure I have the "Create Invite" permission in the voice channel!`,
                ephemeral: true
            })
        }

        interaction.reply({
            content: `[Click to open ${invite.target_application!.name} in ${invite.channel!.name}](<https://discord.gg/${invite.code}>)`,
            ephemeral: true
        })
    }
} as SlashCommand
