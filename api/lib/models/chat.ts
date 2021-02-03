import { Document, Model, model, Schema, Types } from "mongoose";

export const ChatSchema: any = new Schema({
  message: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now,
  },
  serderUUID: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiverUUID: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// Chat interface
export interface IChat {
  message     : string;
  created     : Date;
  serderUUID  : Types.ObjectId;
  receiverUUID: Types.ObjectId;
}
// Not directly exported because it is not recommanded to
// use this interface direct unless necessarys since the
// type of `company` field is not deterministic
interface IChatBaseDocument extends IChat, Document {
}

// Document middlewares

// Methods

// Export this for strong typing
export type IChatDocument = IChatBaseDocument;

// For model
export type IChatModel = Model<IChatDocument>;

export default model<IChatDocument, IChatModel>("Chat", ChatSchema);
