import { Client, PresenceData } from "discord.js";
import config from "../../config";
import superagent from "superagent";

export function getPresence(client: Client): Promise<PresenceData> {
  if (!client.isReady()) return Promise.resolve({ status: "dnd" });

  return Promise.resolve({
    status: "online",
    activities: [
      {
        type: "WATCHING",
        name: "",
      },
    ]
  });
}
