import { inviteUrl } from "../../constants/links";

const basics: Array<{
  triggers: Array<string>;
  message: string;
}> = [
  {
    triggers: ["invite", "inviteme", "addme"],
    message: `🔗 Invite me: <${inviteUrl}>`,
  }
];

export default basics;
