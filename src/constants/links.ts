import config from "../config";

export const inviteUrl = `https://discord.com/api/oauth2/authorize?client_id=${config.client.id}&permissions=8scope=applications.commands%20bot`;
