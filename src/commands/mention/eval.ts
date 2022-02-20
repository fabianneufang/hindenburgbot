import { MentionCommand } from "../../@types/command";
import { inspect } from "util";

export default {
  execute: async (message, reply, args) => {
    try {
      const code = args.join(" ");
      const evaled = eval(code);

      console.log(args)

      if (evaled instanceof Promise) {
        const start = Date.now();
        return await Promise.all([reply("♨️ Running..."), evaled]).then(([botMsg, output]) => {
          botMsg.edit(`🆗 Evaluated successfully (\`${Date.now() - start}ms\`).\n\`\`\`js\n${
            typeof output !== "string" ? inspect(output) : output
          }\`\`\``);
          return botMsg;
        });
      } return await reply(`🆗 Evaluated successfully.\n\`\`\`js\n${
        typeof evaled !== "string" ? inspect(evaled) : evaled
      }\`\`\``);

    } catch (e) {
      return reply(`🆘 JavaScript failed.\n\`\`\`fix\n${
        typeof e == "string" ? e.replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`) : e
      }\`\`\``);
    }
  },
  minArguments: 1,
} as MentionCommand;
