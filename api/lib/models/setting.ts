import { Document, Model, model, ObjectId, Schema, Types } from "mongoose";

// General Subdocument Schema
const GeneralSchema = new Schema({
  name       : String,
  title      : String,
  version    : String,
  description: String
},
{
  _id        : false,
})
// Device Subdocument Schema
const DeviceSchema = new Schema({
  name       : String,
  description: String
},
{
  _id        : false,
})

export const SettingSchema: any = new Schema({
  general: GeneralSchema,
  device: DeviceSchema,
  userUUID: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
});

// General Setting interface
export interface IGeneral {
  name       : string;
  title      : string;
  version    : string;
  description: string;
}
// Device Setting interface
export interface IDevice {
  name       : string;
  description: string;
}
// Setting interface
export interface ISetting {
  general : IGeneral;
  device  : IDevice;
  userUUID: Types.ObjectId;
}
// Not directly exported because it is not recommanded to
// use this interface direct unless necessarys since the
// type of `company` field is not deterministic
interface ISettingBaseDocument extends ISetting, Document {
}
// Export this for strong typing
export type ISettingPopulatedDocument = ISettingBaseDocument;
// Export this for strong typing
export type ISettingDocument = ISettingBaseDocument;

// Document middlewares

// Methods
SettingSchema.statics.findMyRoot = async function (rootId) {
  return this.findOne({
    userUUID: rootId
  }).populate("Root").exec();
};
// For model
export interface ISettingModel extends Model<ISettingDocument> {
  findMyRoot(rootId: string): Promise<ISettingPopulatedDocument>;
}


export default model<ISettingDocument, ISettingModel>("Setting", SettingSchema);
