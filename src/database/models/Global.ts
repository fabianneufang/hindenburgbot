import { DocumentType, getModelForClass, prop } from "@typegoose/typegoose";
import { BeAnObject } from "@typegoose/typegoose/lib/types";
import { getWeek } from "../../utils/time";

export class Global {
  @prop({ type: Number, default: getWeek }) week!: number;
}

export type GlobalDocument = DocumentType<Global, BeAnObject>;

export default getModelForClass(Global);
