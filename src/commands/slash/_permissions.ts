import { CommandPermissionLevel } from "../../constants/permissions";

const permissions: Record<string, CommandPermissionLevel> = {
  data: "OWNER",
  bulkrole: "ADMIN",
  reversepurge: "MOD"
};

export default permissions;
