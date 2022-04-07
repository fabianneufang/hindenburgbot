import {DocumentType, getModelForClass, prop, PropType} from "@typegoose/typegoose";
import {BeAnObject} from "@typegoose/typegoose/lib/types";
import {WhatIsIt} from "@typegoose/typegoose/lib/internal/constants";

const saveQueue = new Map();

export class BulkRole {
  @prop({ type: String, unique: true, required: true })
  roleId!: string;

  @prop({ type: String, unique: true, required: true })
  name!: string;
}

export class Guild {
  @prop({ type: String, unique: true, required: true })
  guildId!: string;

  @prop({ type: [BulkRole], default: [] }, WhatIsIt.ARRAY)
  bulkRoles!: BulkRole[];

  @prop({ type: String, default: "{}" })
  private handlerDatabaseData!: string;

  get handlerDatabase(): Record<string, any> {
    return JSON.parse(this.handlerDatabaseData)
  }
  set handlerDatabase(val: Record<string, any>) {
    this.handlerDatabaseData = JSON.stringify(val)
  }



  // we can't save in parallell, and although we can await the guild.save(), that would not work across files.

  safeSave(this: GuildDocument) {
    if (!saveQueue.has(this.guildId)) {
      saveQueue.set(this.guildId, 1);
      this.save().then(() => {
        if (saveQueue.get(this.guildId) === 2) {
          saveQueue.delete(this.guildId);
          this.safeSave();
        } else saveQueue.delete(this.guildId);
      });
    } else saveQueue.set(this.guildId, 2);
  }
}

export type GuildDocument = DocumentType<Guild, BeAnObject>;

export default getModelForClass(Guild);
